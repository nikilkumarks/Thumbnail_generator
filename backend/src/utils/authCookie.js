const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'token';
const COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: COOKIE_MAX_AGE_MS,
  path: '/',
});

const setAuthCookie = (res, userId) => {
  const token = generateToken(userId);
  res.cookie(COOKIE_NAME, token, getCookieOptions());
};

const clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
  });
};

const formatUserResponse = (user) => {
  const adminEmail = process.env.ADMIN_EMAIL?.trim()?.toLowerCase();
  const isAdmin = adminEmail && user.email?.toLowerCase() === adminEmail;
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: Boolean(isAdmin),
    ...(user.picture ? { picture: user.picture } : {}),
  };
};

module.exports = {
  COOKIE_NAME,
  generateToken,
  setAuthCookie,
  clearAuthCookie,
  formatUserResponse,
};
