const express = require('express');
const { getHealthDashboard } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/health', protect, getHealthDashboard);

module.exports = router;
