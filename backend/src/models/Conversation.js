const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'New Thumbnail'
  },
  generations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Generation'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
