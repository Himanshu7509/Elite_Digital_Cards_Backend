import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  profession: {
    type: String,
    trim: true
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
    linkedin: { type: String, trim: true },
    youtube: { type: String, trim: true },
    whatsapp: { type: String, trim: true }
  },
  websiteLink: {
    type: String,
    trim: true
  },
  appLink: {
    type: String,
    trim: true
  },
  templateId: {
    type: String,
    default: "template1"
  },
  profileImg: {
    type: String, // S3 URL
    trim: true
  },
  bannerImg: {
    type: String, // S3 URL
    trim: true
  }
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;