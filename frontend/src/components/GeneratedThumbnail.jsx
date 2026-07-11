import React from 'react';
import {
  Download, Wand2, Maximize2, Star, Paintbrush, Type, ChevronDown, ChevronUp, Copy, RotateCcw,
} from 'lucide-react';
import BrandLogo from './BrandLogo';

const STROKE = 2;
const ICON = { sm: 14, lg: 18, xl: 24 };

export const PromptBubble = ({ msg, isMobile, showRefined, onToggleRefined }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <div className="chat-bubble-user" style={{ maxWidth: isMobile ? '92%' : '85%', fontSize: isMobile ? '0.9rem' : '1rem' }}>
      {msg.referenceUrl && <img src={msg.referenceUrl} alt="Reference" className="chat-reference-thumb" />}
      <p>{msg.content}</p>
      {msg.refinedPrompt && msg.refinedPrompt !== msg.content && (
        <div className="refined-prompt-block">
          <button type="button" className="refined-prompt-toggle" onClick={onToggleRefined}>
            {showRefined ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            AI refined prompt
          </button>
          {showRefined && (
            <p className="refined-prompt-text">{msg.refinedPrompt}</p>
          )}
        </div>
      )}
    </div>
  </div>
);

const GeneratedThumbnail = ({
  msg,
  isMobile,
  onPreview,
  onDownload,
  onReprompt,
  onEdit,
  onEditor,
  onFavorite,
  onCopyRefined,
}) => (
  <div className="chat-row">
    {!isMobile && (
      <div className="chat-avatar">
        <BrandLogo size={20} />
      </div>
    )}
    <div className="premium-card" style={{ width: '100%', maxWidth: '720px' }}>
      <button type="button" className="thumb-preview-trigger" onClick={onPreview} aria-label="View full screen preview">
        <img src={msg.content} alt="Generated thumbnail" className="thumb-preview-trigger__img" style={{ aspectRatio: `${msg.width || 1280}/${msg.height || 720}` }} />
        <span className="thumb-preview-trigger__overlay">
          <Maximize2 size={22} strokeWidth={STROKE} />
          <span>Full screen</span>
        </span>
      </button>

      {msg.refinedPrompt && (
        <div className="refined-prompt-bar">
          <p className="refined-prompt-bar__text" title={msg.refinedPrompt}>{msg.refinedPrompt}</p>
          <button type="button" className="btn-icon" onClick={onCopyRefined} title="Copy refined prompt"><Copy size={14} strokeWidth={STROKE} /></button>
        </div>
      )}

      <div className="thumb-actions">
        <div className="thumb-actions__buttons">
          <button type="button" className="btn-primary btn-compact" onClick={onDownload}>
            <Download size={ICON.sm} strokeWidth={STROKE} /> Download
          </button>
          <button type="button" className="btn-secondary btn-compact" onClick={onReprompt}>
            <Wand2 size={ICON.sm} strokeWidth={STROKE} /> Re-prompt
          </button>
          <button type="button" className="btn-secondary btn-compact" onClick={onEdit}>
            <Paintbrush size={ICON.sm} strokeWidth={STROKE} /> Edit
          </button>
          <button type="button" className="btn-secondary btn-compact" onClick={onEditor}>
            <Type size={ICON.sm} strokeWidth={STROKE} /> Text
          </button>
          <button type="button" className={`btn-icon btn-icon--ghost ${msg.isFavorite ? 'btn-icon--active' : ''}`} onClick={onFavorite} title="Favorite">
            <Star size={ICON.sm} strokeWidth={STROKE} fill={msg.isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        <span className="text-caption">{msg.width || 1280} × {msg.height || 720} · PNG</span>
      </div>
    </div>
  </div>
);

export default GeneratedThumbnail;
