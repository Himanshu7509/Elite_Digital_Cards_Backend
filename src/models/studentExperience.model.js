import mongoose from 'mongoose';

const studentExperienceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  description: {
    type: String,
    trim: true
  },
  isCurrent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const StudentExperience = mongoose.model('StudentExperience', studentExperienceSchema);

export default StudentExperience;