import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Type } from 'lucide-react';
import { motion } from 'framer-motion';
import { SIZE_PRESETS, TEXT_POSITIONS } from '../constants/sizePresets';

const STROKE = 2;

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const drawComposite = (ctx, img, w, h, { text, fontSize, color, position, fontFamily }) => {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);

  if (!text.trim()) return;

  ctx.font = `800 ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = Math.max(3, fontSize * 0.08);
  ctx.textBaseline = 'top';

  const padding = w * 0.05;
  const maxWidth = w - padding * 2;
  const lines = wrapText(ctx, text.toUpperCase(), maxWidth);
  const lineHeight = fontSize * 1.15;
  const blockHeight = lines.length * lineHeight;

  let x = padding;
  let y = padding;
  if (position.includes('center')) x = w / 2;
  if (position.includes('bottom')) y = h - padding - blockHeight;

  lines.forEach((line, i) => {
    const ly = y + i * lineHeight;
    if (position.includes('center')) {
      ctx.textAlign = 'center';
      ctx.strokeText(line, w / 2, ly);
      ctx.fillText(line, w / 2, ly);
    } else {
      ctx.textAlign = 'left';
      ctx.strokeText(line, x, ly);
      ctx.fillText(line, x, ly);
    }
  });
};

const wrapText = (ctx, text, maxWidth) => {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  return lines;
};

const ThumbnailEditor = ({ imageUrl, onClose, initialPreset = 'youtube' }) => {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(72);
  const [color, setColor] = useState('#FFFFFF');
  const [position, setPosition] = useState('bottom-left');
  const [preset, setPreset] = useState(initialPreset);
  const canvasRef = useRef(null);

  const { width, height } = SIZE_PRESETS[preset] || SIZE_PRESETS.youtube;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const img = await loadImage(imageUrl);
        if (cancelled || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        drawComposite(ctx, img, width, height, {
          text,
          fontSize,
          color,
          position,
          fontFamily: 'Syne, Inter, sans-serif',
        });
      } catch (e) {
        console.error('Editor render failed', e);
      }
    })();
    return () => { cancelled = true; };
  }, [imageUrl, text, fontSize, color, position, preset, width, height]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = `thumb-edited-${Date.now()}.png`;
    link.click();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="editor-overlay" onClick={onClose}>
      <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} className="editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="editor-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Type size={18} strokeWidth={STROKE} className="text-accent" />
            <h2 className="text-h3" style={{ color: 'white' }}>Text & export</h2>
          </div>
          <button type="button" className="btn-icon btn-icon--ghost" onClick={onClose} aria-label="Close"><X size={18} strokeWidth={STROKE} /></button>
        </div>

        <div className="editor-body">
          <div className="editor-preview-wrap">
            <canvas ref={canvasRef} width={width} height={height} className="editor-canvas" />
          </div>

          <div className="editor-controls">
            <label className="text-label">Title text</label>
            <input className="input-field" value={text} onChange={(e) => setText(e.target.value)} placeholder="YOUR TITLE HERE" style={{ marginBottom: 'var(--space-4)' }} />

            <label className="text-label">Export size</label>
            <div className="prompt-tools-row" style={{ marginBottom: 'var(--space-4)' }}>
              {Object.entries(SIZE_PRESETS).map(([key, p]) => (
                <button key={key} type="button" className={`prompt-tools-pill ${preset === key ? 'prompt-tools-pill--active' : ''}`} onClick={() => setPreset(key)}>
                  {p.label} ({p.ratio})
                </button>
              ))}
            </div>

            <label className="text-label">Position</label>
            <div className="prompt-tools-row" style={{ marginBottom: 'var(--space-4)' }}>
              {TEXT_POSITIONS.map((p) => (
                <button key={p.id} type="button" className={`prompt-tools-pill ${position === p.id ? 'prompt-tools-pill--active' : ''}`} onClick={() => setPosition(p.id)}>
                  {p.label}
                </button>
              ))}
            </div>

            <label className="text-label">Font size ({fontSize}px)</label>
            <input type="range" min={32} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} style={{ width: '100%', marginBottom: 'var(--space-4)' }} />

            <label className="text-label">Text color</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: '100%', height: 40, marginBottom: 'var(--space-6)', border: 'none', background: 'transparent' }} />

            <button type="button" className="btn-primary" style={{ width: '100%' }} onClick={handleDownload}>
              <Download size={16} strokeWidth={STROKE} /> Download {SIZE_PRESETS[preset].label}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ThumbnailEditor;
