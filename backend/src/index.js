const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
const hasFrontendBuild = fs.existsSync(path.join(frontendDistPath, 'index.html'));

console.log('--- Environment Check ---');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('COHERE_API_KEY Length:', process.env.COHERE_API_KEY?.trim()?.length || 0);
console.log('HUGGINGFACE_TOKEN Length:', process.env.HUGGINGFACE_TOKEN?.trim()?.length || 0);
console.log('Frontend build:', hasFrontendBuild ? 'found' : 'missing (run npm run build from repo root)');
console.log('------------------------');

connectDB();

const app = express();

if (isProduction) {
  app.set('trust proxy', 1);
}

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Same-origin / server-to-server requests have no Origin header
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '15mb' }));

// API routes (always first)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    frontend: hasFrontendBuild,
    env: process.env.NODE_ENV || 'development',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/admin', adminRoutes);

// Serve React app from Express (production / unified deploy)
if (hasFrontendBuild) {
  app.use(express.static(frontendDistPath, {
    index: false,
    maxAge: isProduction ? '1d' : 0,
  }));

  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'PromptVision API is running.',
      hint: 'Build the frontend with `npm run build` from the repo root, then restart the server.',
      health: '/api/health',
    });
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  const mode = hasFrontendBuild ? 'API + frontend' : 'API only';
  console.log(`Server running (${mode}) on port ${PORT}`);
});
