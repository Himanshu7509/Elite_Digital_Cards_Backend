import Profile from '../models/profile.model.js';
import User from '../models/auth.model.js';
import Service from '../models/service.model.js';
import Product from '../models/product.model.js';
import Testimonial from '../models/testimonial.model.js';
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
    // Get all client users
    const users = await User.find({ role: 'client' });
    
    // Get all profiles
    const profiles = await Profile.find().populate('userId', 'email role');
    
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
          name: '',
          profession: '',
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

    // Check if profile exists, if not create it
    let profile = await Profile.findOne({ userId: id });
    
    if (!profile) {
      // Create new profile if it doesn't exist
      profile = new Profile({
        userId: id,
        name: name || '',
        profession: profession || '',
        about: about || '',
        phone1: phone1 || '',
        phone2: phone2 || '',
        location: location || '',
        dob: dob || null,
        socialMedia: socialMedia || {},
        websiteLink: websiteLink || '',
        appLink: appLink || '',
        templateId: templateId || 'template1',
        ...(gmail && { gmail })
      });
      await profile.save();
    } else {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { userId: id },
        { name, profession, about, phone1, phone2, location, dob, socialMedia, websiteLink, appLink, templateId, ...(gmail && { gmail }) },
        { new: true, runValidators: true }
      );
    }

    // Populate user data
    await profile.populate('userId', 'email role');

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

    // Delete images from S3 if they exist
    if (profile && profile.profileImg) {
      await deleteImageFromS3(profile.profileImg);
    }
    if (profile && profile.bannerImg) {
      await deleteImageFromS3(profile.bannerImg);
    }

    // Delete profile from database (if it exists)
    if (profile) {
      await Profile.findOneAndDelete({ userId: id });
    }

    // Delete the user account itself
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Client account and all associated data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting client',
      error: error.message
    });
  }
};

// Admin: Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total clients
    const totalClients = await User.countDocuments({ role: 'client' });
    
    // Get clients with profiles (profile completion)
    const clientsWithProfiles = await Profile.countDocuments();
    
    // Get total services
    const totalServices = await Service.countDocuments();
    
    // Get total products
    const totalProducts = await Product.countDocuments();
    
    // Get total testimonials
    const totalTestimonials = await Testimonial.countDocuments();
    
    // Get recent clients (last 5)
    const recentClients = await User.find({ role: 'client' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('email createdAt');
    
    // Get recent profiles (last 5)
    const recentProfiles = await Profile.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'email');
    
    res.status(200).json({
      success: true,
      data: {
        totalClients,
        clientsWithProfiles,
        totalServices,
        totalProducts,
        totalTestimonials,
        recentClients,
        recentProfiles
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// Get user registration statistics for charts
const getUserRegistrationStats = async (req, res) => {
  try {
    // Calculate date ranges
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Get weekly user registrations grouped by day
    const weeklyStats = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Initialize weekly stats with zero counts
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayName = dayNames[date.getDay()];
      weeklyStats[dateString] = {
        count: 0,
        day: dayName
      };
    }
    
    // Get users registered in the last week
    const weeklyUsers = await User.find({
      role: 'client',
      createdAt: {
        $gte: oneWeekAgo,
        $lte: now
      }
    });
    
    // Count users by registration day
    weeklyUsers.forEach(user => {
      const date = user.createdAt.toISOString().split('T')[0];
      if (weeklyStats[date] !== undefined) {
        weeklyStats[date].count++;
      }
    });
    
    // Format weekly stats
    const formattedWeeklyStats = Object.keys(weeklyStats).map(date => ({
      date,
      day: weeklyStats[date].day,
      count: weeklyStats[date].count
    }));
    
    // Get monthly user registrations grouped by week
    const monthlyStats = [];
    for (let i = 3; i >= 0; i--) {
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - i * 7);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);
      
      // Count users in this week
      const count = await User.countDocuments({
        role: 'client',
        createdAt: {
          $gte: weekStart,
          $lte: weekEnd
        }
      });
      
      monthlyStats.push({
        weekStart: weekStart.toISOString().split('T')[0],
        weekEnd: weekEnd.toISOString().split('T')[0],
        count
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        weeklyStats: formattedWeeklyStats,
        monthlyStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user registration statistics',
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
  getDashboardStats,
  getUserRegistrationStats,
  upload
};