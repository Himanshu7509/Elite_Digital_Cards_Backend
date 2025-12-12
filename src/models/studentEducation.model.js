import mongoose from 'mongoose';

const studentEducationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  major: {
    type: String,
    trim: true
  },
  school: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    trim: true
  },
  gpa: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const StudentEducation = mongoose.model('StudentEducation', studentEducationSchema);

export default StudentEducation;