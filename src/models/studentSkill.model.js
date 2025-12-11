import mongoose from 'mongoose';

const studentSkillSchema = new mongoose.Schema({
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
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

const StudentSkill = mongoose.model('StudentSkill', studentSkillSchema);

export default StudentSkill;