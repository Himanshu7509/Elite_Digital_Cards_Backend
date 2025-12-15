import StudentProject from '../models/studentProject.model.js';
import s3 from '../config/s3.js';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure multer with memory storage
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload image to AWS S3
const uploadToS3 = async (file, folder) => {
  const fileKey = `elite-cards/${folder}/${uuidv4()}-${Date.now()}-${file.originalname}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const uploaded = await s3.upload(params).promise();
  return uploaded.Location; // Return public URL
};

// Helper function to delete image from S3
const deleteImageFromS3 = async (imageUrl) => {
  if (!imageUrl) return;
  
  try {
    // Extract key from URL
    const urlParts = imageUrl.split('/');
    const key = urlParts.slice(3).join('/'); // Remove https://bucket-name.s3.region.amazonaws.com/
    
    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    }).promise();
  } catch (error) {
    console.error('Error deleting image from S3:', error);
  }
};

// Create student project
const createStudentProject = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create project records'
      });
    }

    let imageUrl = null;
    
    // Handle image upload if file is provided
    if (req.file) {
      imageUrl = await uploadToS3(req.file, 'student-projects');
    }

    const { projectName, description, technologies, startDate, endDate, projectUrl } = req.body;

    const project = new StudentProject({
      userId: req.user.id,
      title: projectName,
      desc: description,
      tech: technologies,
      link: projectUrl,
      category: 'student-project',
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
    
    // Transform the data to match frontend expectations
    const transformedProjects = projects.map(project => ({
      ...project.toObject(),
      projectName: project.title,
      description: project.desc,
      technologies: project.tech,
      projectUrl: project.link
    }));
    
    res.status(200).json({
      success: true,
      data: transformedProjects
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

    // Transform the data to match frontend expectations
    const transformedProject = {
      ...project.toObject(),
      projectName: project.title,
      description: project.desc,
      technologies: project.tech,
      projectUrl: project.link
    };

    res.status(200).json({
      success: true,
      data: transformedProject
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
    
    // Check if project exists and belongs to user
    const existingProject = await StudentProject.findOne({ _id: id, userId: req.user.id });
    
    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Project record not found'
      });
    }

    const { projectName, description, technologies, startDate, endDate, projectUrl } = req.body;

    // Handle image update
    let updateData = { 
      title: projectName, 
      desc: description, 
      tech: technologies, 
      link: projectUrl 
    };
    if (req.file) {
      // Upload new image to S3
      const imageUrl = await uploadToS3(req.file, 'student-projects');
      // Delete old image from S3
      await deleteImageFromS3(existingProject.imageUrl);
      // Add new image URL to update data
      updateData.imageUrl = imageUrl;
    }

    const project = await StudentProject.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    // Transform the data to match frontend expectations
    const transformedProject = {
      ...project.toObject(),
      projectName: project.title,
      description: project.desc,
      technologies: project.tech,
      projectUrl: project.link
    };

    res.status(200).json({
      success: true,
      message: 'Project record updated successfully',
      data: transformedProject
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
    
    // Transform the data to match frontend expectations
    const transformedProjects = projects.map(project => ({
      ...project.toObject(),
      projectName: project.title,
      description: project.desc,
      technologies: project.tech,
      projectUrl: project.link
    }));
    
    res.status(200).json({
      success: true,
      data: transformedProjects
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
    
    // Check if project exists
    const existingProject = await StudentProject.findById(id);
    
    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Project record not found'
      });
    }

    const { projectName, description, technologies, startDate, endDate, projectUrl, userId } = req.body;

    // Handle image update
    let updateData = { 
      title: projectName, 
      desc: description, 
      tech: technologies, 
      link: projectUrl, 
      userId 
    };
    if (req.file) {
      // Upload new image to S3
      const imageUrl = await uploadToS3(req.file, 'student-projects');
      // Delete old image from S3
      await deleteImageFromS3(existingProject.imageUrl);
      // Add new image URL to update data
      updateData.imageUrl = imageUrl;
    }

    const project = await StudentProject.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'email role');

    // Transform the data to match frontend expectations
    const transformedProject = {
      ...project.toObject(),
      projectName: project.title,
      description: project.desc,
      technologies: project.tech,
      projectUrl: project.link
    };

    res.status(200).json({
      success: true,
      message: 'Project record updated successfully',
      data: transformedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating project record',
      error: error.message
    });
  }
};

// Admin: Create student project
const createAdminStudentProject = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create project records'
      });
    }

    let imageUrl = null;
    
    // Handle image upload if file is provided
    if (req.file) {
      imageUrl = await uploadToS3(req.file, 'student-projects');
    }

    const { projectName, description, technologies, startDate, endDate, projectUrl, userId } = req.body;

    const project = new StudentProject({
      userId,
      title: projectName,
      desc: description,
      tech: technologies,
      link: projectUrl,
      category: 'student-project',
      imageUrl
    });

    await project.save();

    // Transform the data to match frontend expectations
    const transformedProject = {
      ...project.toObject(),
      projectName: project.title,
      description: project.desc,
      technologies: project.tech,
      projectUrl: project.link
    };

    res.status(201).json({
      success: true,
      message: 'Project record created successfully',
      data: transformedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating project record',
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
  createAdminStudentProject,
  getPublicStudentProjects // Export the new function
};