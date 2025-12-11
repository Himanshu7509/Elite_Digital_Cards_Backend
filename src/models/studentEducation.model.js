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
  institution: {
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
  gpa: {
    type: Number,
    min: 0,
    max: 4.0
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const StudentEducation = mongoose.model('StudentEducation', studentEducationSchema);

export default StudentEducation;