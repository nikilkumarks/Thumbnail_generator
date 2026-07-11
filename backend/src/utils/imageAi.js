const { CohereClient } = require('cohere-ai');
const { HfInference } = require('@huggingface/inference');
const { getSizePreset } = require('./sizePresets');

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
    instruction = `The user wants to edit an existing thumbnail. Apply ONLY this change while preserving the rest of the image:\n${editInstruction}\n\nOriginal context: ${userPrompt}`;
  }

  const response = await cohere.chat({
    model: 'command-r-08-2024',
    message: instruction,
  });

  return response.text.trim().replace(/^["'\s]+|["'\s]+$/g, '');
};

const generateFromText = async (hf, prompt, { width, height }) => {
  return hf.textToImage({
    model: 'black-forest-labs/FLUX.1-schnell',
    inputs: prompt,
    parameters: { width, height },
  });
};

const generateFromReference = async (hf, prompt, referenceDataUrl, { width, height }) => {
  const refBlob = dataUrlToBlob(referenceDataUrl);
  try {
    return await hf.imageToImage({
      model: 'stabilityai/stable-diffusion-2-1',
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
    return generateFromText(hf, `${prompt}. Match the style and composition of the user's reference image closely.`, { width, height });
  }
};

const editImage = async (hf, sourceDataUrl, editInstruction) => {
  const sourceBlob = dataUrlToBlob(sourceDataUrl);
  return hf.imageToImage({
    model: 'timbrooks/instruct-pix2pix',
    inputs: sourceBlob,
    parameters: { prompt: editInstruction },
  });
};

const runGeneration = async ({
  userPrompt,
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
  const refinedPrompt = await refinePrompt(cohere, userPrompt, {
    hasReference: Boolean(referenceImage),
    isEdit,
    editInstruction,
  });

  let blob;
  if (isEdit) {
    blob = await editImage(hf, sourceImage, editInstruction);
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
  };
};

module.exports = { runGeneration, refinePrompt, blobToDataUrl };
