const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');

// Load environment variables
dotenv.config();

console.log('--- Environment Check ---');
console.log('GEMINI_API_KEY Length:', process.env.GEMINI_API_KEY?.trim()?.length || 0);
console.log('IMAGE_GEN_API_KEY Length:', process.env.IMAGE_GEN_API_KEY?.trim()?.length || 0);
console.log('------------------------');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
