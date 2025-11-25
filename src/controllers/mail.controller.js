import { Resend } from "resend";
import User from "../models/auth.model.js";
import Profile from "../models/profile.model.js";
import MailTracking from "../models/MailTracking.model.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from 'axios';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to extract message ID from Resend response
const extractMessageId = (response) => {
  // Handle different possible response structures
  if (response && response.id) {
    return response.id;
  }
  if (response && response.data && response.data.id) {
    return response.data.id;
  }
  // Generate fallback ID if none found
  return `fallback-${uuidv4()}`;
};

// Helper function to ensure clientIds is always an array
const normalizeClientIds = (clientIds) => {
  if (!clientIds) return [];
  if (Array.isArray(clientIds)) return clientIds;
  if (typeof clientIds === "string") {
    // Check if it's a JSON string
    if (clientIds.startsWith("[") && clientIds.endsWith("]")) {
      try {
        const parsed = JSON.parse(clientIds);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        return [clientIds];
      }
    }
    return [clientIds];
  }
  return [];
};

// ✅ Send mail to a single client
export const sendSingleMail = async (req, res) => {
  try {
    const { clientId, subject, message } = req.body;
    // Get sender information from authenticated user
    const sender = req.user ? `${req.user.email} (${req.user.role})` : "Elite Digital Cards";
    const senderEmail = req.user ? req.user.email : "noreply@elitedigitalcards.com";
    const senderRole = req.user ? req.user.role : "system";

    const client = await User.findById(clientId);
    if (!client || client.role !== 'client') return res.status(404).json({ success: false, message: "Client not found" });

    // Get client profile for name
    const profile = await Profile.findOne({ userId: clientId });

    // Prepare attachments if any
    const attachments = [];
    const attachmentInfo = [];
    if (req.files) {
      for (const file of req.files) {
        attachments.push({
          filename: file.originalname,
          content: file.buffer,
        });
        attachmentInfo.push({
          filename: file.originalname,
          size: file.size
        });
      }
    }

    // Send email with enhanced business template
    const emailResponse = await resend.emails.send({
      from: "Elite Digital Cards <noreply@elitedigitalcards.com>",
      to: client.email,
      subject,
      html: `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa;">
          <tr>
            <td align="center" style="padding: 30px 0;">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Elite Digital Cards</h1>
                    <p style="color: rgba(255,255,255,0.95); margin: 10px 0 0 0; font-size: 18px;">Digital Business Cards Platform</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #2d3748; margin: 0 0 25px 0; font-size: 24px; font-weight: 600;">Hello ${profile?.name || "Valued Client"},</h2>
                    
                    <div style="color: #4a5568; line-height: 1.7; font-size: 16px;">
                      ${message.split("\n").map(paragraph => `<p style="margin: 0 0 20px 0;">${paragraph}</p>`).join("")}
                    </div>
                    
                    <div style="background-color: #fffbeb; border-radius: 10px; padding: 20px; border-left: 4px solid #f59e0b; margin: 30px 0;">
                      <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 18px; font-weight: 600;">Message Details</h3>
                      <p style="margin: 0 0 10px 0; color: #92400e;"><strong>Subject:</strong> ${subject}</p>
                      <p style="margin: 0; color: #92400e;">This message was sent from Elite Digital Cards platform.</p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f8fafc; border-top: 1px solid #edf2f7;">
                    <div style="text-align: center; color: #4a5568; font-size: 14px;">
                      <div style="margin-bottom: 20px;">
                        <h3 style="margin: 0 0 15px 0; color: #2d3748; font-weight: 600;">Need Help?</h3>
                        <p style="margin: 0 0 15px 0;">Our support team is here to assist you with any questions or issues.</p>
                        <div style="background-color: #667eea; display: inline-block; padding: 12px 25px; border-radius: 6px;">
                          <a href="mailto:info@eliteassociate.in" style="color: white; text-decoration: none; font-weight: 500;">📧 Contact Support: info@eliteassociate.in</a>
                        </div>
                      </div>
                      
                      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
                      
                      <p style="margin: 0;">
                        © ${new Date().getFullYear()} Elite Digital Cards. All rights reserved.
                      </p>
                      <p style="margin: 10px 0 0 0; font-size: 12px; color: #718096;">
                        This email was sent to ${client.email} regarding your Elite Digital Cards account.
                      </p>
                      <p style="margin: 10px 0 0 0; font-size: 12px; color: #718096;">
                        Elite Digital Cards, a product of Elite Associate
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    // Extract or generate messageId
    const messageId = extractMessageId(emailResponse);

    // Save tracking information
    try {
      if (MailTracking) {
        await MailTracking.create({
          messageId: messageId,
          senderEmail: senderEmail,
          senderRole: senderRole,
          recipients: [client.email],
          recipientType: "single",
          subject: subject,
          attachments: attachmentInfo,
          clientIds: [clientId]
        });
      }
    } catch (trackingError) {
      console.error("Failed to save mail tracking information:", trackingError);
    }

    res.status(200).json({ 
      success: true, 
      message: `Mail sent to ${client.email}`, 
      sender,
      messageId: messageId
    });
  } catch (error) {
    console.error("Error sending mail:", error);
    res.status(500).json({ success: false, message: "Failed to send mail", error: error.message });
  }
};

// ✅ Send mail to multiple clients (group)
export const sendGroupMail = async (req, res) => {
  try {
    const { clientIds, subject, message } = req.body;
    
    // Normalize clientIds to ensure it's always an array
    const clientIdsArray = normalizeClientIds(clientIds);
    
    // Get sender information from authenticated user
    const sender = req.user ? `${req.user.email} (${req.user.role})` : "Elite Digital Cards";
    const senderEmail = req.user ? req.user.email : "noreply@elitedigitalcards.com";
    const senderRole = req.user ? req.user.role : "system";

    // Fetch all clients
    const clients = await User.find({ _id: { $in: clientIdsArray }, role: 'client' });
    const emails = clients.map((client) => client.email);

    if (emails.length === 0) {
      return res.status(404).json({ success: false, message: "No valid clients found" });
    }

    // Prepare attachments - handle both uploaded files and URL-based attachments
    const attachments = [];
    const attachmentInfo = [];
    
    // Handle uploaded files (existing code)
    if (req.files) {
      for (const file of req.files) {
        attachments.push({
          filename: file.originalname,
          content: file.buffer,
        });
        attachmentInfo.push({
          filename: file.originalname,
          size: file.size
        });
      }
    }
    
    // NEW: Handle URL-based attachments
    const attachmentUrls = Array.isArray(req.body.attachmentUrls) ? req.body.attachmentUrls : 
                          (req.body.attachmentUrls ? [req.body.attachmentUrls] : []);
    const attachmentNames = Array.isArray(req.body.attachmentNames) ? req.body.attachmentNames : 
                            (req.body.attachmentNames ? [req.body.attachmentNames] : []);
    
    // Download files from URLs if provided
    if (attachmentUrls.length > 0) {
      for (let i = 0; i < attachmentUrls.length; i++) {
        try {
          const url = attachmentUrls[i];
          const name = attachmentNames[i] || `attachment-${i + 1}`;
          
          // Download the file
          const response = await axios.get(url, { 
            responseType: 'arraybuffer',
            timeout: 10000 // 10 second timeout
          });
          
          // Create attachment object
          attachments.push({
            filename: name,
            content: response.data,
          });
          
          // Add to attachment info
          attachmentInfo.push({
            filename: name,
            size: response.data.length
          });
        } catch (downloadError) {
          console.error(`Error downloading file from ${attachmentUrls[i]}:`, downloadError);
          // Continue with other attachments even if one fails
        }
      }
    }

    // Send email with enhanced business template using BCC for privacy
    const emailResponse = await resend.emails.send({
      from: "Elite Digital Cards <noreply@elitedigitalcards.com>",
      to: ["me@elitedigitalcards.com"], // Primary recipient (sender)
      bcc: emails, // Blind carbon copy to all clients (hides email addresses from each other)
      subject,
      html: `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa;">
          <tr>
            <td align="center" style="padding: 30px 0;">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Elite Digital Cards</h1>
                    <p style="color: rgba(255,255,255,0.95); margin: 10px 0 0 0; font-size: 18px;">Digital Business Cards Platform</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #2d3748; margin: 0 0 25px 0; font-size: 24px; font-weight: 600;">Dear Valued Client,</h2>
                    
                    <div style="color: #4a5568; line-height: 1.7; font-size: 16px;">
                      ${message.split("\n").map(paragraph => `<p style="margin: 0 0 20px 0;">${paragraph}</p>`).join("")}
                    </div>
                    
                    <div style="background-color: #fffbeb; border-radius: 10px; padding: 20px; border-left: 4px solid #f59e0b; margin: 30px 0;">
                      <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 18px; font-weight: 600;">Message Details</h3>
                      <p style="margin: 0 0 10px 0; color: #92400e;"><strong>Subject:</strong> ${subject}</p>
                      <p style="margin: 0; color: #92400e;">This is a group message sent to multiple recipients from Elite Digital Cards platform.</p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f8fafc; border-top: 1px solid #edf2f7;">
                    <div style="text-align: center; color: #4a5568; font-size: 14px;">
                      <div style="margin-bottom: 20px;">
                        <h3 style="margin: 0 0 15px 0; color: #2d3748; font-weight: 600;">Need Help?</h3>
                        <p style="margin: 0 0 15px 0;">Our support team is here to assist you with any questions or issues.</p>
                        <div style="background-color: #667eea; display: inline-block; padding: 12px 25px; border-radius: 6px;">
                          <a href="mailto:info@eliteassociate.in" style="color: white; text-decoration: none; font-weight: 500;">📧 Contact Support: info@eliteassociate.in</a>
                        </div>
                      </div>
                      
                      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
                      
                      <p style="margin: 0;">
                        © ${new Date().getFullYear()} Elite Digital Cards. All rights reserved.
                      </p>
                      <p style="margin: 10px 0 0 0; font-size: 12px; color: #718096;">
                        This is a group message sent to multiple recipients.
                      </p>
                      <p style="margin: 10px 0 0 0; font-size: 12px; color: #718096;">
                        Elite Digital Cards, a product of Elite Associate
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    // Extract or generate messageId
    const messageId = extractMessageId(emailResponse);

    // Save tracking information
    try {
      if (MailTracking) {
        await MailTracking.create({
          messageId: messageId,
          senderEmail: senderEmail,
          senderRole: senderRole,
          recipients: emails,
          recipientType: "group",
          subject: subject,
          attachments: attachmentInfo,
          clientIds: clientIdsArray
        });
      }
    } catch (trackingError) {
      console.error("Failed to save group mail tracking information:", trackingError);
    }

    res.status(200).json({
      success: true,
      message: `Group mail sent to ${emails.length} clients`,
      emails,
      sender,
      messageId: messageId
    });
  } catch (error) {
    console.error("Error sending group mail:", error);
    res.status(500).json({ success: false, message: "Failed to send group mail", error: error.message });
  }
};

// ✅ Get all sent emails with sender information
export const getSentMails = async (req, res) => {
  try {
    const { page = 1, limit = 10, senderEmail, recipientType } = req.query;
    
    // Build filter object
    let filter = {};
    if (senderEmail) filter.senderEmail = senderEmail;
    if (recipientType) filter.recipientType = recipientType;
    
    // Check if MailTracking model is available
    if (!MailTracking) {
      return res.status(500).json({ success: false, message: "Mail tracking not available" });
    }
    
    // Get paginated results
    const mails = await MailTracking.find(filter)
      .sort({ sentAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("clientIds", "email");
      
    // Get total count
    const total = await MailTracking.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      mails,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalMails: total
    });
  } catch (error) {
    console.error("Error fetching sent mails:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sent mails", error: error.message });
  }
};

// ✅ Get specific sent email by ID
export const getSentMailById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if MailTracking model is available
    if (!MailTracking) {
      return res.status(500).json({ success: false, message: "Mail tracking not available" });
    }
    
    const mail = await MailTracking.findById(id).populate("clientIds", "email");
    
    if (!mail) {
      return res.status(404).json({ success: false, message: "Mail tracking record not found" });
    }
    
    res.status(200).json({ success: true, mail });
  } catch (error) {
    console.error("Error fetching sent mail:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sent mail", error: error.message });
  }
};

// ✅ Configure multer for file upload
export const uploadFiles = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs only
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only image files and PDFs are allowed"));
    }
  }
});