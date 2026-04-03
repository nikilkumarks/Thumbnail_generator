const express = require('express');
const { generateImage, getHistory } = require('../controllers/imageController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected routes: only logged in users can access their history or generate images
router.post('/generate', protect, generateImage);
router.get('/history', protect, getHistory);

module.exports = router;
