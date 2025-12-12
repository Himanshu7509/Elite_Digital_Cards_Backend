import StudentSkill from '../models/studentSkill.model.js';

// Create student skill
const createStudentSkill = async (req, res) => {
  try {
    const { name, level } = req.body;

    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create skills'
      });
    }

    const skill = new StudentSkill({
      userId: req.user.id,
      name,
      level
    });

    await skill.save();

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating skill',
      error: error.message
    });
  }
};

// Get all skills for the student
const getMyStudentSkills = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access skills'
      });
    }

    const skills = await StudentSkill.find({ userId: req.user.id });
    
    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching skills',
      error: error.message
    });
  }
};

// Get skill by ID
const getStudentSkillById = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access skills'
      });
    }

    const { id } = req.params;
    
    const skill = await StudentSkill.findOne({ _id: id, userId: req.user.id });
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching skill',
      error: error.message
    });
  }
};

// Update student skill
const updateStudentSkill = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can update skills'
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
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating skill',
      error: error.message
    });
  }
};

// Delete student skill
const deleteStudentSkill = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can delete skills'
      });
    }

    const { id } = req.params;
    
    const skill = await StudentSkill.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting skill',
      error: error.message
    });
  }
};

// Admin: Get all student skills
const getAllStudentSkills = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access all skills'
      });
    }

    const skills = await StudentSkill.find().populate('userId', 'email role');
    
    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching skills',
      error: error.message
    });
  }
};

// Admin: Get specific student skill
const getAdminStudentSkillById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access skills'
      });
    }

    const { id } = req.params;
    
    const skill = await StudentSkill.findById(id).populate('userId', 'email role');
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching skill',
      error: error.message
    });
  }
};

// Admin: Update student skill
const updateAdminStudentSkill = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update skills'
      });
    }

    const { id } = req.params;
    const { name, level } = req.body;

    const skill = await StudentSkill.findByIdAndUpdate(
      id,
      { name, level },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating skill',
      error: error.message
    });
  }
};

// Admin: Delete student skill
const deleteAdminStudentSkill = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete skills'
      });
    }

    const { id } = req.params;
    
    const skill = await StudentSkill.findByIdAndDelete(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting skill',
      error: error.message
    });
  }
};

export {
  createStudentSkill,
  getMyStudentSkills,
  getStudentSkillById,
  updateStudentSkill,
  deleteStudentSkill,
  getAllStudentSkills,
  getAdminStudentSkillById,
  updateAdminStudentSkill,
  deleteAdminStudentSkill
};