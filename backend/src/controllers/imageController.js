const Generation = require('../models/Generation');
const Conversation = require('../models/Conversation');
const JobLog = require('../models/JobLog');
const { runGeneration } = require('../utils/imageAi');
const { SIZE_PRESETS } = require('../utils/sizePresets');

const logFailedJob = async (type, userId, error) => {
  try {
    await JobLog.create({ type, user: userId, error: error?.message || String(error) });
  } catch (e) {
    console.error('Failed to log job:', e.message);
  }
};

const saveGeneration = async (req, result, { conversationId, parentGeneration, editInstruction }) => {
  let convo;
  if (conversationId) {
    convo = await Conversation.findOne({ _id: conversationId, user: req.user._id });
  }

  if (!convo) {
    convo = await Conversation.create({
      user: req.user._id,
      title: result.userPrompt.slice(0, 30) + (result.userPrompt.length > 30 ? '...' : ''),
    });
  }

  const gen = await Generation.create({
    user: req.user._id,
    conversation: convo._id,
    userPrompt: result.userPrompt,
    refinedPrompt: result.refinedPrompt,
    prompt: result.refinedPrompt,
    imageUrl: result.imageUrl,
    sizePreset: result.sizePreset,
    width: result.width,
    height: result.height,
    parentGeneration: parentGeneration || undefined,
    editInstruction: editInstruction || undefined,
  });

  convo.generations.push(gen._id);
  await convo.save();

  return { gen, convo };
};

// @desc    Generate a thumbnail image
// @route   POST /api/images/generate
const generateImage = async (req, res) => {
  const {
    prompt,
    conversationId,
    referenceImage,
    sizePreset = 'youtube',
    userPrompt: rawUserPrompt,
    promptTools,
  } = req.body;

  const userPrompt = (rawUserPrompt || prompt || '').trim();
  if (!userPrompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  if (!SIZE_PRESETS[sizePreset]) {
    return res.status(400).json({ message: 'Invalid size preset' });
  }

  try {
    const result = await runGeneration({
      userPrompt,
      promptTools,
      referenceImage,
      sizePreset,
    });

    const { gen, convo } = await saveGeneration(req, result, { conversationId });

    res.status(201).json({
      success: true,
      imageUrl: result.imageUrl,
      userPrompt: gen.userPrompt,
      refinedPrompt: gen.refinedPrompt,
      prompt: gen.refinedPrompt,
      conversationId: convo._id,
      generationId: String(gen._id),
      sizePreset: gen.sizePreset,
      width: gen.width,
      height: gen.height,
      createdAt: gen.createdAt,
    });
  } catch (error) {
    console.error('❌ AI Error:', error.message);
    await logFailedJob('generate', req.user._id, error);

    const isInvalidHfToken =
      error.message?.includes('Invalid username or password') ||
      error.message?.includes('401');

    res.status(500).json({
      success: false,
      message: isInvalidHfToken
        ? 'Invalid HUGGINGFACE_TOKEN. Create a new token at https://huggingface.co/settings/tokens with Inference Providers permission, then update backend/.env'
        : error.message || 'Generation failed',
    });
  }
};

// @desc    Edit region / inpaint-style change
// @route   POST /api/images/edit
const editImage = async (req, res) => {
  const { sourceImage, editInstruction, conversationId, userPrompt, parentGenerationId, sizePreset = 'youtube' } = req.body;

  if (!sourceImage || !editInstruction) {
    return res.status(400).json({ message: 'sourceImage and editInstruction are required' });
  }

  try {
    const result = await runGeneration({
      userPrompt: userPrompt || editInstruction,
      sourceImage,
      editInstruction,
      sizePreset,
    });

    const { gen, convo } = await saveGeneration(req, result, {
      conversationId,
      parentGeneration: parentGenerationId,
      editInstruction,
    });

    res.status(201).json({
      success: true,
      imageUrl: result.imageUrl,
      userPrompt: gen.userPrompt,
      refinedPrompt: gen.refinedPrompt,
      conversationId: convo._id,
      generationId: String(gen._id),
      sizePreset: gen.sizePreset,
      width: gen.width,
      height: gen.height,
    });
  } catch (error) {
    console.error('❌ Edit Error:', error.message);
    await logFailedJob('edit', req.user._id, error);
    res.status(500).json({ success: false, message: error.message || 'Edit failed' });
  }
};

// @desc    Get user history
const getHistory = async (req, res) => {
  try {
    const { favorites, q, from, to } = req.query;
    const filter = { user: req.user._id };

    if (from || to) {
      filter.updatedAt = {};
      if (from) filter.updatedAt.$gte = new Date(from);
      if (to) filter.updatedAt.$lte = new Date(to);
    }

    let history = await Conversation.find(filter)
      .populate('generations')
      .sort({ updatedAt: -1 });

    if (q) {
      const term = q.toLowerCase();
      history = history.filter((item) =>
        item.title?.toLowerCase().includes(term) ||
        item.generations?.some((g) =>
          g.userPrompt?.toLowerCase().includes(term) ||
          g.refinedPrompt?.toLowerCase().includes(term)
        )
      );
    }

    if (favorites === 'true') {
      history = history
        .map((item) => ({
          ...item.toObject(),
          generations: item.generations.filter((g) => g.isFavorite),
        }))
        .filter((item) => item.generations.length > 0);
    }

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'History failed' });
  }
};

// @desc    Toggle favorite on a generation
// @route   PATCH /api/images/generations/:id/favorite
const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const gen = await Generation.findOne({ _id: id, user: req.user._id });
    if (!gen) return res.status(404).json({ message: 'Not found' });

    const updated = await Generation.findByIdAndUpdate(
      gen._id,
      { isFavorite: !Boolean(gen.isFavorite) },
      { new: true, runValidators: false }
    );

    res.json({
      success: true,
      isFavorite: updated.isFavorite,
      generationId: String(updated._id),
    });
  } catch (error) {
    console.error('Favorite toggle failed:', error.message);
    res.status(500).json({ message: 'Favorite toggle failed' });
  }
};

// @desc    Delete a Thread
const deleteGeneration = async (req, res) => {
  try {
    const convo = await Conversation.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!convo) return res.status(404).json({ message: 'Not found' });

    await Generation.deleteMany({ conversation: convo._id });

    res.json({ success: true, message: 'Thread deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

// @desc    Size presets list
const getPresets = (req, res) => {
  res.json(SIZE_PRESETS);
};

module.exports = {
  generateImage,
  editImage,
  getHistory,
  toggleFavorite,
  deleteGeneration,
  getPresets,
};
