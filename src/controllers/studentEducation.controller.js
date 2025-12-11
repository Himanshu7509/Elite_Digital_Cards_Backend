import StudentEducation from '../models/studentEducation.model.js';
import User from '../models/auth.model.js';

// Create a new student education
const createStudentEducation = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create education records'
      });
    }

    const { degree, major, institution, startDate, endDate, gpa, description } = req.body;

    const education = new StudentEducation({
      userId: req.user.id,
      degree,
      major,
      institution,
      startDate,
      endDate,
      gpa,
      description
    });

    await education.save();

    res.status(201).json({
      success: true,
      message: 'Student education record created successfully',
      data: education
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating student education record',
      error: error.message
    });
  }
};

// Get all education records for the logged-in student
const getMyStudentEducations = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access their education records'
      });
    }

    const educations = await StudentEducation.find({ userId: req.user.id }).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      data: educations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student education records',
      error: error.message
    });
  }
};

// Get public education records for a student (read-only access for anyone)
const getPublicStudentEducations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists and is a student
    const user = await User.findById(userId);
    if (!user || user.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const educations = await StudentEducation.find({ userId }).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      data: educations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student education records',
      error: error.message
    });
  }
};

// Update a student education record
const updateStudentEducation = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can update their education records'
      });
    }

    const { id } = req.params;
    const { degree, major, institution, startDate, endDate, gpa, description } = req.body;

    const education = await StudentEducation.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { degree, major, institution, startDate, endDate, gpa, description },
      { new: true, runValidators: true }
    );

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Student education record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student education record updated successfully',
      data: education
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student education record',
      error: error.message
    });
  }
};

// Delete a student education record
const deleteStudentEducation = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can delete their education records'
      });
    }

    const { id } = req.params;

    const education = await StudentEducation.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Student education record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student education record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student education record',
      error: error.message
    });
  }
};

// Admin: Get all education records for a specific student
const getStudentEducations = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access student education records'
      });
    }

    const { userId } = req.params;

    // Check if user exists and is a student
    const user = await User.findById(userId);
    if (!user || user.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const educations = await StudentEducation.find({ userId }).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      data: educations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student education records',
      error: error.message
    });
  }
};

// Admin: Delete all education records for a specific student
const deleteAllStudentEducations = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete student education records'
      });
    }

    const { userId } = req.params;

    // Check if user exists and is a student
    const user = await User.findById(userId);
    if (!user || user.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await StudentEducation.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: 'All student education records deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student education records',
      error: error.message
    });
  }
};

export {
  createStudentEducation,
  getMyStudentEducations,
  getPublicStudentEducations,
  updateStudentEducation,
  deleteStudentEducation,
  getStudentEducations,
  deleteAllStudentEducations
};