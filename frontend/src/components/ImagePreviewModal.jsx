import React, { useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STROKE = 2;

const ImagePreviewModal = ({ imageUrl, prompt, width, height, onClose, onDownloadRef }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `thumb-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (!imageUrl) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        handleDownload();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [imageUrl, onClose]);

  useEffect(() => {
    if (onDownloadRef) onDownloadRef.current = handleDownload;
  }, [imageUrl, onDownloadRef]);

  return (
    <AnimatePresence>
      {imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="image-preview-overlay"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Full screen thumbnail preview"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="image-preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="image-preview-toolbar">
              <div className="image-preview-toolbar__meta">
                <span className="text-caption">{width || 1280} × {height || 720} · PNG</span>
                {prompt && <p className="image-preview-prompt">{prompt}</p>}
              </div>
              <div className="image-preview-toolbar__actions">
                <button type="button" className="btn-secondary" onClick={handleDownload} style={{ fontSize: '0.8rem' }}>
                  <Download size={16} strokeWidth={STROKE} /> Download
                </button>
                <button type="button" className="image-preview-close" onClick={onClose} aria-label="Close preview">
                  <X size={20} strokeWidth={STROKE} />
                </button>
              </div>
            </div>

            <div className="image-preview-stage">
              <img src={imageUrl} alt={prompt || 'Generated thumbnail'} className="image-preview-img" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImagePreviewModal;
