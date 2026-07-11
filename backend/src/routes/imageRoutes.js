const express = require('express');
const {
  generateImage,
  editImage,
  getHistory,
  toggleFavorite,
  deleteGeneration,
  getPresets,
} = require('../controllers/imageController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/presets', protect, getPresets);
router.post('/generate', protect, generateImage);
router.post('/edit', protect, editImage);
router.get('/history', protect, getHistory);
router.patch('/generations/:id/favorite', protect, toggleFavorite);
router.delete('/:id', protect, deleteGeneration);

module.exports = router;
