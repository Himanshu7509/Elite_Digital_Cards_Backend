import mongoose from 'mongoose';

const studentAchievementSchema = new mongoose.Schema({
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
  date: {
    type: Date
  }
}, {
  timestamps: true
});

const StudentAchievement = mongoose.model('StudentAchievement', studentAchievementSchema);

export default StudentAchievement;