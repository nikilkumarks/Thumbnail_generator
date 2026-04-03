const express = require('express');
const { generateImage, getHistory, deleteGeneration } = require('../controllers/imageController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected routes: only logged in users can access their history or generate images
router.post('/generate', protect, generateImage);
router.get('/history', protect, getHistory);
router.delete('/:id', protect, deleteGeneration);

module.exports = router;
