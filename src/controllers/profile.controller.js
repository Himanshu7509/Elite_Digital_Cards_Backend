import Profile from '../models/profile.model.js';
import User from '../models/auth.model.js';
import s3 from '../config/s3.js';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import dotenv from 'dotenv';

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

// Create client profile
const createProfile = async (req, res) => {
  try {
    const { name, profession, about, phone1, phone2, location, dob, socialMedia, profileImg, bannerImg, gmail } = req.body;

    // Check if profile already exists for this user
    const existingProfile = await Profile.findOne({ userId: req.user.id });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists for this user'
      });
    }

    // Create new profile with optional image URLs
    const profile = new Profile({
      userId: req.user.id,
      name,
      profession,
      about,
      phone1,
      phone2,
      location,
      dob,
      socialMedia,
      ...(gmail && { gmail }),
      ...(profileImg && { profileImg }),
      ...(bannerImg && { bannerImg })
    });

    await profile.save();

    // Populate user data to include email
    await profile.populate('userId', 'email');

    // Add email to the response
    const profileData = {
      ...profile.toObject(),
      email: profile.userId?.email
    };

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: profileData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating profile',
      error: error.message
    });
  }
};

// Upload or update profile image
const uploadProfileImage = async (req, res) => {
  try {
    console.log('Upload profile image request received');
    console.log('Request file:', req.file);
    console.log('Request body:', req.body);
    console.log('User ID:', req.user.id);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload image to S3
    const imageUrl = await uploadToS3(req.file, 'profileImg');

    // Get current profile to check for existing image
    const currentProfile = await Profile.findOne({ userId: req.user.id });
    
    if (!currentProfile) {
      // If profile doesn't exist, we'll return the image URL so it can be used when creating the profile
      return res.status(200).json({
        success: true,
        message: 'Profile image uploaded successfully',
        data: {
          profileImg: imageUrl
        }
      });
    }

    // Delete old image if it exists
    if (currentProfile.profileImg) {
      await deleteImageFromS3(currentProfile.profileImg);
    }

    // Update profile with new image URL
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { profileImg: imageUrl },
      { new: true }
    ).populate('userId', 'email');

    // Add email to the response
    const profileData = {
      profileImg: imageUrl,
      email: profile?.userId?.email
    };

    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: profileData
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading profile image',
      error: error.message
    });
  }
};

// Upload or update banner image
const uploadBannerImage = async (req, res) => {
  try {
    console.log('Upload banner image request received');
    console.log('Request file:', req.file);
    console.log('Request body:', req.body);
    console.log('User ID:', req.user.id);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload image to S3
    const imageUrl = await uploadToS3(req.file, 'bannerImg');

    // Get current profile to check for existing image
    const currentProfile = await Profile.findOne({ userId: req.user.id });
    
    if (!currentProfile) {
      // If profile doesn't exist, we'll return the image URL so it can be used when creating the profile
      return res.status(200).json({
        success: true,
        message: 'Banner image uploaded successfully',
        data: {
          bannerImg: imageUrl
        }
      });
    }

    // Delete old image if it exists
    if (currentProfile.bannerImg) {
      await deleteImageFromS3(currentProfile.bannerImg);
    }

    // Update profile with new image URL
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { bannerImg: imageUrl },
      { new: true }
    ).populate('userId', 'email');

    // Add email to the response
    const profileData = {
      bannerImg: imageUrl,
      email: profile?.userId?.email
    };

    res.status(200).json({
      success: true,
      message: 'Banner image uploaded successfully',
      data: profileData
    });
  } catch (error) {
    console.error('Error uploading banner image:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading banner image',
      error: error.message
    });
  }
};

// Get client's own profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id }).populate('userId', 'email');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Add email to the profile data
    const profileData = {
      ...profile.toObject(),
      email: profile.userId?.email
    };

    res.status(200).json({
      success: true,
      data: profileData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Get public profile (read-only access for anyone)
const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find profile by userId
    const profile = await Profile.findOne({ userId }).populate('userId', 'email role');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Return only non-sensitive profile data
    const publicProfile = {
      name: profile.name,
      profession: profile.profession,
      about: profile.about,
      phone1: profile.phone1,
      phone2: profile.phone2,
      location: profile.location,
      dob: profile.dob,
      socialMedia: profile.socialMedia,
      websiteLink: profile.websiteLink,
      appLink: profile.appLink,
      gmail: profile.gmail,
      templateId: profile.templateId,
      profileImg: profile.profileImg,
      bannerImg: profile.bannerImg,
      email: profile.userId?.email,
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
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Update client's own profile
const updateMyProfile = async (req, res) => {
  try {
    const { name, profession, about, phone1, phone2, location, dob, socialMedia, websiteLink, appLink, templateId, gmail } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { name, profession, about, phone1, phone2, location, dob, socialMedia, websiteLink, appLink, templateId, ...(gmail && { gmail }) },
      { new: true, runValidators: true }
    ).populate('userId', 'email');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Add email to the response
    const profileData = {
      ...profile.toObject(),
      email: profile.userId?.email
    };

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profileData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Delete client's own profile
const deleteMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Delete images from S3 if they exist
    if (profile.profileImg) {
      await deleteImageFromS3(profile.profileImg);
    }
    if (profile.bannerImg) {
      await deleteImageFromS3(profile.bannerImg);
    }

    // Delete profile from database
    await Profile.findOneAndDelete({ userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting profile',
      error: error.message
    });
  }
};

// Admin: Get all client profiles
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('userId', 'email role');
    
    // Add email to each profile data
    const profilesData = profiles.map(profile => ({
      ...profile.toObject(),
      email: profile.userId?.email
    }));
    
    res.status(200).json({
      success: true,
      data: profilesData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profiles',
      error: error.message
    });
  }
};

// Admin: Get specific client profile
const getClientProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists and is a client
    const user = await User.findById(id);
    if (!user || user.role !== 'client') {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    const profile = await Profile.findOne({ userId: id }).populate('userId', 'email role');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Add email to the profile data
    const profileData = {
      ...profile.toObject(),
      email: profile.userId?.email
    };

    res.status(200).json({
      success: true,
      data: profileData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Admin: Update client profile
const updateClientProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profession, about, phone1, phone2, location, dob, socialMedia, websiteLink, appLink, templateId, gmail } = req.body;

    // Check if user exists and is a client
    const user = await User.findById(id);
    if (!user || user.role !== 'client') {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: id },
      { name, profession, about, phone1, phone2, location, dob, socialMedia, websiteLink, appLink, templateId, ...(gmail && { gmail }) },
      { new: true, runValidators: true }
    ).populate('userId', 'email role');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Add email to the response
    const profileData = {
      ...profile.toObject(),
      email: profile.userId?.email
    };

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profileData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Admin: Delete client profile
const deleteClientProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists and is a client
    const user = await User.findById(id);
    if (!user || user.role !== 'client') {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Find profile before deleting
    const profile = await Profile.findOne({ userId: id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Delete images from S3 if they exist
    if (profile.profileImg) {
      await deleteImageFromS3(profile.profileImg);
    }
    if (profile.bannerImg) {
      await deleteImageFromS3(profile.bannerImg);
    }

    // Delete profile from database
    await Profile.findOneAndDelete({ userId: id });

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting profile',
      error: error.message
    });
  }
};

export {
  createProfile,
  uploadProfileImage,
  uploadBannerImage,
  getMyProfile,
  getPublicProfile,
  updateMyProfile,
  deleteMyProfile,
  getAllProfiles,
  getClientProfile,
  updateClientProfile,
  deleteClientProfile,
  upload
};