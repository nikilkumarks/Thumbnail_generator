import React, { useState } from 'react';
import { X, Paintbrush, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { EDIT_PRESETS } from '../constants/sizePresets';

const STROKE = 2;

const EditRegionModal = ({ open, onClose, onSubmit, loading }) => {
  const [selected, setSelected] = useState('background');
  const [custom, setCustom] = useState('');

  if (!open) return null;

  const handleSubmit = () => {
    const preset = EDIT_PRESETS.find((p) => p.id === selected);
    const instruction = selected === 'custom' ? custom.trim() : preset?.instruction;
    if (!instruction) return;
    onSubmit(instruction);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="editor-overlay" onClick={onClose}>
      <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} className="editor-modal editor-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="editor-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Paintbrush size={18} strokeWidth={STROKE} className="text-accent" />
            <h2 className="text-h3" style={{ color: 'white' }}>Edit region</h2>
          </div>
          <button type="button" className="btn-icon btn-icon--ghost" onClick={onClose}><X size={18} strokeWidth={STROKE} /></button>
        </div>

        <p className="text-body-sm" style={{ marginBottom: 'var(--space-4)' }}>
          Apply a targeted edit without regenerating the whole thumbnail.
        </p>

        <div className="prompt-tools-chips" style={{ marginBottom: 'var(--space-4)' }}>
          {EDIT_PRESETS.map((p) => (
            <button key={p.id} type="button" className={`prompt-tools-chip ${selected === p.id ? 'prompt-tools-chip--active' : ''}`} onClick={() => setSelected(p.id)}>
              <span>{p.label}</span>
            </button>
          ))}
          <button type="button" className={`prompt-tools-chip ${selected === 'custom' ? 'prompt-tools-chip--active' : ''}`} onClick={() => setSelected('custom')}>
            <span>Custom edit</span>
            <small>Describe your change</small>
          </button>
        </div>

        {selected === 'custom' && (
          <textarea
            className="input-field"
            rows={3}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="e.g. replace the background with a neon city skyline"
            style={{ marginBottom: 'var(--space-4)', resize: 'vertical' }}
          />
        )}

        <button type="button" className="btn-primary" style={{ width: '100%' }} disabled={loading || (selected === 'custom' && !custom.trim())} onClick={handleSubmit}>
          {loading ? <><Loader2 size={16} className="animate-spin" /> Applying edit…</> : 'Apply edit'}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default EditRegionModal;
