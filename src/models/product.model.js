import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productPhoto: {
    type: String, // S3 URL
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  details: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;