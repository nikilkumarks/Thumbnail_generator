const User = require('../models/User');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const {
  setAuthCookie,
  clearAuthCookie,
  formatUserResponse,
} = require('../utils/authCookie');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      setAuthCookie(res, user._id);
      res.status(201).json(formatUserResponse(user));
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'Please login using Google' });
    }

    if (user && (await user.matchPassword(password))) {
      setAuthCookie(res, user._id);
      res.json(formatUserResponse(user));
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Google OAuth
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID?.trim();
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);

  try {
    let name, email, sub, picture;

    if (req.body.isAccessToken) {
      const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      name = data.name;
      email = data.email;
      sub = data.sub;
      picture = data.picture;
    } else {
      console.log('Verifying Google Token with Client ID:', GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      name = payload.name;
      email = payload.email;
      sub = payload.sub;
      picture = payload.picture;
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: sub,
        picture,
      });
    } else {
      user.googleId = sub;
      user.picture = picture;
      await user.save();
    }

    setAuthCookie(res, user._id);
    res.json(formatUserResponse(user));
  } catch (error) {
    console.error('Google Verification Failed!');
    console.error('Error Message:', error.message);
    console.error('Environment GOOGLE_CLIENT_ID Length:', process.env.GOOGLE_CLIENT_ID?.length);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

// @desc    Get current user from cookie
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json(formatUserResponse(req.user));
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true });
};

module.exports = { registerUser, loginUser, googleLogin, getMe, logoutUser };
