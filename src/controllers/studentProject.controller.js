import StudentProject from '../models/studentProject.model.js';

// Create student project
const createStudentProject = async (req, res) => {
  try {
    const { projectName, description, technologies, startDate, endDate, projectUrl, imageUrl } = req.body;

    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create project records'
      });
    }

    const project = new StudentProject({
      userId: req.user.id,
      projectName,
      description,
      technologies,
      startDate,
      endDate,
      projectUrl,
      imageUrl
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project record created successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating project record',
      error: error.message
    });
  }
};

// Get all projects for the student
const getMyStudentProjects = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access project records'
      });
    }

    const projects = await StudentProject.find({ userId: req.user.id });
    
    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project records',
      error: error.message
    });
  }
};

// Get project by ID
const getStudentProjectById = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access project records'
      });
    }

    const { id } = req.params;
    
    const project = await StudentProject.findOne({ _id: id, userId: req.user.id });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project record',
      error: error.message
    });
  }
};

// Update student project
const updateStudentProject = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can update project records'
      });
    }

    const { id } = req.params;
    const { projectName, description, technologies, startDate, endDate, projectUrl, imageUrl } = req.body;

    const project = await StudentProject.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { projectName, description, technologies, startDate, endDate, projectUrl, imageUrl },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project record updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating project record',
      error: error.message
    });
  }
};

// Delete student project
const deleteStudentProject = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can delete project records'
      });
    }

    const { id } = req.params;
    
    const project = await StudentProject.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting project record',
      error: error.message
    });
  }
};

// Get all projects for a student (public access)
const getPublicStudentProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all projects for the specified user ID
    const projects = await StudentProject.find({ userId: userId });
    
    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project records',
      error: error.message
    });
  }
};

// Admin: Get all student projects
const getAllStudentProjects = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access all project records'
      });
    }

    const projects = await StudentProject.find().populate('userId', 'email role');
    
    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project records',
      error: error.message
    });
  }
};

// Admin: Get specific student project
const getAdminStudentProjectById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access project records'
      });
    }

    const { id } = req.params;
    
    const project = await StudentProject.findById(id).populate('userId', 'email role');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project record',
      error: error.message
    });
  }
};

// Admin: Update student project
const updateAdminStudentProject = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update project records'
      });
    }

    const { id } = req.params;
    const { projectName, description, technologies, startDate, endDate, projectUrl, imageUrl, userId } = req.body;

    const project = await StudentProject.findByIdAndUpdate(
      id,
      { projectName, description, technologies, startDate, endDate, projectUrl, imageUrl, userId },
      { new: true, runValidators: true }
    ).populate('userId', 'email role');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project record updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating project record',
      error: error.message
    });
  }
};

// Admin: Delete student project
const deleteAdminStudentProject = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete project records'
      });
    }

    const { id } = req.params;
    
    const project = await StudentProject.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting project record',
      error: error.message
    });
  }
};

export {
  createStudentProject,
  getMyStudentProjects,
  getStudentProjectById,
  updateStudentProject,
  deleteStudentProject,
  getAllStudentProjects,
  getAdminStudentProjectById,
  updateAdminStudentProject,
  deleteAdminStudentProject,
  getPublicStudentProjects // Export the new function
};