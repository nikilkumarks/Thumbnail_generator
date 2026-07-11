const User = require('../models/User');
const Generation = require('../models/Generation');
const Conversation = require('../models/Conversation');
const JobLog = require('../models/JobLog');
const mongoose = require('mongoose');

const isAdminUser = (user) => {
  const adminEmail = process.env.ADMIN_EMAIL?.trim()?.toLowerCase();
  return adminEmail && user?.email?.toLowerCase() === adminEmail;
};

// @route GET /api/admin/health
const getHealthDashboard = async (req, res) => {
  if (!isAdminUser(req.user)) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const cohereOk = Boolean(process.env.COHERE_API_KEY?.trim());
  const hfOk = Boolean(process.env.HUGGINGFACE_TOKEN?.trim());
  const mongoOk = mongoose.connection.readyState === 1;

  const [totalUsers, totalGenerations, totalConversations, recentFailures] = await Promise.all([
    User.countDocuments(),
    Generation.countDocuments(),
    Conversation.countDocuments(),
    JobLog.find().sort({ createdAt: -1 }).limit(20).populate('user', 'name email'),
  ]);

  const failuresLast24h = await JobLog.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  res.json({
    status: mongoOk && cohereOk && hfOk ? 'healthy' : 'degraded',
    services: {
      mongodb: mongoOk ? 'online' : 'offline',
      cohere: cohereOk ? 'configured' : 'missing_key',
      huggingface: hfOk ? 'configured' : 'missing_key',
    },
    stats: {
      totalUsers,
      totalGenerations,
      totalConversations,
      failuresLast24h,
    },
    recentFailures: recentFailures.map((j) => ({
      id: j._id,
      type: j.type,
      error: j.error,
      user: j.user ? { name: j.user.name, email: j.user.email } : null,
      createdAt: j.createdAt,
    })),
  });
};

module.exports = { getHealthDashboard, isAdminUser };
