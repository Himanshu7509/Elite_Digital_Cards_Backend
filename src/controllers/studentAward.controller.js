import StudentAward from '../models/studentAward.model.js';
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

// Create a new student award
const createStudentAward = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create awards'
      });
    }

    const { title, issuer, date, description } = req.body;
    
    // Handle image upload if provided
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToS3(req.file, 'studentAwardImages');
    }

    const award = new StudentAward({
      userId: req.user.id,
      title,
      issuer,
      date,
      description,
      imageUrl
    });

    await award.save();

    res.status(201).json({
      success: true,
      message: 'Student award created successfully',
      data: award
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating student award',
      error: error.message
    });
  }
};

// Upload or update award image
const uploadStudentAwardImage = async (req, res) => {
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
        message: 'Only students can upload award images'
      });
    }

    // Upload image to S3
    const imageUrl = await uploadToS3(req.file, 'studentAwardImages');

    res.status(200).json({
      success: true,
      message: 'Award image uploaded successfully',
      data: {
        imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading award image:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading award image',
      error: error.message
    });
  }
};

// Get all awards for the logged-in student
const getMyStudentAwards = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access their awards'
      });
    }

    const awards = await StudentAward.find({ userId: req.user.id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: awards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student awards',
      error: error.message
    });
  }
};

// Get public awards for a student (read-only access for anyone)
const getPublicStudentAwards = async (req, res) => {
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

    const awards = await StudentAward.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: awards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student awards',
      error: error.message
    });
  }
};

// Update a student award
const updateStudentAward = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can update their awards'
      });
    }

    const { id } = req.params;
    const { title, issuer, date, description } = req.body;

    const award = await StudentAward.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, issuer, date, description },
      { new: true, runValidators: true }
    );

    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Student award not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student award updated successfully',
      data: award
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student award',
      error: error.message
    });
  }
};

// Delete a student award
const deleteStudentAward = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can delete their awards'
      });
    }

    const { id } = req.params;

    // Find award to get image URL for deletion
    const award = await StudentAward.findOne({ _id: id, userId: req.user.id });

    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Student award not found'
      });
    }

    // Delete image from S3 if it exists
    if (award.imageUrl) {
      await deleteImageFromS3(award.imageUrl);
    }

    // Delete award from database
    await StudentAward.findOneAndDelete({ _id: id, userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Student award deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student award',
      error: error.message
    });
  }
};

// Admin: Get all awards for a specific student
const getStudentAwards = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access student awards'
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

    const awards = await StudentAward.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: awards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student awards',
      error: error.message
    });
  }
};

// Admin: Delete all awards for a specific student
const deleteAllStudentAwards = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete student awards'
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

    // Get all awards to delete images from S3
    const awards = await StudentAward.find({ userId });
    for (const award of awards) {
      if (award.imageUrl) {
        await deleteImageFromS3(award.imageUrl);
      }
    }

    await StudentAward.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: 'All student awards deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student awards',
      error: error.message
    });
  }
};

export {
  createStudentAward,
  uploadStudentAwardImage,
  getMyStudentAwards,
  getPublicStudentAwards,
  updateStudentAward,
  deleteStudentAward,
  getStudentAwards,
  deleteAllStudentAwards,
  upload
};