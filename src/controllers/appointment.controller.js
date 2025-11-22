import Appointment from '../models/appointment.model.js';
import User from '../models/auth.model.js';
import resend from '../config/email.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create appointment
const createAppointment = async (req, res) => {
  try {
    const { clientName, phone, appointmentDate, notes } = req.body;

    const appointment = new Appointment({
      userId: req.user.id,
      clientName,
      phone,
      appointmentDate,
      notes
    });

    await appointment.save();

    // Send email notification to the client
    try {
      // Get the client's email
      const user = await User.findById(req.user.id);
      if (user && user.email) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@eliteassociate.in',
          to: user.email,
          subject: '🎉 New Appointment Booking - Elite Digital Cards',
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
                        <h2 style="color: #2d3748; margin: 0 0 25px 0; font-size: 24px; font-weight: 600;">🎉 New Appointment Booking!</h2>
                        
                        <div style="color: #4a5568; line-height: 1.7; font-size: 16px;">
                          <p style="margin: 0 0 20px 0;">Hello <strong>${user.email}</strong>,</p>
                          
                          <p style="margin: 0 0 25px 0;">Great news! A potential client has booked an appointment through your digital business card. Here are the details:</p>
                          
                          <div style="margin: 30px 0; padding: 25px; background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                            <h3 style="margin: 0 0 20px 0; color: #2d3748; font-size: 20px; font-weight: 600; text-align: center; border-bottom: 2px solid #667eea; padding-bottom: 15px;">Appointment Details</h3>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0;">
                              <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #edf2f7;">
                                  <strong style="color: #4a5568; width: 150px; display: inline-block;">Client Name:</strong>
                                  <span style="color: #2d3748;">${clientName}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #edf2f7;">
                                  <strong style="color: #4a5568; width: 150px; display: inline-block;">Phone Number:</strong>
                                  <span style="color: #2d3748;">${phone}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #edf2f7;">
                                  <strong style="color: #4a5568; width: 150px; display: inline-block;">Appointment Date:</strong>
                                  <span style="color: #2d3748;">${new Date(appointmentDate).toLocaleString()}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 12px 0;">
                                  <strong style="color: #4a5568; width: 150px; display: inline-block; vertical-align: top;">Notes:</strong>
                                  <span style="color: #2d3748;">${notes || 'No additional notes provided'}</span>
                                </td>
                              </tr>
                            </table>
                          </div>
                          
                          <div style="background-color: #fffbeb; border-radius: 10px; padding: 20px; border-left: 4px solid #f59e0b; margin: 30px 0;">
                            <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 18px; font-weight: 600;">💡 Next Steps</h3>
                            <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                              <li style="margin-bottom: 8px;">Contact the client at your earliest convenience</li>
                              <li style="margin-bottom: 8px;">Confirm the appointment details</li>
                              <li style="margin-bottom: 8px;">Prepare any necessary materials for the meeting</li>
                            </ul>
                          </div>
                          
                          <p style="margin: 0 0 25px 0;">This is a great opportunity to connect with a potential client. Make sure to follow up promptly to make a positive impression!</p>
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
                            This email was sent to ${user.email} regarding your Elite Digital Cards account.
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
          </html>`
        });
      }
    } catch (emailError) {
      console.error('Failed to send appointment notification email:', emailError);
      // Don't fail the appointment creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message
    });
  }
};

// Get all appointments for the user
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id }).sort({ appointmentDate: 1 });
    
    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

// Get public appointments by user ID
const getPublicAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ userId: userId }).sort({ appointmentDate: 1 });
    
    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findOne({ _id: id, userId: req.user.id });
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
};

// Update appointment
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientName, phone, appointmentDate, notes } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { clientName, phone, appointmentDate, notes },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message
    });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting appointment',
      error: error.message
    });
  }
};

// Admin: Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('userId', 'email role');
    
    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

// Admin: Get specific appointment
const getAdminAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findById(id).populate('userId', 'email role');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
};

// Admin: Update appointment
const updateAdminAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientName, phone, appointmentDate, notes } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { clientName, phone, appointmentDate, notes },
      { new: true, runValidators: true }
    ).populate('userId', 'email role');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message
    });
  }
};

// Admin: Delete appointment
const deleteAdminAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting appointment',
      error: error.message
    });
  }
};

export {
  createAppointment,
  getMyAppointments,
  getPublicAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
  getAdminAppointmentById,
  updateAdminAppointment,
  deleteAdminAppointment
};