import Service from '../models/service.model.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create service
const createService = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    // Use the provided userId if it exists (admin creating for client), otherwise use the authenticated user's ID
    const serviceUserId = userId || req.user.id;

    const service = new Service({
      userId: serviceUserId,
      title,
      description
    });

    await service.save();

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

// Get all services for the user
const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ userId: req.user.id });
    
    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

// Get service by ID
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findOne({ _id: id, userId: req.user.id });
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

// Get public services by user ID
const getPublicServices = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const services = await Service.find({ userId: userId });
    
    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

// Update service
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const service = await Service.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, description },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

// Delete service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
};

// Admin: Get all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('userId', 'email role');
    
    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

// Admin: Get specific service
const getAdminServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findById(id).populate('userId', 'email role');
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

// Admin: Update service
const updateAdminService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const service = await Service.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    ).populate('userId', 'email role');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

// Admin: Delete service
const deleteAdminService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
};

export {
  createService,
  getMyServices,
  getPublicServices,
  getServiceById,
  updateService,
  deleteService,
  getAllServices,
  getAdminServiceById,
  updateAdminService,
  deleteAdminService
};