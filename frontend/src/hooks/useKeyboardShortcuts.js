import { useEffect } from 'react';

const useKeyboardShortcuts = ({
  onSend,
  onClosePreview,
  onDownloadPreview,
  previewOpen,
  canSend,
}) => {
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable;

      if (e.key === 'Escape' && previewOpen && onClosePreview) {
        onClosePreview();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && previewOpen && onDownloadPreview) {
        e.preventDefault();
        onDownloadPreview();
        return;
      }

      if (e.key === 'Enter' && !e.shiftKey && canSend && onSend && !isTyping) {
        e.preventDefault();
        onSend();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSend, onClosePreview, onDownloadPreview, previewOpen, canSend]);
};

export default useKeyboardShortcuts;
