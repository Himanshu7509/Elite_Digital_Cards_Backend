import mongoose from 'mongoose';

const studentExperienceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  desc: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

const StudentExperience = mongoose.model('StudentExperience', studentExperienceSchema);

export default StudentExperience;