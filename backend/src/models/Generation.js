const mongoose = require('mongoose');

const generationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
  },
  userPrompt: {
    type: String,
    required: true,
  },
  refinedPrompt: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  sizePreset: {
    type: String,
    enum: ['youtube', 'shorts', 'community'],
    default: 'youtube',
  },
  width: { type: Number, default: 1280 },
  height: { type: Number, default: 720 },
  isFavorite: { type: Boolean, default: false },
  parentGeneration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Generation',
  },
  editInstruction: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Generation = mongoose.model('Generation', generationSchema);
module.exports = Generation;
