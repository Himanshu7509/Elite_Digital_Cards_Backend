import mongoose from 'mongoose';

const studentProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    trim: true
  },
  tech: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const StudentProject = mongoose.model('StudentProject', studentProjectSchema);

export default StudentProject;