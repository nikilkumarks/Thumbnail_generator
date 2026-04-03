import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import LoginModal from '../components/LoginModal';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { Send, Loader2, Download, Image as ImageIcon, Sparkles, Wand2, Video, Gamepad2, Monitor, Camera, Tv, ChevronLeft, Menu, Stars, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [rawHistory, setRawHistory] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setMessages([]);
      setRawHistory([]);
      setIsSidebarCollapsed(false);
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, generating]);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/images/history');
      setRawHistory(data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const handleSelectWork = (item) => {
    setCurrentId(item._id);
    const threadMessages = [];
    item.generations.forEach(gen => {
      threadMessages.push({ type: 'prompt', content: gen.prompt });
      threadMessages.push({ type: 'image', content: gen.imageUrl, prompt: gen.prompt, id: gen._id });
    });
    setMessages(threadMessages);
  };

  const handleDeleteWork = async (id) => {
    try {
      await api.delete(`/images/${id}`);
      setRawHistory(prev => prev.filter(item => item._id !== id));
      if (currentId === id) {
        setMessages([]);
        setCurrentId(null);
      }
    } catch (err) {
      console.error('Delete failed', err);
      setError('Could not delete creation. Try again later.');
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentId(null);
    setPrompt('');
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || generating) return;

    if (!user) {
      setIsModalOpen(true);
      return;
    }

    const currentPrompt = prompt;
    const activeConvoId = currentId;

    setMessages(prev => [...prev, { type: 'prompt', content: currentPrompt }]);
    setPrompt('');
    setGenerating(true);
    setError('');

    try {
      const { data } = await api.post('/images/generate', {
        prompt: currentPrompt,
        conversationId: activeConvoId
      });

      if (data.success) {
        const newMessage = { type: 'image', content: data.imageUrl, prompt: currentPrompt, id: Date.now() };
        setMessages(prev => [...prev, newMessage]);
        if (!activeConvoId) setCurrentId(data.conversationId);
        fetchHistory();
      } else {
        setError('Failed to generate thumbnail.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error occurred.');
    } finally {
      setGenerating(false);
    }
  };

  const chips = [
    { label: 'E-commerce Sale', icon: <Stars size={14} color="#FFD700" /> },
    { label: 'Gaming Highlights', icon: <Gamepad2 size={14} /> },
    { label: 'Travel Vlog', icon: <Camera size={14} /> },
    { label: 'Unboxing Video', icon: <Tv size={14} /> },
  ];

  const sidebarWidth = isSidebarCollapsed ? '0px' : '260px';

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.4 }}
      style={{ height: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--youtube-black)', color: 'white' }}
    >
      <Navbar />

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {user && (
          <div
            className="sidebar-wrapper"
            style={{
              width: sidebarWidth,
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              flexShrink: 0,
              backgroundColor: '#0A0A0A',
              borderRight: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <Sidebar history={rawHistory} onNewChat={handleNewChat} onSelectWork={handleSelectWork} onDeleteWork={handleDeleteWork} currentId={currentId} />
          </div>
        )}

        {/* 🎨 PromptVision Immersive Workspace */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          position: 'relative',
          background: 'linear-gradient(rgba(10, 10, 10, 0.92), rgba(10, 10, 10, 0.92)), url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }} className="main-content-scroll">
          {user && (
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="sidebar-toggle"
              style={{
                position: 'absolute',
                left: '1.25rem',
                top: '1.25rem',
                zIndex: 50,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '8px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isSidebarCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}

          <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
            {messages.length === 0 && !generating && (
              <div style={{ marginTop: '8vh', padding: '0 1rem' }} className="fade-in">
                <div style={{ marginBottom: '4rem' }}>
                  <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-1.5px', color: 'white' }}>PromptVision Studio</h1>
                  <p style={{ color: '#555', fontSize: '1.2rem', fontWeight: '600', letterSpacing: '0.5px' }}>CHOOSE YOUR CREATIVE ENGINE TO START</p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.5rem',
                  marginTop: '2rem'
                }}>
                  {[
                    { title: 'Gamer Pack', desc: 'High-contrast, action-packed gaming visual previews.', icon: <Gamepad2 size={24} />, prompt: 'High-intensity, cinematic gaming action scene with glowing effects and bold highlights.' },
                    { title: 'Lifestyle Vlog', desc: 'Natural, airy, and inviting travel or lifestyle themes.', icon: <Camera size={24} />, prompt: 'Minimalist, bright, and vibrant travel vlog thumbnail with natural lighting and soft focus.' },
                    { title: 'Tech Review', desc: 'Sharp, precision-focused hardware and gadget setups.', icon: <Monitor size={24} />, prompt: 'High-tech, sleek hardware setup with professional studio lighting and clean depth of field.' },
                    { title: 'Educational', desc: 'Clean, structured, and informative visual layouts.', icon: <Stars size={24} />, prompt: 'Informative, clean tutorial thumbnail with easy-to-read layout and clear focus on the subject.' }
                  ].map((pack, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(pack.prompt)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'left',
                        padding: '1.5rem',
                        background: '#0F0F0F',
                        border: '1px solid #222',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        gap: '1rem'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.background = '#151515'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.background = '#0F0F0F'; }}
                    >
                      <div style={{ color: 'var(--youtube-red)' }}>{pack.icon}</div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.25rem', color: 'white' }}>{pack.title}</h3>
                        <p style={{ fontSize: '0.85rem', color: '#555', fontWeight: '500', lineHeight: '1.5' }}>{pack.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '12rem', marginTop: '2rem' }}>
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={index}
                  >
                    {msg.type === 'prompt' ? (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                        <div style={{ background: '#1F1F1F', border: '1px solid #333', padding: '1rem 1.4rem', borderRadius: '20px 20px 4px 20px', maxWidth: '85%', color: '#DDD' }}>
                          <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>{msg.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                        <div style={{ width: '36px', height: '36px', background: 'var(--youtube-red)', borderRadius: '8px', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: '4px' }}>
                          <Sparkles size={18} color="white" fill="currentColor" strokeWidth={0} />
                        </div>
                        <div className="premium-card" style={{ overflow: 'hidden', width: '100%', maxWidth: '720px' }}>
                          <img src={msg.content} alt="Generated" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
                          <div style={{ padding: '1rem 1.25rem', background: '#0F0F0F', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #222' }}>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                              <button className="btn-primary" style={{ height: '38px', padding: '0 1.25rem', fontSize: '0.8125rem', borderRadius: '6px' }} onClick={() => {
                                const link = document.createElement('a');
                                link.href = msg.content;
                                link.download = `thumb-${Date.now()}.png`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}>
                                <Download size={14} /> DOWNLOAD HD
                              </button>
                              <button onClick={() => setPrompt(`${msg.prompt}`)} style={{ background: 'transparent', border: '1px solid #333', borderRadius: '6px', padding: '0 1.25rem', fontSize: '0.8125rem', height: '38px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Wand2 size={14} /> RE-PROMPT
                              </button>
                            </div>
                            <div style={{ color: '#444', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '1px' }}>1280 × 720 • PNG</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {generating && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', background: 'var(--youtube-red)', borderRadius: '8px', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: '4px' }}>
                      <Sparkles size={18} className="animate-spin" color="white" />
                    </div>
                    <div className="premium-card" style={{ width: '100%', maxWidth: '720px', overflow: 'hidden' }}>
                      <div className="shimmer" style={{ width: '100%', aspectRatio: '16/9' }}></div>
                      <div style={{ padding: '1.5rem', textAlign: 'center', background: '#0F0F0F' }}>
                        <p style={{ color: '#555', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                          Developing masterpiece...
                        </p>
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

      <div style={{ position: 'fixed', bottom: 0, left: user && !isSidebarCollapsed ? '260px' : 0, right: 0, padding: '2.5rem 1.5rem', background: 'linear-gradient(transparent, var(--youtube-black) 40%)', zIndex: 10, transition: 'all 0.4s ease-in-out' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          {error && <div style={{ marginBottom: '1rem', background: 'rgba(255,0,0,0.1)', color: '#FF4C4C', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={14} /> {error}
          </div>}

          <div className="chat-input-wrapper" style={{
            background: '#1A1A1A',
            borderRadius: '12px',
            border: '1px solid #222',
            padding: '12px 14px',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }} id="studio-input">
            <textarea
              className="chat-input"
              placeholder="Describe your next viral vision..."
              rows={1}
              value={prompt}
              onChange={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
                setPrompt(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '500',
                resize: 'none',
                outline: 'none',
                padding: '4px 0',
                maxHeight: '200px',
                lineHeight: '1.5'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  title="Upload Asset"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '8px',
                    color: '#444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#444'; }}
                >
                  <ImageIcon size={19} />
                </button>
                <button
                  title="Prompt Tools"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '8px',
                    color: '#444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#444'; }}
                >
                  <Menu size={19} />
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={!prompt.trim() || generating}
                style={{
                  background: prompt.trim() ? 'var(--youtube-red)' : '#262626',
                  color: 'white',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  display: 'grid',
                  placeItems: 'center',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: prompt.trim() ? 'pointer' : 'default',
                  border: 'none'
                }}
                className="send-btn"
              >
                {generating ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} fill={prompt.trim() ? "currentColor" : "none"} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
             <Footer />
          </div>
        </div>
      </div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        #studio-input:focus-within { border-color: #444 !important; background: #1F1F1F !important; }
        .send-btn:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.1); }
        .chat-input::placeholder { color: #555; }
      `}</style>
    </motion.div>
  );
};

export default Home;
