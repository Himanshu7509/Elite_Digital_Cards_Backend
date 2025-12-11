import StudentExperience from '../models/studentExperience.model.js';
import User from '../models/auth.model.js';

// Create a new student experience
const createStudentExperience = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create experiences'
      });
    }

    const { role, company, startDate, endDate, description, isCurrent } = req.body;

    const experience = new StudentExperience({
      userId: req.user.id,
      role,
      company,
      startDate,
      endDate,
      description,
      isCurrent
    });

    await experience.save();

    res.status(201).json({
      success: true,
      message: 'Student experience created successfully',
      data: experience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating student experience',
      error: error.message
    });
  }
};

// Get all experiences for the logged-in student
const getMyStudentExperiences = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access their experiences'
      });
    }

    const experiences = await StudentExperience.find({ userId: req.user.id }).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      data: experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student experiences',
      error: error.message
    });
  }
};

// Get public experiences for a student (read-only access for anyone)
const getPublicStudentExperiences = async (req, res) => {
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

    const experiences = await StudentExperience.find({ userId }).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      data: experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student experiences',
      error: error.message
    });
  }
};

// Update a student experience
const updateStudentExperience = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can update their experiences'
      });
    }

    const { id } = req.params;
    const { role, company, startDate, endDate, description, isCurrent } = req.body;

    const experience = await StudentExperience.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { role, company, startDate, endDate, description, isCurrent },
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Student experience not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student experience updated successfully',
      data: experience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student experience',
      error: error.message
    });
  }
};

// Delete a student experience
const deleteStudentExperience = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can delete their experiences'
      });
    }

    const { id } = req.params;

    const experience = await StudentExperience.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Student experience not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student experience deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student experience',
      error: error.message
    });
  }
};

// Admin: Get all experiences for a specific student
const getStudentExperiences = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access student experiences'
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

    const experiences = await StudentExperience.find({ userId }).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      data: experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student experiences',
      error: error.message
    });
  }
};

// Admin: Delete all experiences for a specific student
const deleteAllStudentExperiences = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete student experiences'
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

    await StudentExperience.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: 'All student experiences deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student experiences',
      error: error.message
    });
  }
};

export {
  createStudentExperience,
  getMyStudentExperiences,
  getPublicStudentExperiences,
  updateStudentExperience,
  deleteStudentExperience,
  getStudentExperiences,
  deleteAllStudentExperiences
};