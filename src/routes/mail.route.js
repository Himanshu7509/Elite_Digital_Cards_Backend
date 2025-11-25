import express from "express";
import { 
  sendSingleMail, 
  sendGroupMail, 
  uploadFiles,
  getSentMails,
  getSentMailById
} from "../controllers/mail.controller.js";
import { authMiddleware, adminAuth } from "../middleware/auth.middleware.js";

const mailRouter = express.Router();

// Apply file upload middleware to routes that need it
mailRouter.post("/send-single", authMiddleware, adminAuth, uploadFiles.array('attachments', 5), sendSingleMail);
mailRouter.post("/send-group", authMiddleware, adminAuth, uploadFiles.array('attachments', 5), sendGroupMail);

// GET routes for tracking sent emails
mailRouter.get("/", authMiddleware, adminAuth, getSentMails);
mailRouter.get("/:id", authMiddleware, adminAuth, getSentMailById);

export default mailRouter;