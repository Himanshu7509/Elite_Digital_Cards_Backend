import StudentAchievement from '../models/studentAchievement.model.js';
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

// Create student achievement
const createStudentAchievement = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create achievement records'
      });
    }

    let certificateUrl = null;
    
    // Handle certificate image upload if file is provided
    if (req.file) {
      certificateUrl = await uploadToS3(req.file, 'student-achievements');
    }

    const { title, date, description } = req.body;

    const achievement = new StudentAchievement({
      userId: req.user.id,
      title,
      desc: description,
      date,
      certificateUrl
    });

    await achievement.save();

    // Transform the data to match frontend expectations
    const transformedAchievement = {
      ...achievement.toObject(),
      description: achievement.desc
    };

    res.status(201).json({
      success: true,
      message: 'Achievement record created successfully',
      data: transformedAchievement
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
    
    // Transform the data to match frontend expectations
    const transformedAchievements = achievements.map(achievement => ({
      ...achievement.toObject(),
      description: achievement.desc
    }));
    
    res.status(200).json({
      success: true,
      data: transformedAchievements
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

    // Transform the data to match frontend expectations
    const transformedAchievement = {
      ...achievement.toObject(),
      description: achievement.desc
    };

    res.status(200).json({
      success: true,
      data: transformedAchievement
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
    
    // Check if achievement exists and belongs to user
    const existingAchievement = await StudentAchievement.findOne({ _id: id, userId: req.user.id });
    
    if (!existingAchievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement record not found'
      });
    }

    const { title, date, description } = req.body;

    // Handle certificate image update
    let updateData = { title, date, desc: description };
    if (req.file) {
      // Upload new certificate image to S3
      const certificateUrl = await uploadToS3(req.file, 'student-achievements');
      // Delete old certificate image from S3
      await deleteImageFromS3(existingAchievement.certificateUrl);
      // Add new certificate URL to update data
      updateData.certificateUrl = certificateUrl;
    }

    const achievement = await StudentAchievement.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    // Transform the data to match frontend expectations
    const transformedAchievement = {
      ...achievement.toObject(),
      description: achievement.desc
    };

    res.status(200).json({
      success: true,
      message: 'Achievement record updated successfully',
      data: transformedAchievement
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
    
    // Transform the data to match frontend expectations
    const transformedAchievements = achievements.map(achievement => ({
      ...achievement.toObject(),
      description: achievement.desc
    }));
    
    res.status(200).json({
      success: true,
      data: transformedAchievements
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
    
    // Check if achievement exists
    const existingAchievement = await StudentAchievement.findById(id);
    
    if (!existingAchievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement record not found'
      });
    }

    const { title, date, description, userId } = req.body;

    // Handle certificate image update
    let updateData = { title, date, desc: description, userId };
    if (req.file) {
      // Upload new certificate image to S3
      const certificateUrl = await uploadToS3(req.file, 'student-achievements');
      // Delete old certificate image from S3
      await deleteImageFromS3(existingAchievement.certificateUrl);
      // Add new certificate URL to update data
      updateData.certificateUrl = certificateUrl;
    }

    const achievement = await StudentAchievement.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'email role');

    // Transform the data to match frontend expectations
    const transformedAchievement = {
      ...achievement.toObject(),
      description: achievement.desc
    };

    res.status(200).json({
      success: true,
      message: 'Achievement record updated successfully',
      data: transformedAchievement
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

// Admin: Create student achievement
const createAdminStudentAchievement = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create achievement records'
      });
    }

    let certificateUrl = null;
    
    // Handle certificate upload if file is provided
    if (req.file) {
      certificateUrl = await uploadToS3(req.file, 'student-achievements');
    }

    const { title, description, date, userId } = req.body;

    const achievement = new StudentAchievement({
      userId,
      title,
      desc: description,
      date,
      certificateUrl
    });

    await achievement.save();

    // Transform the data to match frontend expectations
    const transformedAchievement = {
      ...achievement.toObject(),
      description: achievement.desc
    };

    res.status(201).json({
      success: true,
      message: 'Achievement record created successfully',
      data: transformedAchievement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating achievement record',
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
  createAdminStudentAchievement,
  getPublicStudentAchievements // Export the new function
};