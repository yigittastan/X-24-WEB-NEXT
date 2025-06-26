// models/WorkSession.js
import mongoose from 'mongoose';

const WorkSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    default: null
  },
  lastPauseTime: {
    type: Date,
    default: null
  },
  duration: {
    type: Number, // saniye cinsinden
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active'
  },
  pausedDurations: [{
    pauseStart: Date,
    pauseEnd: Date,
    pauseDuration: Number
  }] // Ara verme geçmişi için
}, {
  timestamps: true // createdAt ve updatedAt otomatik ekler
});

// İndeksler
WorkSessionSchema.index({ userId: 1, status: 1 });
WorkSessionSchema.index({ createdAt: -1 });

// Model oluştur
const WorkSession = mongoose.models.WorkSession || mongoose.model('WorkSession', WorkSessionSchema);

export default WorkSession;