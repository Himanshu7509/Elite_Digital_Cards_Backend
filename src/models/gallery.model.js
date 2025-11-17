import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;