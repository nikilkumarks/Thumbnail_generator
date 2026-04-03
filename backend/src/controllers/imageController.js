const Generation = require('../models/Generation');
const { CohereClient } = require("cohere-ai");

// @desc Generate thumbnail
const generateImage = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  let refinedPrompt = "";

  try {
    // 🧠 1. Try Cohere (optional enhancement)
    try {
      const cohere = new CohereClient({
        token: process.env.COHERE_API_KEY,
      });

      const response = await cohere.chat({
        model: "command-r-08-2024", // may vary per account
        message: `Convert this into a SHORT image prompt (keywords only, no paragraph):
        ${prompt}`,
      });

      refinedPrompt = response.text
        ?.replace(/^"|"$/g, "")
        ?.slice(0, 200);

    } catch (cohereError) {
      console.log("⚠️ Cohere failed, using fallback prompt");
    }

    // 🔥 2. Fallback (VERY IMPORTANT)
    if (!refinedPrompt) {
      refinedPrompt = `
      YouTube thumbnail, vibrant colors, high contrast,
      cinematic lighting, clickbait style, 16:9, ${prompt}
      `;
    }

    // 🎨 3. Generate Pollinations URL (Modern 'p/' endpoint)
    const width = 1280;
    const height = 720;

    const imageUrl = `https://pollinations.ai/prompt/${encodeURIComponent(
      refinedPrompt
    )}?width=${width}&height=${height}&nologo=true`;

    // 💾 4. Save
    const generation = await Generation.create({
      user: req.user._id,
      prompt: refinedPrompt,
      imageUrl,
    });

    // 🚀 5. Response
    res.status(201).json({
      success: true,
      imageUrl,
      prompt: refinedPrompt,
      createdAt: generation.createdAt,
    });

  } catch (error) {
    console.error("❌ Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Image generation failed",
    });
  }
};

// @desc    Get all generations for the logged in user
// @route   GET /api/images/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const history = await Generation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error("❌ History Error:", error.message);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

module.exports = { generateImage, getHistory };