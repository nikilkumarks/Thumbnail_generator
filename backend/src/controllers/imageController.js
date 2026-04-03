const axios = require('axios');
const Generation = require('../models/Generation');

// @desc    Generate a thumbnail image and save to database
// @route   POST /api/images/generate
// @access  Private
const generateImage = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    // Generate the image (Mock for now, replace with real API logic)
    // For now we use the same placeholder logic that encodes prompt
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const imageUrl = `https://via.placeholder.com/1280x720.png?text=Thumbnail+for+${encodeURIComponent(prompt)}`;
    
    // SAVE to Database
    const generation = await Generation.create({
      user: req.user._id,
      prompt,
      imageUrl
    });

    res.status(201).json({ 
      success: true, 
      imageUrl: generation.imageUrl,
      prompt: generation.prompt,
      createdAt: generation.createdAt
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Image generation failed' });
  }
};

// @desc    Get all generations for the logged in user
// @route   GET /api/images/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const history = await Generation.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json(history);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

module.exports = { generateImage, getHistory };
