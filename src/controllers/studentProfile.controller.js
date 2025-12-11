import StudentProfile from '../models/studentProfile.model.js';
import User from '../models/auth.model.js';
import s3 from '../config/s3.js';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import dotenv from 'dotenv';
// Import new models
import StudentSkill from '../models/studentSkill.model.js';
import StudentExperience from '../models/studentExperience.model.js';
import StudentProject from '../models/studentProject.model.js';
import StudentEducation from '../models/studentEducation.model.js';
import StudentAward from '../models/studentAward.model.js';

dotenv.config();

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

// Create student profile
const createStudentProfile = async (req, res) => {
  try {
    const { fullName, email, about, phone1, phone2, location, dob, socialMedia, profilePic, bannerPic, templateId } = req.body;

    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create student profiles'
      });
    }

    // Check if profile already exists for this user
    const existingProfile = await StudentProfile.findOne({ userId: req.user.id });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Student profile already exists for this user'
      });
    }

    // Create new student profile
    const profile = new StudentProfile({
      userId: req.user.id,
      fullName,
      email,
      about,
      phone1,
      phone2,
      location,
      dob,
      socialMedia,
      templateId,
      ...(profilePic && { profilePic }),
      ...(bannerPic && { bannerPic })
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Student profile created successfully',
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating student profile',
      error: error.message
    });
  }
};

// Upload or update profile picture
const uploadStudentProfilePic = async (req, res) => {
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
        message: 'Only students can upload profile pictures'
      });
    }

    // Upload image to S3
    const imageUrl = await uploadToS3(req.file, 'studentProfilePic');

    // Get current profile to check for existing image
    const currentProfile = await StudentProfile.findOne({ userId: req.user.id });
    
    if (!currentProfile) {
      // If profile doesn't exist, we'll return the image URL so it can be used when creating the profile
      return res.status(200).json({
        success: true,
        message: 'Profile picture uploaded successfully',
        data: {
          profilePic: imageUrl
        }
      });
    }

    // Delete old image if it exists
    if (currentProfile.profilePic) {
      await deleteImageFromS3(currentProfile.profilePic);
    }

    // Update profile with new image URL
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user.id },
      { profilePic: imageUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePic: imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading profile picture',
      error: error.message
    });
  }
};

// Upload or update banner picture
const uploadStudentBannerPic = async (req, res) => {
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
        message: 'Only students can upload banner pictures'
      });
    }

    // Upload image to S3
    const imageUrl = await uploadToS3(req.file, 'studentBannerPic');

    // Get current profile to check for existing image
    const currentProfile = await StudentProfile.findOne({ userId: req.user.id });
    
    if (!currentProfile) {
      // If profile doesn't exist, we'll return the image URL so it can be used when creating the profile
      return res.status(200).json({
        success: true,
        message: 'Banner picture uploaded successfully',
        data: {
          bannerPic: imageUrl
        }
      });
    }

    // Delete old image if it exists
    if (currentProfile.bannerPic) {
      await deleteImageFromS3(currentProfile.bannerPic);
    }

    // Update profile with new image URL
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user.id },
      { bannerPic: imageUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Banner picture uploaded successfully',
      data: {
        bannerPic: imageUrl
      }
    });
  } catch (error) {
    console.error('Error uploading banner picture:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading banner picture',
      error: error.message
    });
  }
};

// Get student's own profile
const getMyStudentProfile = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access student profiles'
      });
    }

    const profile = await StudentProfile.findOne({ userId: req.user.id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student profile',
      error: error.message
    });
  }
};

// Get public student profile (read-only access for anyone)
const getPublicStudentProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find profile by userId
    const profile = await StudentProfile.findOne({ userId }).populate('userId', 'email role');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Get related data
    const skills = await StudentSkill.find({ userId }).select('-userId -__v -createdAt -updatedAt');
    const experiences = await StudentExperience.find({ userId }).select('-userId -__v -createdAt -updatedAt');
    const projects = await StudentProject.find({ userId }).select('-userId -__v -createdAt -updatedAt');
    const educations = await StudentEducation.find({ userId }).select('-userId -__v -createdAt -updatedAt');
    const awards = await StudentAward.find({ userId }).select('-userId -__v -createdAt -updatedAt');

    // Return profile data with all related sections
    const publicProfile = {
      fullName: profile.fullName,
      email: profile.email,
      about: profile.about,
      phone1: profile.phone1,
      phone2: profile.phone2,
      location: profile.location,
      dob: profile.dob,
      socialMedia: profile.socialMedia,
      templateId: profile.templateId,
      profilePic: profile.profilePic,
      bannerPic: profile.bannerPic,
      skills: skills,
      experiences: experiences,
      projects: projects,
      educations: educations,
      awards: awards,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    };

    res.status(200).json({
      success: true,
      data: publicProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student profile',
      error: error.message
    });
  }
};

