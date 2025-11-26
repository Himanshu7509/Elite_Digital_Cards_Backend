import Gallery from '../models/gallery.model.js';
import s3 from '../config/s3.js';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload image to AWS S3
const uploadToS3 = async (file) => {
  const fileKey = `elite-cards/gallery/${uuidv4()}-${Date.now()}-${file.originalname}`;
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

// Upload gallery image
const uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { caption, userId } = req.body;

    // Upload image to S3
    const imageUrl = await uploadToS3(req.file);

    // Use the provided userId if it exists (admin creating for client), otherwise use the authenticated user's ID
    const galleryUserId = userId || req.user.id;

    // Create gallery entry
    const galleryItem = new Gallery({
      userId: galleryUserId,
      imageUrl: imageUrl,
      caption
    });

    await galleryItem.save();

    res.status(201).json({
      success: true,
      message: 'Gallery image uploaded successfully',
      data: galleryItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading gallery image',
      error: error.message
    });
  }
};

// Get all gallery images for the user
const getMyGallery = async (req, res) => {
  try {
    const galleryItems = await Gallery.find({ userId: req.user.id });
    
    res.status(200).json({
      success: true,
      data: galleryItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery',
      error: error.message
    });
  }
};

// Get public gallery images by user ID
const getPublicGallery = async (req, res) => {
  try {
    const { userId } = req.params;
    const galleryItems = await Gallery.find({ userId: userId });
    
    res.status(200).json({
      success: true,
      data: galleryItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery',
      error: error.message
    });
  }
};

// Get gallery image by ID
const getGalleryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const galleryItem = await Gallery.findOne({ _id: id, userId: req.user.id });
    
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery item',
      error: error.message
    });
  }
};

// Update gallery item
const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption } = req.body;

    const galleryItem = await Gallery.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { caption },
      { new: true, runValidators: true }
    );

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully',
      data: galleryItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating gallery item',
      error: error.message
    });
  }
};

// Delete gallery item
const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the gallery item to get the image URL
    const galleryItem = await Gallery.findOne({ _id: id, userId: req.user.id });

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    // Delete image from S3
    await deleteImageFromS3(galleryItem.imageUrl);

    // Delete gallery item from database
    await Gallery.findOneAndDelete({ _id: id, userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting gallery item',
      error: error.message
    });
  }
};

// Admin: Get all gallery items
const getAllGalleryItems = async (req, res) => {
  try {
    const galleryItems = await Gallery.find().populate('userId', 'email role');
    
    res.status(200).json({
      success: true,
      data: galleryItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery items',
      error: error.message
    });
  }
};

// Admin: Get specific gallery item
const getAdminGalleryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const galleryItem = await Gallery.findById(id).populate('userId', 'email role');
    
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery item',
      error: error.message
    });
  }
};

// Admin: Update gallery item
const updateAdminGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption } = req.body;

    const galleryItem = await Gallery.findByIdAndUpdate(
      id,
      { caption },
      { new: true, runValidators: true }
    ).populate('userId', 'email role');

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully',
      data: galleryItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating gallery item',
      error: error.message
    });
  }
};

// Admin: Delete gallery item
const deleteAdminGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the gallery item to get the image URL
    const galleryItem = await Gallery.findById(id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    // Delete image from S3
    await deleteImageFromS3(galleryItem.imageUrl);

    // Delete gallery item from database
    await Gallery.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting gallery item',
      error: error.message
    });
  }
};

export {
  uploadGalleryImage,
  getMyGallery,
  getPublicGallery,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
  getAllGalleryItems,
  getAdminGalleryItemById,
  updateAdminGalleryItem,
  deleteAdminGalleryItem,
  upload
};