import StudentEducation from '../models/studentEducation.model.js';

// Create student education
const createStudentEducation = async (req, res) => {
  try {
    const { degree, major, school, year, gpa } = req.body;

    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create education records'
      });
    }

    const education = new StudentEducation({
      userId: req.user.id,
      degree,
      major,
      school,
      year,
      gpa
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

// Get all education records for the student
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

// Get education record by ID
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

// Update student education record
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
    const { degree, major, school, year, gpa } = req.body;

    const education = await StudentEducation.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { degree, major, school, year, gpa },
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

// Delete student education record
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

// Admin: Get all student education records
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

// Admin: Get specific student education record
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

// Admin: Update student education record
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
    const { degree, major, school, year, gpa } = req.body;

    const education = await StudentEducation.findByIdAndUpdate(
      id,
      { degree, major, school, year, gpa },
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

// Admin: Delete student education record
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

export {
  createStudentEducation,
  getMyStudentEducations,
  getStudentEducationById,
  updateStudentEducation,
  deleteStudentEducation,
  getAllStudentEducations,
  getAdminStudentEducationById,
  updateAdminStudentEducation,
  deleteAdminStudentEducation
};