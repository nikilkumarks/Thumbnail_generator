import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STROKE = 2;

const STYLES = [
  { id: 'default', label: 'Default', hint: 'Balanced YouTube look' },
  { id: 'cinematic', label: 'Cinematic', hint: 'Film-grade lighting & depth' },
  { id: 'bold', label: 'Bold & Vivid', hint: 'High contrast, punchy colors' },
  { id: 'minimal', label: 'Minimal', hint: 'Clean, lots of negative space' },
];

const MOODS = [
  { id: 'energetic', label: 'Energetic' },
  { id: 'calm', label: 'Calm' },
  { id: 'dramatic', label: 'Dramatic' },
  { id: 'playful', label: 'Playful' },
];

const TEXT_OVERLAY = [
  { id: 'none', label: 'No text' },
  { id: 'title', label: 'Room for title' },
  { id: 'bold-text', label: 'Bold headline area' },
];

export const buildPromptModifiers = (tools) => {
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

  if (tools.style !== 'default' && styleMap[tools.style]) parts.push(styleMap[tools.style]);
  if (tools.mood && moodMap[tools.mood]) parts.push(moodMap[tools.mood]);
  if (tools.textOverlay !== 'none' && textMap[tools.textOverlay]) parts.push(textMap[tools.textOverlay]);

  return parts.length ? `. ${parts.join(', ')}.` : '';
};

const PromptToolsPanel = ({ open, onClose, tools, onChange }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="prompt-tools-backdrop"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="prompt-tools-panel"
          role="dialog"
          aria-label="Prompt tools"
        >
          <div className="prompt-tools-panel__header">
            <div>
              <p className="text-h4" style={{ color: 'white' }}>Prompt tools</p>
              <p className="text-body-sm" style={{ fontSize: '0.78rem', marginTop: 2 }}>Modifiers apply to your next generation</p>
            </div>
            <button type="button" className="btn-icon btn-icon--ghost" onClick={onClose} aria-label="Close">
              <X size={18} strokeWidth={STROKE} />
            </button>
          </div>

          <div className="prompt-tools-section">
            <p className="text-label">Visual style</p>
            <div className="prompt-tools-chips">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`prompt-tools-chip ${tools.style === s.id ? 'prompt-tools-chip--active' : ''}`}
                  onClick={() => onChange({ ...tools, style: s.id })}
                >
                  <span>{s.label}</span>
                  <small>{s.hint}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="prompt-tools-section">
            <p className="text-label">Mood</p>
            <div className="prompt-tools-row">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`prompt-tools-pill ${tools.mood === m.id ? 'prompt-tools-pill--active' : ''}`}
                  onClick={() => onChange({ ...tools, mood: tools.mood === m.id ? null : m.id })}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="prompt-tools-section">
            <p className="text-label">Text overlay</p>
            <div className="prompt-tools-row">
              {TEXT_OVERLAY.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`prompt-tools-pill ${tools.textOverlay === t.id ? 'prompt-tools-pill--active' : ''}`}
                  onClick={() => onChange({ ...tools, textOverlay: t.id })}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default PromptToolsPanel;
