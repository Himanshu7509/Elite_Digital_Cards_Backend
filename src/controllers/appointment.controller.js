import Appointment from '../models/appointment.model.js';
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
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
  getAdminAppointmentById,
  updateAdminAppointment,
  deleteAdminAppointment
};