import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  about: {
    type: String,
    trim: true
  },
  phone1: {
    type: String,
    trim: true
  },
  phone2: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  dob: {
    type: Date
  },
  socialMedia: {
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    twitter: { type: String, trim: true },
    youtube: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true }
  },
  profilePic: {
    type: String, // S3 URL
    trim: true
  },
  bannerPic: {
    type: String, // S3 URL
    trim: true
  },
  templateId: {
    type: String,
    default: "template1"
  }
}, {
  timestamps: true
});

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);

export default StudentProfile;