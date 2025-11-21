import Testimonial from '../models/testimonial.model.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create testimonial
const createTestimonial = async (req, res) => {
  try {
    const { testimonialName, feedback } = req.body;

    const testimonial = new Testimonial({
      userId: req.user.id,
      testimonialName,
      feedback
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating testimonial',
      error: error.message
    });
  }
};

// Get all testimonials for the user
const getMyTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ userId: req.user.id });
    
    res.status(200).json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: error.message
    });
  }
};

// Get public testimonials by user ID
const getPublicTestimonials = async (req, res) => {
  try {
    const { userId } = req.params;
    const testimonials = await Testimonial.find({ userId: userId });
    
    res.status(200).json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: error.message
    });
  }
};

// Get testimonial by ID
const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const testimonial = await Testimonial.findOne({ _id: id, userId: req.user.id });
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonial',
      error: error.message
    });
  }
};

// Update testimonial
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { testimonialName, feedback } = req.body;

    const testimonial = await Testimonial.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { testimonialName, feedback },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating testimonial',
      error: error.message
    });
  }
};

// Delete testimonial
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    
    const testimonial = await Testimonial.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting testimonial',
      error: error.message
    });
  }
};

// Admin: Get all testimonials
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().populate('userId', 'email role');
    
    res.status(200).json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: error.message
    });
  }
};

// Admin: Get specific testimonial
const getAdminTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const testimonial = await Testimonial.findById(id).populate('userId', 'email role');
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonial',
      error: error.message
    });
  }
};

// Admin: Update testimonial
const updateAdminTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { testimonialName, feedback } = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { testimonialName, feedback },
      { new: true, runValidators: true }
    ).populate('userId', 'email role');

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating testimonial',
      error: error.message
    });
  }
};

// Admin: Delete testimonial
const deleteAdminTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting testimonial',
      error: error.message
    });
  }
};

export {
  createTestimonial,
  getMyTestimonials,
  getPublicTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  getAllTestimonials,
  getAdminTestimonialById,
  updateAdminTestimonial,
  deleteAdminTestimonial
};