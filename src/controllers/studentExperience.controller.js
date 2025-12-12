import StudentExperience from '../models/studentExperience.model.js';

// Create student experience
const createStudentExperience = async (req, res) => {
  try {
    const { companyName, position, startDate, endDate, description } = req.body;

    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create experience records'
      });
    }

    const experience = new StudentExperience({
      userId: req.user.id,
      companyName,
      position,
      startDate,
      endDate,
      description
    });

    await experience.save();

    res.status(201).json({
      success: true,
      message: 'Experience record created successfully',
      data: experience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating experience record',
      error: error.message
    });
  }
};

// Get all experiences for the student
const getMyStudentExperiences = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access experience records'
      });
    }

    const experiences = await StudentExperience.find({ userId: req.user.id });
    
    res.status(200).json({
      success: true,
      data: experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching experience records',
      error: error.message
    });
  }
};

// Get experience by ID
const getStudentExperienceById = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access experience records'
      });
    }

    const { id } = req.params;
    
    const experience = await StudentExperience.findOne({ _id: id, userId: req.user.id });
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: experience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching experience record',
      error: error.message
    });
  }
};

// Update student experience
const updateStudentExperience = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can update experience records'
      });
    }

    const { id } = req.params;
    const { companyName, position, startDate, endDate, description } = req.body;

    const experience = await StudentExperience.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { companyName, position, startDate, endDate, description },
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Experience record updated successfully',
      data: experience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating experience record',
      error: error.message
    });
  }
};

// Delete student experience
const deleteStudentExperience = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can delete experience records'
      });
    }

    const { id } = req.params;
    
    const experience = await StudentExperience.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Experience record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting experience record',
      error: error.message
    });
  }
};

// Get all experiences for a student (public access)
const getPublicStudentExperiences = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all experiences for the specified user ID
    const experiences = await StudentExperience.find({ userId: userId });
    
    res.status(200).json({
      success: true,
      data: experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching experience records',
      error: error.message
    });
  }
};

// Admin: Get all student experiences
const getAllStudentExperiences = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access all experience records'
      });
    }

    const experiences = await StudentExperience.find().populate('userId', 'email role');
    
    res.status(200).json({
      success: true,
      data: experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching experience records',
      error: error.message
    });
  }
};

// Admin: Get specific student experience
const getAdminStudentExperienceById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access experience records'
      });
    }

    const { id } = req.params;
    
    const experience = await StudentExperience.findById(id).populate('userId', 'email role');
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: experience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching experience record',
      error: error.message
    });
  }
};

// Admin: Update student experience
const updateAdminStudentExperience = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update experience records'
      });
    }

    const { id } = req.params;
    const { companyName, position, startDate, endDate, description, userId } = req.body;

    const experience = await StudentExperience.findByIdAndUpdate(
      id,
      { companyName, position, startDate, endDate, description, userId },
      { new: true, runValidators: true }
    ).populate('userId', 'email role');

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Experience record updated successfully',
      data: experience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating experience record',
      error: error.message
    });
  }
};

// Admin: Delete student experience
const deleteAdminStudentExperience = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete experience records'
      });
    }

    const { id } = req.params;
    
    const experience = await StudentExperience.findByIdAndDelete(id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Experience record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting experience record',
      error: error.message
    });
  }
};

export {
  createStudentExperience,
  getMyStudentExperiences,
  getStudentExperienceById,
  updateStudentExperience,
  deleteStudentExperience,
  getAllStudentExperiences,
  getAdminStudentExperienceById,
  updateAdminStudentExperience,
  deleteAdminStudentExperience,
  getPublicStudentExperiences // Export the new function
};