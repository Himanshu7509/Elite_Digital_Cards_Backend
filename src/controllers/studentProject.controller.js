import StudentProject from '../models/studentProject.model.js';
import User from '../models/auth.model.js';
import s3 from '../config/s3.js';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';

// Configure multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
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

// Create a new student project
const createStudentProject = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create projects'
      });
    }

    const { title, description, technologies, projectUrl } = req.body;
    
    // Handle image upload if provided
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToS3(req.file, 'studentProjectImages');
    }

    const project = new StudentProject({
      userId: req.user.id,
      title,
      description,
      technologies: technologies ? technologies.split(',') : [],
      projectUrl,
      imageUrl
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: 'Student project created successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating student project',
      error: error.message
    });
  }
};

// Upload or update project image
const uploadStudentProjectImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can upload project images'
      });
    }

    // Upload image to S3
    const imageUrl = await uploadToS3(req.file, 'studentProjectImages');

    res.status(200).json({
      success: true,
      message: 'Project image uploaded successfully',
      data: {
        imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading project image:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading project image',
      error: error.message
    });
  }
};

// Get all projects for the logged-in student
const getMyStudentProjects = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access their projects'
      });
    }

    const projects = await StudentProject.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student projects',
      error: error.message
    });
  }
};

// Get public projects for a student (read-only access for anyone)
const getPublicStudentProjects = async (req, res) => {
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

    const projects = await StudentProject.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student projects',
      error: error.message
    });
  }
};

// Update a student project
const updateStudentProject = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can update their projects'
      });
    }

    const { id } = req.params;
    const { title, description, technologies, projectUrl } = req.body;

    // Handle image upload if provided
    let updateData = { title, description, projectUrl };
    if (technologies) {
      updateData.technologies = technologies.split(',');
    }

    const project = await StudentProject.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Student project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student project updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student project',
      error: error.message
    });
  }
};

// Delete a student project
const deleteStudentProject = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can delete their projects'
      });
    }

    const { id } = req.params;

    // Find project to get image URL for deletion
    const project = await StudentProject.findOne({ _id: id, userId: req.user.id });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Student project not found'
      });
    }

    // Delete image from S3 if it exists
    if (project.imageUrl) {
      await deleteImageFromS3(project.imageUrl);
    }

    // Delete project from database
    await StudentProject.findOneAndDelete({ _id: id, userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Student project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student project',
      error: error.message
    });
  }
};

// Admin: Get all projects for a specific student
const getStudentProjects = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access student projects'
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

    const projects = await StudentProject.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student projects',
      error: error.message
    });
  }
};

// Admin: Delete all projects for a specific student
const deleteAllStudentProjects = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete student projects'
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

    // Get all projects to delete images from S3
    const projects = await StudentProject.find({ userId });
    for (const project of projects) {
      if (project.imageUrl) {
        await deleteImageFromS3(project.imageUrl);
      }
    }

    await StudentProject.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: 'All student projects deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student projects',
      error: error.message
    });
  }
};

export {
  createStudentProject,
  uploadStudentProjectImage,
  getMyStudentProjects,
  getPublicStudentProjects,
  updateStudentProject,
  deleteStudentProject,
  getStudentProjects,
  deleteAllStudentProjects,
  upload
};