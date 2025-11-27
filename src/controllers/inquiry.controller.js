import Inquiry from '../models/inquiry.model.js';

// Create a new inquiry
const createInquiry = async (req, res) => {
  try {
    const { fullName, email, phone, message } = req.body;

    // Create new inquiry
    const inquiry = new Inquiry({
      fullName,
      email,
      phone,
      message
    });

    await inquiry.save();

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: inquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting inquiry',
      error: error.message
    });
  }
};

// Get all inquiries (admin only)
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: inquiries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching inquiries',
      error: error.message
    });
  }
};

// Get inquiry by ID (admin only)
const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const inquiry = await Inquiry.findById(id);
    
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching inquiry',
      error: error.message
    });
  }
};

// Delete inquiry by ID (admin only)
const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    
    const inquiry = await Inquiry.findByIdAndDelete(id);
    
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting inquiry',
      error: error.message
    });
  }
};

export {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  deleteInquiry
};