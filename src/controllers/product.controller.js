import Product from '../models/product.model.js';
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
  const fileKey = `elite-cards/products/${uuidv4()}-${Date.now()}-${file.originalname}`;
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

// Create product
const createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Product photo is required'
      });
    }

    // Upload image to S3
    const imageUrl = await uploadToS3(req.file);

    const { productName, price, details } = req.body;

    const product = new Product({
      userId: req.user.id,
      productName,
      productPhoto: imageUrl,
      price,
      details
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Get all products for the user
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id });
    
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get public products by user ID
const getPublicProducts = async (req, res) => {
  try {
    const { userId } = req.params;
    const products = await Product.find({ userId: userId });
    
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findOne({ _id: id, userId: req.user.id });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, price, details } = req.body;

    // Check if product exists and belongs to user
    const existingProduct = await Product.findOne({ _id: id, userId: req.user.id });
    
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle product photo update
    let updateData = { productName, price, details };
    if (req.file) {
      // Upload new image to S3
      const imageUrl = await uploadToS3(req.file);
      // Delete old image from S3
      await deleteImageFromS3(existingProduct.productPhoto);
      // Add new image URL to update data
      updateData.productPhoto = imageUrl;
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the product to get the image URL
    const product = await Product.findOne({ _id: id, userId: req.user.id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete image from S3
    await deleteImageFromS3(product.productPhoto);

    // Delete product from database
    await Product.findOneAndDelete({ _id: id, userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// Admin: Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('userId', 'email role');
    
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Admin: Get specific product
const getAdminProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id).populate('userId', 'email role');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Admin: Update product
const updateAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, price, details } = req.body;

    // Check if product exists
    const existingProduct = await Product.findById(id);
    
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle product photo update
    let updateData = { productName, price, details };
    if (req.file) {
      // Delete old image from S3
      await deleteImageFromS3(existingProduct.productPhoto);
      // Add new image URL to update data
      updateData.productPhoto = req.file.location;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'email role');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Admin: Delete product
const deleteAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the product to get the image URL
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete image from S3
    await deleteImageFromS3(product.productPhoto);

    // Delete product from database
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

export {
  createProduct,
  getMyProducts,
  getPublicProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAdminProductById,
  updateAdminProduct,
  deleteAdminProduct,
  upload
};