const express = require('express');
const {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
  logoutUser,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.post('/logout', logoutUser);

module.exports = router;
