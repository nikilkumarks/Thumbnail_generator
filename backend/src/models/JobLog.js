const mongoose = require('mongoose');

const jobLogSchema = new mongoose.Schema({
  type: { type: String, enum: ['generate', 'edit'], default: 'generate' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  error: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('JobLog', jobLogSchema);
