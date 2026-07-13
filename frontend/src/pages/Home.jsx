import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Navbar from '../components/Navbar';
import LoginModal from '../components/LoginModal';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import BrandLogo from '../components/BrandLogo';
import PromptToolsPanel, { buildPromptModifiers, DEFAULT_PROMPT_TOOLS } from '../components/PromptToolsPanel';
import ImagePreviewModal from '../components/ImagePreviewModal';
import GeneratedThumbnail, { PromptBubble } from '../components/GeneratedThumbnail';
import ThumbnailEditor from '../components/ThumbnailEditor';
import EditRegionModal from '../components/EditRegionModal';
import OnboardingTour, { shouldShowOnboarding } from '../components/OnboardingTour';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import { SIZE_PRESETS } from '../constants/sizePresets';
import {
  Send, Loader2, Image as ImageIcon, Gamepad2, Monitor, Camera, Stars, Info,
  PanelLeftClose, PanelLeftOpen, SlidersHorizontal, X, RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STROKE = 2;
const ICON = { sm: 14, md: 16, lg: 18, xl: 24 };
const MAX_REF_BYTES = 5 * 1024 * 1024;

const DEFAULT_TOOLS = DEFAULT_PROMPT_TOOLS;

const loadSavedTools = () => {
  try {
    const saved = localStorage.getItem('pv-prompt-tools');
    return saved ? { ...DEFAULT_TOOLS, ...JSON.parse(saved) } : DEFAULT_TOOLS;
  } catch {
    return DEFAULT_TOOLS;
  }
};

const PACKS = [
  { title: 'Gamer Pack', desc: 'High-contrast, action-packed gaming visual previews.', icon: Gamepad2, prompt: 'High-intensity, cinematic gaming action scene with glowing effects and bold highlights.' },
  { title: 'Lifestyle Vlog', desc: 'Natural, airy, and inviting travel or lifestyle themes.', icon: Camera, prompt: 'Minimalist, bright, and vibrant travel vlog thumbnail with natural lighting and soft focus.' },
  { title: 'Tech Review', desc: 'Sharp, precision-focused hardware and gadget setups.', icon: Monitor, prompt: 'High-tech, sleek hardware setup with professional studio lighting and clean depth of field.' },
  { title: 'Educational', desc: 'Clean, structured, and informative visual layouts.', icon: Stars, prompt: 'Informative, clean tutorial thumbnail with easy-to-read layout and clear focus on the subject.' },
];

const Home = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [rawHistory, setRawHistory] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);
  const [promptTools, setPromptTools] = useState(loadSavedTools);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [sizePreset, setSizePreset] = useState('youtube');
  const [lastFailedRequest, setLastFailedRequest] = useState(null);
  const [editorTarget, setEditorTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [expandedRefined, setExpandedRefined] = useState({});
  const [historyFilters, setHistoryFilters] = useState({});
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const previewDownloadRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  const resetTextareaHeight = useCallback(() => {
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, []);

  useEffect(() => {
    localStorage.setItem('pv-prompt-tools', JSON.stringify(promptTools));
  }, [promptTools]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 992;
      setIsMobile(mobile);
      setIsSidebarCollapsed(mobile);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user && shouldShowOnboarding()) setShowOnboarding(true);
  }, [user]);

  const fetchHistory = useCallback(async (filters = historyFilters) => {
    setHistoryLoading(true);
    try {
      const { data } = await api.get('/images/history', { params: filters });
      setRawHistory(data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setHistoryLoading(false);
    }
  }, [historyFilters]);

  useEffect(() => {
    if (user) fetchHistory();
    else {
      setMessages([]);
      setRawHistory([]);
      setIsSidebarCollapsed(true);
    }
  }, [user, fetchHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, generating]);

  useEffect(() => {
    if (!prompt) resetTextareaHeight();
  }, [prompt, resetTextareaHeight]);

  const handleFilterChange = useCallback((filters) => {
    setHistoryFilters(filters);
    if (user) {
      setHistoryLoading(true);
      api.get('/images/history', { params: filters })
        .then(({ data }) => setRawHistory(data))
        .catch(console.error)
        .finally(() => setHistoryLoading(false));
    }
  }, [user]);

  const appendGeneration = (data) => {
    const genId = data.generationId ? String(data.generationId) : null;
    setMessages((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i >= 0; i -= 1) {
        if (next[i].type === 'prompt') {
          next[i] = { ...next[i], refinedPrompt: data.refinedPrompt };
          break;
        }
      }
      next.push({
        type: 'image',
        content: data.imageUrl,
        prompt: data.userPrompt || data.refinedPrompt,
        refinedPrompt: data.refinedPrompt,
        id: genId,
        width: data.width,
        height: data.height,
        sizePreset: data.sizePreset,
        isFavorite: false,
      });
      return next;
    });
    if (!currentId) setCurrentId(data.conversationId);
    setLastFailedRequest(null);
    fetchHistory();
  };

  const runGenerate = async (payload, { skipPromptBubble = false } = {}) => {
    setGenerating(true);
    setError('');
    try {
      const { data } = await api.post('/images/generate', payload);
      if (data.success) {
        if (skipPromptBubble) {
          setMessages((prev) => [...prev, {
            type: 'image',
            content: data.imageUrl,
            prompt: payload.userPrompt || payload.prompt,
            refinedPrompt: data.refinedPrompt,
            id: data.generationId ? String(data.generationId) : null,
            width: data.width,
            height: data.height,
            sizePreset: data.sizePreset,
            isFavorite: false,
          }]);
          if (!currentId) setCurrentId(data.conversationId);
          setLastFailedRequest(null);
          fetchHistory();
        } else {
          appendGeneration(data);
        }
        return true;
      }
      setError('Failed to generate thumbnail.');
      return false;
    } catch (err) {
      setLastFailedRequest(payload);
      setError(err.response?.data?.message || 'Server error occurred.');
      return false;
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || generating) return;
    if (!user) { setIsModalOpen(true); return; }

    const refForMessage = referenceImage?.dataUrl ?? null;

    const displayPrompt = prompt.trim();

    setMessages((prev) => [...prev, { type: 'prompt', content: displayPrompt, referenceUrl: refForMessage }]);
    setPrompt('');
    resetTextareaHeight();

    const payload = {
      userPrompt: displayPrompt,
      promptTools,
      conversationId: currentId,
      referenceImage: referenceImage?.dataUrl,
      sizePreset,
    };
    setReferenceImage(null);

    await runGenerate(payload);
  };

  const handleRetry = () => {
    if (lastFailedRequest && !generating) runGenerate(lastFailedRequest, { skipPromptBubble: true });
  };

  const handleSelectWork = (item) => {
    setCurrentId(item._id);
    const threadMessages = [];
    item.generations.forEach((gen) => {
      threadMessages.push({
        type: 'prompt',
        content: gen.userPrompt || gen.prompt,
        refinedPrompt: gen.refinedPrompt || gen.prompt,
      });
      threadMessages.push({
        type: 'image',
        content: gen.imageUrl,
        prompt: gen.userPrompt || gen.prompt,
        refinedPrompt: gen.refinedPrompt || gen.prompt,
        id: gen._id ? String(gen._id) : null,
        width: gen.width,
        height: gen.height,
        isFavorite: gen.isFavorite,
        sizePreset: gen.sizePreset,
      });
    });
    setMessages(threadMessages);
    if (isMobile) setIsSidebarCollapsed(true);
  };

  const handleDeleteWork = async (id) => {
    try {
      await api.delete(`/images/threads/${id}`);
      setRawHistory((prev) => prev.filter((item) => item._id !== id));
      if (currentId === id) { setMessages([]); setCurrentId(null); }
    } catch (err) {
      setError('Could not delete creation. Try again later.');
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentId(null);
    setPrompt('');
    setReferenceImage(null);
    setLastFailedRequest(null);
    resetTextareaHeight();
    if (isMobile) setIsSidebarCollapsed(true);
  };

  const handleReferenceUpload = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please upload an image file (PNG, JPG, WebP).'); return; }
    if (file.size > MAX_REF_BYTES) { setError('Reference image must be under 5 MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => setReferenceImage({ name: file.name, dataUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const handleToggleFavorite = async (msg) => {
    const genId = msg.id ? String(msg.id) : null;
    if (!genId) {
      setError('Cannot favorite — thumbnail not saved yet. Try again after generation completes.');
      return;
    }
    try {
      const { data } = await api.patch(`/images/generations/${genId}/favorite`);
      setMessages((prev) => prev.map((m) => (
        m.type === 'image' && String(m.id) === genId ? { ...m, isFavorite: data.isFavorite } : m
      )));
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update favorite.');
    }
  };

  const handleEdit = async (instruction) => {
    if (!editTarget) return;
    setEditLoading(true);
    setError('');
    try {
      const { data } = await api.post('/images/edit', {
        sourceImage: editTarget.content,
        editInstruction: instruction,
        userPrompt: editTarget.prompt,
        parentGenerationId: editTarget.id,
        conversationId: currentId,
        sizePreset: editTarget.sizePreset || sizePreset,
      });
      if (data.success) {
        setMessages((prev) => [...prev, {
          type: 'prompt',
          content: `Edit: ${instruction}`,
          refinedPrompt: data.refinedPrompt,
        }, {
          type: 'image',
          content: data.imageUrl,
          prompt: editTarget.prompt,
          refinedPrompt: data.refinedPrompt,
          id: data.generationId ? String(data.generationId) : null,
          width: data.width,
          height: data.height,
          isFavorite: false,
        }]);
        setEditTarget(null);
        fetchHistory();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Edit failed.');
    } finally {
      setEditLoading(false);
    }
  };

  const downloadImage = (url, name = `thumb-${Date.now()}.png`) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useKeyboardShortcuts({
    previewOpen: Boolean(previewImage),
    onClosePreview: () => setPreviewImage(null),
    onDownloadPreview: () => previewDownloadRef.current?.(),
    canSend: Boolean(prompt.trim()) && !generating,
    onSend: handleSend,
  });

  const hasToolModifiers = promptTools.style !== 'default' || promptTools.mood || promptTools.textOverlay !== 'none';
  const sidebarWidth = isSidebarCollapsed ? '0px' : '280px';
  const dockLeft = user && !isSidebarCollapsed && !isMobile ? '280px' : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="page-bg studio-shell">
      <Navbar />
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ImagePreviewModal
        imageUrl={previewImage?.url}
        prompt={previewImage?.prompt}
        width={previewImage?.width}
        height={previewImage?.height}
        onClose={() => setPreviewImage(null)}
        onDownloadRef={previewDownloadRef}
      />
      {editorTarget && (
        <ThumbnailEditor imageUrl={editorTarget.content} initialPreset={editorTarget.sizePreset || sizePreset} onClose={() => setEditorTarget(null)} />
      )}
      <EditRegionModal open={Boolean(editTarget)} loading={editLoading} onClose={() => setEditTarget(null)} onSubmit={handleEdit} />
      {showOnboarding && <OnboardingTour onComplete={() => setShowOnboarding(false)} />}

      <div className="studio-body">
        {user && (
          <div className="sidebar-wrapper" style={{ width: sidebarWidth, transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)', overflow: 'hidden', flexShrink: 0, position: isMobile ? 'fixed' : 'relative', top: isMobile ? '68px' : 0, bottom: isMobile ? 0 : 0, left: 0, zIndex: 1000, height: isMobile ? 'calc(100dvh - 68px)' : 'auto' }}>
            <div style={{ width: '280px', height: '100%' }}>
              <Sidebar history={rawHistory} historyLoading={historyLoading} onNewChat={handleNewChat} onSelectWork={handleSelectWork} onDeleteWork={handleDeleteWork} currentId={currentId} isMobile={isMobile} onClose={() => setIsSidebarCollapsed(true)} onFilterChange={handleFilterChange} />
            </div>
          </div>
        )}

        {isMobile && !isSidebarCollapsed && <div className="sidebar-overlay" onClick={() => setIsSidebarCollapsed(true)} />}

        <div className="studio-workspace main-content-scroll">
          {user && (
            <button type="button" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="sidebar-toggle" style={{ position: 'fixed', left: isMobile ? 'var(--space-3)' : (isSidebarCollapsed ? 'var(--space-5)' : 'calc(280px + var(--space-5))'), top: '5.25rem', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isMobile && !isSidebarCollapsed ? 0 : 1, pointerEvents: isMobile && !isSidebarCollapsed ? 'none' : 'auto' }} aria-label={isSidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}>
              {isSidebarCollapsed ? <PanelLeftOpen size={ICON.lg} strokeWidth={STROKE} /> : <PanelLeftClose size={ICON.lg} strokeWidth={STROKE} />}
            </button>
          )}

          <div className="studio-content">
            {messages.length === 0 && !generating && (
              <div className="studio-hero fade-in" id="studio-hero">
                <span className="badge" style={{ marginBottom: 'var(--space-5)' }}><BrandLogo size={14} /> Thumbnail Studio</span>
                <h1 className="text-display text-gradient" style={{ marginBottom: 'var(--space-4)' }}>PromptVision Studio</h1>
                <p className="text-body" style={{ marginBottom: 'var(--space-10)' }}>Pick a creative pack or describe your vision — export for YouTube, Shorts, or Community.</p>
                <div className="studio-hero__grid">
                  {PACKS.map((pack) => {
                    const PackIcon = pack.icon;
                    return (
                      <button key={pack.title} type="button" onClick={() => setPrompt(pack.prompt)} className="card-interactive">
                        <div className="card-interactive__icon"><PackIcon size={ICON.xl} strokeWidth={STROKE} /></div>
                        <div>
                          <h3 className="text-h3" style={{ marginBottom: 'var(--space-1)', color: 'white' }}>{pack.title}</h3>
                          <p className="text-body-sm" style={{ color: '#666' }}>{pack.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="studio-thread">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} key={`${msg.type}-${msg.id || index}`}>
                    {msg.type === 'prompt' ? (
                      <PromptBubble msg={msg} isMobile={isMobile} showRefined={expandedRefined[index]} onToggleRefined={() => setExpandedRefined((p) => ({ ...p, [index]: !p[index] }))} />
                    ) : (
                      <GeneratedThumbnail
                        msg={msg}
                        isMobile={isMobile}
                        onPreview={() => setPreviewImage({ url: msg.content, prompt: msg.prompt, width: msg.width, height: msg.height })}
                        onDownload={() => downloadImage(msg.content)}
                        onReprompt={() => setPrompt(msg.prompt)}
                        onEdit={() => setEditTarget(msg)}
                        onEditor={() => setEditorTarget(msg)}
                        onFavorite={() => handleToggleFavorite(msg)}
                        onCopyRefined={() => navigator.clipboard.writeText(msg.refinedPrompt || msg.prompt)}
                      />
                    )}
                  </motion.div>
                ))}

                {generating && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="chat-row">
                    {!isMobile && <div className="chat-avatar"><Loader2 size={ICON.lg} strokeWidth={STROKE} className="animate-spin" color="white" /></div>}
                    <div className="premium-card" style={{ width: '100%', maxWidth: '720px' }}>
                      <div className="shimmer" style={{ width: '100%', aspectRatio: '16/9' }} />
                      <div style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(0,0,0,0.35)' }}>
                        <p className="text-body-sm gen-status"><Loader2 size={ICON.sm} strokeWidth={STROKE} className="animate-spin" /> Refining prompt & generating thumbnail…</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>

      <div className="studio-dock" style={{ left: dockLeft }}>
        <div className="studio-dock__inner">
          {error && (
            <div className="alert-error" style={{ marginBottom: 'var(--space-4)', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><Info size={ICON.sm} strokeWidth={STROKE} /> {error}</span>
              {lastFailedRequest && (
                <button type="button" className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px' }} onClick={handleRetry}>
                  <RotateCcw size={14} strokeWidth={STROKE} /> Retry
                </button>
              )}
            </div>
          )}

          <div className="chat-input-wrapper" id="studio-input">
            <div className="size-preset-row">
              <span className="size-preset-label">Format</span>
              <div className="size-preset-options">
                {Object.entries(SIZE_PRESETS).map(([key, p]) => (
                  <button
                    key={key}
                    type="button"
                    className={`size-preset-btn ${sizePreset === key ? 'size-preset-btn--active' : ''}`}
                    onClick={() => setSizePreset(key)}
                    title={`${p.width}×${p.height}`}
                  >
                    {p.label}
                    <span className="size-preset-btn__ratio">{p.ratio}</span>
                  </button>
                ))}
              </div>
            </div>

            {(referenceImage || hasToolModifiers) && (
              <div className="input-attachments">
                {referenceImage && (
                  <div className="reference-chip">
                    <img src={referenceImage.dataUrl} alt="" />
                    <span>{referenceImage.name}</span>
                    <button type="button" className="reference-chip__remove" onClick={() => setReferenceImage(null)} aria-label="Remove reference"><X size={12} strokeWidth={STROKE} /></button>
                  </div>
                )}
                {hasToolModifiers && <span className="tools-active-badge">Tools active</span>}
              </div>
            )}

            <textarea ref={textareaRef} className="chat-input" placeholder="Describe your next viral vision…" rows={1} value={prompt}
              onChange={(e) => { e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`; setPrompt(e.target.value); }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              style={{ maxHeight: '150px', fontSize: isMobile ? '0.9rem' : '1rem' }}
            />

            <div className="chat-input-toolbar">
              <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={handleReferenceUpload} />
                <button id="studio-upload" type="button" title="Upload reference image" className={`btn-icon ${referenceImage ? 'btn-icon--active' : ''}`} aria-label="Upload reference image" onClick={() => { if (!user) { setIsModalOpen(true); return; } fileInputRef.current?.click(); }}>
                  <ImageIcon size={19} strokeWidth={STROKE} />
                </button>
                <button id="studio-tools" type="button" title="Prompt tools" className={`btn-icon ${toolsOpen || hasToolModifiers ? 'btn-icon--active' : ''}`} aria-label="Prompt tools" aria-expanded={toolsOpen} onClick={() => setToolsOpen((o) => !o)}>
                  <SlidersHorizontal size={19} strokeWidth={STROKE} />
                </button>
              </div>
              <button type="button" onClick={handleSend} disabled={!prompt.trim() || generating} className={`send-btn ${prompt.trim() ? 'send-btn--active' : ''}`} aria-label="Send prompt">
                {generating ? <Loader2 size={ICON.md} strokeWidth={STROKE} className="animate-spin" /> : <Send size={ICON.md} strokeWidth={STROKE} />}
              </button>
            </div>
          </div>

          <PromptToolsPanel
            open={toolsOpen}
            onClose={() => setToolsOpen(false)}
            tools={promptTools}
            onChange={setPromptTools}
            onReset={() => setPromptTools(DEFAULT_TOOLS)}
          />
          <Footer compact />
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
