import StudentSkill from '../models/studentSkill.model.js';
import User from '../models/auth.model.js';

// Create a new student skill
const createStudentSkill = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create skills'
      });
    }

    const { name, level } = req.body;

    const skill = new StudentSkill({
      userId: req.user.id,
      name,
      level
    });

    await skill.save();

    res.status(201).json({
      success: true,
      message: 'Student skill created successfully',
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating student skill',
      error: error.message
    });
  }
};

// Get all skills for the logged-in student
const getMyStudentSkills = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access their skills'
      });
    }

    const skills = await StudentSkill.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student skills',
      error: error.message
    });
  }
};

// Get public skills for a student (read-only access for anyone)
const getPublicStudentSkills = async (req, res) => {
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

    const skills = await StudentSkill.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student skills',
      error: error.message
    });
  }
};

// Update a student skill
const updateStudentSkill = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can update their skills'
      });
    }

    const { id } = req.params;
    const { name, level } = req.body;

    const skill = await StudentSkill.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { name, level },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Student skill not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student skill updated successfully',
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student skill',
      error: error.message
    });
  }
};

// Delete a student skill
const deleteStudentSkill = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can delete their skills'
      });
    }

    const { id } = req.params;

    const skill = await StudentSkill.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Student skill not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student skill deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student skill',
      error: error.message
    });
  }
};

// Admin: Get all skills for a specific student
const getStudentSkills = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access student skills'
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

    const skills = await StudentSkill.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student skills',
      error: error.message
    });
  }
};

// Admin: Delete all skills for a specific student
const deleteAllStudentSkills = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete student skills'
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

    await StudentSkill.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: 'All student skills deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student skills',
      error: error.message
    });
  }
};

export {
  createStudentSkill,
  getMyStudentSkills,
  getPublicStudentSkills,
  updateStudentSkill,
  deleteStudentSkill,
  getStudentSkills,
  deleteAllStudentSkills
};