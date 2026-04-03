const Generation = require('../models/Generation');
const { CohereClient } = require("cohere-ai");
const { HfInference } = require("@huggingface/inference");

// @desc    Generate a thumbnail image using Cohere AI + Hugging Face (FLUX.1-schnell)
// @route   POST /api/images/generate
// @access  Private
const generateImage = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  const COHERE_KEY = process.env.COHERE_API_KEY?.trim();
  const HF_TOKEN = process.env.HUGGINGFACE_TOKEN?.trim();

  if (!COHERE_KEY) return res.status(500).json({ message: 'Cohere API Key is missing' });
  if (!HF_TOKEN) return res.status(500).json({ message: 'Hugging Face Token is missing in .env' });

  try {
    // 🧠 1. Refine prompt using Cohere (The Brain)
    const cohere = new CohereClient({ token: COHERE_KEY });
    const responseChat = await cohere.chat({
      model: "command-r-08-2024",
      message: `Create a single paragraph prompt for an image generator. Focus on a vibrant YouTube thumbnail style for this topic: ${prompt}. No commentary, just the prompt.`,
    });

    const refinedPrompt = responseChat.text.trim().replace(/^["'\s]+|["'\s]+$/g, "");
    console.log("Hugging Face Prompt:", refinedPrompt);

    // 🎨 2. Generate Image using Hugging Face (The Artist - FLUX.1)
    const hf = new HfInference(HF_TOKEN);

    // Model selection (FLUX.1-schnell is state-of-the-art for fast generation)
    const blob = await hf.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: refinedPrompt,
      parameters: {
        width: 1024,
        height: 576, // 16:9 ratio
      }
    });

    // 🔄 3. Convert Blob to Base64 (Data URI)
    const buffer = Buffer.from(await blob.arrayBuffer());
    const base64Image = buffer.toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    // 💾 4. Save to DB
    const generation = await Generation.create({
      user: req.user._id,
      prompt: refinedPrompt,
      imageUrl, // Store the Base64 in DB for now (easy to display in local)
    });

    // 🚀 5. Final Response
    res.status(201).json({
      success: true,
      imageUrl,
      prompt: refinedPrompt,
      createdAt: generation.createdAt,
    });

  } catch (error) {
    console.error("❌ Hugging Face Service Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "AI generation failed",
    });
  }
};

// @desc    Get user history
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