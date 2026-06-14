const Generation = require('../models/Generation');
const Conversation = require('../models/Conversation');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { HfInference } = require("@huggingface/inference");

// @desc    Generate a thumbnail image (Threaded Conversation)
// @route   POST /api/images/generate
// @access  Private
const generateImage = async (req, res) => {
  const { prompt, conversationId } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  const GEMINI_KEY = process.env.GEMINI_API_KEY?.trim();
  const HF_TOKEN = process.env.HUGGINGFACE_TOKEN?.trim();

  if (!GEMINI_KEY || !HF_TOKEN) {
    return res.status(500).json({ message: 'API Keys are missing in .env' });
  }

  try {
    //  ब्रेन (Refining the prompt)
    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const promptText = `You are an expert YouTube thumbnail designer. Refine the following user idea into a highly detailed image generation prompt for an AI image generator. 
CRITICAL RULES:
1. STRICTLY PRESERVE all specific brand names, vehicle models (e.g., Royal Enfield Himalayan 450), objects, and geographical locations (e.g., Bangalore, Chikmagalur) exactly as the user wrote them. Do NOT generalize them into vague terms.
2. The image must be perfectly suited for a YouTube thumbnail: high contrast, vibrant colors, cinematic lighting, a clear and eye-catching main subject, and leaving clean negative space for text overlays.
3. Specify that there should be NO text or words generated in the image itself.
Return ONLY the refined prompt. 
User idea: ${prompt}`;

    const result = await model.generateContent(promptText);
    const refinedPrompt = result.response.text().trim().replace(/^["'\s]+|["'\s]+$/g, "");

    // आर्टिस्ट (Generating the visual)
    const hf = new HfInference(HF_TOKEN);
    const blob = await hf.textToImage({
      provider: "hf-inference",
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: refinedPrompt,
      parameters: { width: 1280, height: 720 }
    });

    const buffer = Buffer.from(await blob.arrayBuffer());
    const imageUrl = `data:image/png;base64,${buffer.toString('base64')}`;

    // 🧵 Threading Logic
    let convo;
    if (conversationId) {
      convo = await Conversation.findOne({ _id: conversationId, user: req.user._id });
    }

    if (!convo) {
      convo = await Conversation.create({
        user: req.user._id,
        title: prompt.slice(0, 30) + (prompt.length > 30 ? '...' : '')
      });
    }

    const gen = await Generation.create({
      user: req.user._id,
      conversation: convo._id,
      prompt: refinedPrompt,
      imageUrl
    });

    convo.generations.push(gen._id);
    await convo.save();

    res.status(201).json({
      success: true,
      imageUrl,
      prompt: refinedPrompt,
      conversationId: convo._id,
      createdAt: gen.createdAt
    });

  } catch (error) {
    console.error("❌ AI Error:", error.message);
    res.status(500).json({ success: false, message: `Generation failed: ${error.message}` });
  }
};

// @desc    Get user history (Conversations)
const getHistory = async (req, res) => {
  try {
    const history = await Conversation.find({ user: req.user._id })
      .populate('generations')
      .sort({ updatedAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'History failed' });
  }
};

// @desc    Delete a Thread
const deleteGeneration = async (req, res) => {
  try {
    const convo = await Conversation.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!convo) return res.status(404).json({ message: 'Not found' });

    // Cleanup images in that thread
    await Generation.deleteMany({ conversation: convo._id });

    res.json({ success: true, message: 'Thread deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

module.exports = { generateImage, getHistory, deleteGeneration };