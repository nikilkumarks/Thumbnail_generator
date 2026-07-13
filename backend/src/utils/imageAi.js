const { CohereClient } = require('cohere-ai');
const { HfInference } = require('@huggingface/inference');
const { getSizePreset } = require('./sizePresets');
const { applyPromptTools } = require('./promptTools');

const FLUX_MODEL = 'black-forest-labs/FLUX.1-schnell';
const IMG2IMG_MODEL = 'stabilityai/stable-diffusion-2-1';

const dataUrlToBlob = (dataUrl) => {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
  const bytes = Buffer.from(base64, 'base64');
  return new Blob([bytes], { type: mime });
};

const blobToDataUrl = async (blob) => {
  const buffer = Buffer.from(await blob.arrayBuffer());
  return `data:image/png;base64,${buffer.toString('base64')}`;
};

const refinePrompt = async (cohere, userPrompt, { hasReference = false, isEdit = false, editInstruction = '' } = {}) => {
  let instruction = `Refine this into a high-quality YouTube video thumbnail description. Keep it vivid and specific for image generation:\n${userPrompt}`;

  if (hasReference) {
    instruction += '\n\nThe user attached a reference image. Match its composition, color palette, lighting, and layout closely while applying the description above.';
  }

  if (isEdit && editInstruction) {
    instruction = `Create a YouTube thumbnail image description that applies this edit to an existing thumbnail while keeping the main subject and layout:\nEdit request: ${editInstruction}\n\nOriginal idea: ${userPrompt}\n\nDescribe the final thumbnail in detail for image generation.`;
  }

  const response = await cohere.chat({
    model: 'command-r-08-2024',
    message: instruction,
  });

  return response.text.trim().replace(/^["'\s]+|["'\s]+$/g, '');
};

const generateFromText = async (hf, prompt, { width, height }) => {
  return hf.textToImage({
    model: FLUX_MODEL,
    inputs: prompt,
    parameters: { width, height },
  });
};

const generateFromReference = async (hf, prompt, referenceDataUrl, { width, height }) => {
  const refBlob = dataUrlToBlob(referenceDataUrl);
  try {
    return await hf.imageToImage({
      model: IMG2IMG_MODEL,
      inputs: refBlob,
      parameters: {
        prompt,
        strength: 0.72,
        width,
        height,
      },
    });
  } catch (err) {
    console.warn('Reference img2img fallback to text-only:', err.message);
    return generateFromText(
      hf,
      `${prompt}. Match the style and composition of the user's reference image closely.`,
      { width, height }
    );
  }
};

/** Edit via img2img (SD 2.1) — pix2pix not on HF Inference Providers */
const editImage = async (hf, refinedPrompt, sourceDataUrl, { width, height }) => {
  const sourceBlob = dataUrlToBlob(sourceDataUrl);
  try {
    return await hf.imageToImage({
      model: IMG2IMG_MODEL,
      inputs: sourceBlob,
      parameters: {
        prompt: refinedPrompt,
        strength: 0.58,
        width,
        height,
      },
    });
  } catch (err) {
    console.warn('Edit img2img unavailable, using text regeneration:', err.message);
    return generateFromText(
      hf,
      `${refinedPrompt}. Keep the same subject, pose, and layout as the original thumbnail while applying the edit.`,
      { width, height }
    );
  }
};

const runGeneration = async ({
  userPrompt,
  promptTools,
  referenceImage,
  sourceImage,
  editInstruction,
  sizePreset = 'youtube',
}) => {
  const cohereKey = process.env.COHERE_API_KEY?.trim();
  const hfToken = process.env.HUGGINGFACE_TOKEN?.trim();

  if (!cohereKey || !hfToken) {
    throw new Error('API Keys are missing in .env');
  }

  const { width, height } = getSizePreset(sizePreset);
  const cohere = new CohereClient({ token: cohereKey });
  const hf = new HfInference(hfToken);

  const isEdit = Boolean(sourceImage && editInstruction);
  const promptWithTools = isEdit ? userPrompt : applyPromptTools(userPrompt, promptTools);

  const refinedPrompt = await refinePrompt(cohere, promptWithTools, {
    hasReference: Boolean(referenceImage),
    isEdit,
    editInstruction,
  });

  let blob;
  if (isEdit) {
    blob = await editImage(hf, refinedPrompt, sourceImage, { width, height });
  } else if (referenceImage) {
    blob = await generateFromReference(hf, refinedPrompt, referenceImage, { width, height });
  } else {
    blob = await generateFromText(hf, refinedPrompt, { width, height });
  }

  const imageUrl = await blobToDataUrl(blob);

  return {
    imageUrl,
    userPrompt,
    refinedPrompt,
    width,
    height,
    sizePreset,
    promptTools: promptTools || null,
  };
};

module.exports = { runGeneration, refinePrompt, blobToDataUrl };