// Update student's own profile
const updateMyStudentProfile = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can update student profiles'
      });
    }

    const { fullName, email, about, phone1, phone2, location, dob, socialMedia, templateId } = req.body;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user.id },
      { fullName, email, about, phone1, phone2, location, dob, socialMedia, templateId },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student profile updated successfully',
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student profile',
      error: error.message
    });
  }
};

// Delete student's own profile
const deleteMyStudentProfile = async (req, res) => {
  try {
    // Check if user has student role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can delete student profiles'
      });
    }

    const profile = await StudentProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Delete images from S3 if they exist
    if (profile.profilePic) {
      await deleteImageFromS3(profile.profilePic);
    }
    if (profile.bannerPic) {
      await deleteImageFromS3(profile.bannerPic);
    }

    // Delete profile from database
    await StudentProfile.findOneAndDelete({ userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Student profile deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student profile',
      error: error.message
    });
  }
};

// Admin: Get all student profiles
const getAllStudentProfiles = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access all student profiles'
      });
    }

    // Get all student users
    const users = await User.find({ role: 'student' });
    
    // Get all student profiles
    const profiles = await StudentProfile.find().populate('userId', 'email role');
    
    // Create a map of profiles by userId for quick lookup
    const profileMap = {};
    profiles.forEach(profile => {
      if (profile.userId) {
        profileMap[profile.userId._id.toString()] = profile;
      }
    });
    
    // Combine user data with profile data
    const combinedData = users.map(user => {
      const profile = profileMap[user._id.toString()];
      if (profile) {
        // User has a profile, return profile data with email
        return {
          ...profile.toObject(),
          email: profile.userId?.email,
          createdAt: user.createdAt,
          isActive: user.isActive
        };
      } else {
        // User doesn't have a profile, return basic user data
        return {
          _id: user._id,
          userId: user._id,
          email: user.email,
          fullName: '',
          createdAt: user.createdAt,
          isActive: user.isActive
        };
      }
    });
    
    res.status(200).json({
      success: true,
      data: combinedData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student profiles',
      error: error.message
    });
  }
};

// Admin: Get specific student profile
const getStudentProfile = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access student profiles'
      });
    }

    const { id } = req.params;
    
    // Check if user exists and is a student
    const user = await User.findById(id);
    if (!user || user.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const profile = await StudentProfile.findOne({ userId: id }).populate('userId', 'email role');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student profile',
      error: error.message
    });
  }
};

// Admin: Update student profile
const updateStudentProfile = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update student profiles'
      });
    }

    const { id } = req.params;
    const { fullName, email, about, phone1, phone2, location, dob, socialMedia, templateId } = req.body;

    // Check if user exists and is a student
    const user = await User.findById(id);
    if (!user || user.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if profile exists, if not create it
    let profile = await StudentProfile.findOne({ userId: id });
    
    if (!profile) {
      // Create new profile if it doesn't exist
      profile = new StudentProfile({
        userId: id,
        fullName: fullName || '',
        email: email || '',
        about: about || '',
        phone1: phone1 || '',
        phone2: phone2 || '',
        location: location || '',
        dob: dob || null,
        socialMedia: socialMedia || {},
        templateId: templateId || 'template111'
      });
      await profile.save();
    } else {
      // Update existing profile
      profile = await StudentProfile.findOneAndUpdate(
        { userId: id },
        { fullName, email, about, phone1, phone2, location, dob, socialMedia, templateId },
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Student profile updated successfully',
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student profile',
      error: error.message
    });
  }
};

// Admin: Delete student profile
const deleteStudentProfile = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete student profiles'
      });
    }

    const { id } = req.params;
    
    // Check if user exists and is a student
    const user = await User.findById(id);
    if (!user || user.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Find profile before deleting
    const profile = await StudentProfile.findOne({ userId: id });

    // Delete images from S3 if they exist
    if (profile && profile.profilePic) {
      await deleteImageFromS3(profile.profilePic);
    }
    if (profile && profile.bannerPic) {
      await deleteImageFromS3(profile.bannerPic);
    }

    // Delete profile from database (if it exists)
    if (profile) {
      await StudentProfile.findOneAndDelete({ userId: id });
    }

    res.status(200).json({
      success: true,
      message: 'Student profile deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student profile',
      error: error.message
    });
  }
};

export {
  createStudentProfile,
  uploadStudentProfilePic,
  uploadStudentBannerPic,
  getMyStudentProfile,
  getPublicStudentProfile,
  updateMyStudentProfile,
  deleteMyStudentProfile,
  getAllStudentProfiles,
  getStudentProfile,
  updateStudentProfile,
  deleteStudentProfile,
  upload
};