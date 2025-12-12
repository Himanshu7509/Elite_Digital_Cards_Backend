import StudentAchievement from '../models/studentAchievement.model.js';

// Create student achievement
const createStudentAchievement = async (req, res) => {
  try {
    const { title, issuer, date, description, certificateUrl } = req.body;

    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create achievement records'
      });
    }

    const achievement = new StudentAchievement({
      userId: req.user.id,
      title,
      issuer,
      date,
      description,
      certificateUrl
    });

    await achievement.save();

    res.status(201).json({
      success: true,
      message: 'Achievement record created successfully',
      data: achievement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating achievement record',
      error: error.message
    });
  }
};

// Get all achievements for the student
const getMyStudentAchievements = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access achievement records'
      });
    }

    const achievements = await StudentAchievement.find({ userId: req.user.id });
    
    res.status(200).json({
      success: true,
      data: achievements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching achievement records',
      error: error.message
    });
  }
};

// Get achievement by ID
const getStudentAchievementById = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access achievement records'
      });
    }

    const { id } = req.params;
    
    const achievement = await StudentAchievement.findOne({ _id: id, userId: req.user.id });
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching achievement record',
      error: error.message
    });
  }
};

// Update student achievement
const updateStudentAchievement = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can update achievement records'
      });
    }

    const { id } = req.params;
    const { title, issuer, date, description, certificateUrl } = req.body;

    const achievement = await StudentAchievement.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, issuer, date, description, certificateUrl },
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement record updated successfully',
      data: achievement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating achievement record',
      error: error.message
    });
  }
};

// Delete student achievement
const deleteStudentAchievement = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can delete achievement records'
      });
    }

    const { id } = req.params;
    
    const achievement = await StudentAchievement.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting achievement record',
      error: error.message
    });
  }
};

// Get all achievements for a student (public access)
const getPublicStudentAchievements = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all achievements for the specified user ID
    const achievements = await StudentAchievement.find({ userId: userId });
    
    res.status(200).json({
      success: true,
      data: achievements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching achievement records',
      error: error.message
    });
  }
};

// Admin: Get all student achievements
const getAllStudentAchievements = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access all achievement records'
      });
    }

    const achievements = await StudentAchievement.find().populate('userId', 'email role');
    
    res.status(200).json({
      success: true,
      data: achievements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching achievement records',
      error: error.message
    });
  }
};

// Admin: Get specific student achievement
const getAdminStudentAchievementById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access achievement records'
      });
    }

    const { id } = req.params;
    
    const achievement = await StudentAchievement.findById(id).populate('userId', 'email role');
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching achievement record',
      error: error.message
    });
  }
};

// Admin: Update student achievement
const updateAdminStudentAchievement = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update achievement records'
      });
    }

    const { id } = req.params;
    const { title, issuer, date, description, certificateUrl, userId } = req.body;

    const achievement = await StudentAchievement.findByIdAndUpdate(
      id,
      { title, issuer, date, description, certificateUrl, userId },
      { new: true, runValidators: true }
    ).populate('userId', 'email role');

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement record updated successfully',
      data: achievement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating achievement record',
      error: error.message
    });
  }
};

// Admin: Delete student achievement
const deleteAdminStudentAchievement = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete achievement records'
      });
    }

    const { id } = req.params;
    
    const achievement = await StudentAchievement.findByIdAndDelete(id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting achievement record',
      error: error.message
    });
  }
};

export {
  createStudentAchievement,
  getMyStudentAchievements,
  getStudentAchievementById,
  updateStudentAchievement,
  deleteStudentAchievement,
  getAllStudentAchievements,
  getAdminStudentAchievementById,
  updateAdminStudentAchievement,
  deleteAdminStudentAchievement,
  getPublicStudentAchievements // Export the new function
};