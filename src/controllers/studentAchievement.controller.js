import StudentAchievement from '../models/studentAchievement.model.js';

// Create student achievement
const createStudentAchievement = async (req, res) => {
  try {
    const { title, desc, date } = req.body;

    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create achievements'
      });
    }

    const achievement = new StudentAchievement({
      userId: req.user.id,
      title,
      desc,
      date
    });

    await achievement.save();

    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: achievement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating achievement',
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
        message: 'Only students can access achievements'
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
      message: 'Error fetching achievements',
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
        message: 'Only students can access achievements'
      });
    }

    const { id } = req.params;
    
    const achievement = await StudentAchievement.findOne({ _id: id, userId: req.user.id });
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching achievement',
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
        message: 'Only students can update achievements'
      });
    }

    const { id } = req.params;
    const { title, desc, date } = req.body;

    const achievement = await StudentAchievement.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, desc, date },
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating achievement',
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
        message: 'Only students can delete achievements'
      });
    }

    const { id } = req.params;
    
    const achievement = await StudentAchievement.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting achievement',
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
        message: 'Only admins can access all achievements'
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
      message: 'Error fetching achievements',
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
        message: 'Only admins can access achievements'
      });
    }

    const { id } = req.params;
    
    const achievement = await StudentAchievement.findById(id).populate('userId', 'email role');
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching achievement',
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
        message: 'Only admins can update achievements'
      });
    }

    const { id } = req.params;
    const { title, desc, date } = req.body;

    const achievement = await StudentAchievement.findByIdAndUpdate(
      id,
      { title, desc, date },
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating achievement',
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
        message: 'Only admins can delete achievements'
      });
    }

    const { id } = req.params;
    
    const achievement = await StudentAchievement.findByIdAndDelete(id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting achievement',
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
  deleteAdminStudentAchievement
};