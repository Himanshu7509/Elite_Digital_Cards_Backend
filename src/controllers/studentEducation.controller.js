import StudentEducation from '../models/studentEducation.model.js';

// Create student education
const createStudentEducation = async (req, res) => {
  try {
    const { institutionName, degree, fieldOfStudy, startDate, endDate, grade, description } = req.body;

    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create education records'
      });
    }

    const education = new StudentEducation({
      userId: req.user.id,
      institutionName,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      grade,
      description
    });

    await education.save();

    res.status(201).json({
      success: true,
      message: 'Education record created successfully',
      data: education
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating education record',
      error: error.message
    });
  }
};

// Get all educations for the student
const getMyStudentEducations = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access education records'
      });
    }

    const educations = await StudentEducation.find({ userId: req.user.id });
    
    res.status(200).json({
      success: true,
      data: educations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching education records',
      error: error.message
    });
  }
};

// Get education by ID
const getStudentEducationById = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access education records'
      });
    }

    const { id } = req.params;
    
    const education = await StudentEducation.findOne({ _id: id, userId: req.user.id });
    
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: education
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching education record',
      error: error.message
    });
  }
};

// Update student education
const updateStudentEducation = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can update education records'
      });
    }

    const { id } = req.params;
    const { institutionName, degree, fieldOfStudy, startDate, endDate, grade, description } = req.body;

    const education = await StudentEducation.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { institutionName, degree, fieldOfStudy, startDate, endDate, grade, description },
      { new: true, runValidators: true }
    );

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Education record updated successfully',
      data: education
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating education record',
      error: error.message
    });
  }
};

// Delete student education
const deleteStudentEducation = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can delete education records'
      });
    }

    const { id } = req.params;
    
    const education = await StudentEducation.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Education record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting education record',
      error: error.message
    });
  }
};

// Get all educations for a student (public access)
const getPublicStudentEducations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all educations for the specified user ID
    const educations = await StudentEducation.find({ userId: userId });
    
    res.status(200).json({
      success: true,
      data: educations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching education records',
      error: error.message
    });
  }
};

// Admin: Get all student educations
const getAllStudentEducations = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access all education records'
      });
    }

    const educations = await StudentEducation.find().populate('userId', 'email role');
    
    res.status(200).json({
      success: true,
      data: educations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching education records',
      error: error.message
    });
  }
};

// Admin: Get specific student education
const getAdminStudentEducationById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access education records'
      });
    }

    const { id } = req.params;
    
    const education = await StudentEducation.findById(id).populate('userId', 'email role');
    
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: education
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching education record',
      error: error.message
    });
  }
};

// Admin: Update student education
const updateAdminStudentEducation = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update education records'
      });
    }

    const { id } = req.params;
    const { institutionName, degree, fieldOfStudy, startDate, endDate, grade, description, userId } = req.body;

    const education = await StudentEducation.findByIdAndUpdate(
      id,
      { institutionName, degree, fieldOfStudy, startDate, endDate, grade, description, userId },
      { new: true, runValidators: true }
    ).populate('userId', 'email role');

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Education record updated successfully',
      data: education
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating education record',
      error: error.message
    });
  }
};

// Admin: Delete student education
const deleteAdminStudentEducation = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete education records'
      });
    }

    const { id } = req.params;
    
    const education = await StudentEducation.findByIdAndDelete(id);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Education record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting education record',
      error: error.message
    });
  }
};

// Admin: Create student education
const createAdminStudentEducation = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create education records'
      });
    }

    const { degree, institution, startDate, endDate, description, userId } = req.body;

    const education = new StudentEducation({
      userId,
      degree,
      institution,
      startDate,
      endDate,
      description
    });

    await education.save();

    res.status(201).json({
      success: true,
      message: 'Education record created successfully',
      data: education
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating education record',
      error: error.message
    });
  }
};

export {
  createStudentEducation,
  getMyStudentEducations,
  getStudentEducationById,
  updateStudentEducation,
  deleteStudentEducation,
  getAllStudentEducations,
  getAdminStudentEducationById,
  updateAdminStudentEducation,
  deleteAdminStudentEducation,
  createAdminStudentEducation,
  getPublicStudentEducations // Export the new function
};