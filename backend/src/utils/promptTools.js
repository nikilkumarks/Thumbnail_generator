/** Shared prompt-tool modifiers (keep in sync with frontend PromptToolsPanel). */
const buildPromptModifiers = (tools = {}) => {
  if (!tools || typeof tools !== 'object') return '';

  const parts = [];
  const styleMap = {
    cinematic: 'cinematic lighting, shallow depth of field, film grain',
    bold: 'bold vivid colors, high contrast, eye-catching composition',
    minimal: 'minimal clean layout, soft palette, generous negative space',
  };
  const moodMap = {
    energetic: 'energetic dynamic mood',
    calm: 'calm relaxed mood',
    dramatic: 'dramatic intense mood',
    playful: 'playful fun mood',
  };
  const textMap = {
    title: 'leave clear space for a short title overlay on the left or top',
    'bold-text': 'leave a bold headline text area with strong contrast background',
  };

  if (tools.style && tools.style !== 'default' && styleMap[tools.style]) {
    parts.push(styleMap[tools.style]);
  }
  if (tools.mood && moodMap[tools.mood]) parts.push(moodMap[tools.mood]);
  if (tools.textOverlay && tools.textOverlay !== 'none' && textMap[tools.textOverlay]) {
    parts.push(textMap[tools.textOverlay]);
  }

  return parts.length ? `. ${parts.join(', ')}.` : '';
};

const applyPromptTools = (userPrompt, tools) => {
  const base = (userPrompt || '').trim();
  const modifiers = buildPromptModifiers(tools);
  if (!modifiers) return base;
  return `${base}${modifiers}`.trim();
};

module.exports = { buildPromptModifiers, applyPromptTools };
