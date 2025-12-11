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
  description: {
    type: String,
    required: true,
    trim: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  projectUrl: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const StudentProject = mongoose.model('StudentProject', studentProjectSchema);

export default StudentProject;