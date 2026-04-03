import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import LoginModal from '../components/LoginModal';
import { Send, Loader2, Download, Image as ImageIcon, Sparkles, Wand2, Play, Layout, Camera, Monitor, Gamepad2, Tv, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from '../components/Sidebar';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

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

  // Fetch history on user login
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
    setMessages([
      { type: 'prompt', content: item.prompt },
      { type: 'image', content: item.imageUrl, prompt: item.prompt }
    ]);
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
    setMessages(prev => [...prev, { type: 'prompt', content: currentPrompt }]);
    setPrompt('');
    setGenerating(true);
    setError('');

    try {
      const { data } = await api.post('/images/generate', { prompt: currentPrompt });
      if (data.success) {
        const newMessage = { type: 'image', content: data.imageUrl, prompt: currentPrompt };
        setMessages(prev => [...prev, newMessage]);
        fetchHistory();
      } else {
        setError('Failed up generate thumbnail. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error occurred.');
    } finally {
      setGenerating(false);
    }
  };

  const chips = [
    { label: 'Gaming Highlights', icon: <Gamepad2 size={14} /> },
    { label: 'Cooking Tutorial', icon: <Monitor size={14} /> },
    { label: 'Travel Vlog', icon: <Camera size={14} /> },
    { label: 'Reaction Video', icon: <Tv size={14} /> },
  ];

  const sidebarWidth = isSidebarCollapsed ? '0px' : '260px';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--youtube-black)', color: 'white' }}>
      <Navbar />
      
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar - Logged in only */}
        {user && (
          <div 
            className="sidebar-wrapper"
            style={{ 
              width: sidebarWidth, 
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
              overflow: 'hidden',
              flexShrink: 0,
              backgroundColor: '#0F0F0F'
            }}
          >
            <Sidebar 
              history={rawHistory} 
              onNewChat={handleNewChat} 
              onSelectWork={handleSelectWork}
              onDeleteWork={handleDeleteWork}
              currentId={currentId}
            />
          </div>
        )}

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', position: 'relative' }}>
          {/* Collapse Toggle Handle */}
          {user && (
            <button
               onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
               className="sidebar-toggle"
               style={{
                 position: 'absolute',
                 left: '1rem',
                 top: '1rem',
                 zIndex: 50,
                 background: '#2A2A2A',
                 border: 'none',
                 borderRadius: '8px',
                 padding: '8px',
                 color: 'white',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 cursor: 'pointer'
               }}
            >
              {isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
            </button>
          )}

          <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            {messages.length === 0 && !generating && (
              <div style={{ textAlign: 'center', marginTop: '12vh' }} className="fade-in">
                <div style={{ color: 'var(--youtube-red)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                  <Video size={64} fill="currentColor" strokeWidth={0} />
                </div>
                <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-1px' }}>What thumbnail can we dream up?</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>Create, edit, and explore thumbnails optimized for CTR.</p>
                
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                  {chips.map((chip, i) => (
                    <button 
                      key={i}
                      onClick={() => setPrompt(chip.label)}
                      className="btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}
                    >
                      {chip.icon} {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '10rem' }}>
              {messages.map((msg, index) => (
                <div key={index}>
                  {msg.type === 'prompt' ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{ background: '#212121', padding: '0.8rem 1.2rem', borderRadius: '18px 18px 2px 18px', maxWidth: '80%', color: 'white' }}>
                        <p style={{ fontSize: '1rem', fontWeight: '400' }}>{msg.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '32px', height: '32px', background: 'var(--youtube-red)', borderRadius: '4px', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                         <Sparkles size={16} color="white" />
                      </div>
                      <div className="premium-card" style={{ padding: '1rem', borderRadius: '12px', width: '100%', maxWidth: '640px' }}>
                        <img 
                          src={msg.content} 
                          alt="Generated" 
                          style={{ width: '100%', borderRadius: '4px', aspectRadio: '16/9', objectFit: 'cover' }} 
                        />
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                          <button 
                            className="btn-primary"
                            style={{ borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = msg.content;
                              link.download = `thumbnail-${Date.now()}.png`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            <Download size={14} /> Download
                          </button>
                          <button 
                             onClick={() => setPrompt(`Update this design: ${msg.prompt}`)}
                             style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'white' }}
                          >
                            <Wand2 size={14} /> Re-prompt
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {generating && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                   <div style={{ width: '32px', height: '32px', background: 'var(--youtube-red)', borderRadius: '4px', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <Sparkles size={16} color="white" />
                   </div>
                   <div className="premium-card" style={{ padding: '3rem', borderRadius: '12px', width: '100%', maxWidth: '640px', textAlign: 'center', color: 'var(--text-muted)' }}>
                     <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: 'var(--youtube-red)' }} />
                     Generatig your visual masterpiece...
                   </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Input Overlay */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: user ? sidebarWidth : 0, 
        right: 0, 
        padding: '2.5rem 1rem', 
        background: 'linear-gradient(transparent, var(--youtube-black) 25%)',
        zIndex: 10,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }} className="input-container-float">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {error && (
            <div style={{ marginBottom: '1rem', background: 'rgba(255,0,0,0.1)', color: 'var(--youtube-red)', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          
          <div className="chat-input-wrapper">
            <textarea 
               className="chat-input"
               placeholder="Describe your YouTube thumbnail vision..."
               rows={1}
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               onKeyDown={(e) => {
                 if (e.key === 'Enter' && !e.shiftKey) {
                   e.preventDefault();
                   handleSend();
                 }
               }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
               <button style={{ color: 'var(--text-muted)' }}><ImageIcon size={20} /></button>
               <button 
                  onClick={handleSend}
                  disabled={!prompt.trim() || generating}
                  style={{ 
                    background: prompt.trim() ? 'var(--youtube-red)' : '#2A2A2A', 
                    color: 'white', 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '8px',
                    display: 'grid',
                    placeItems: 'center'
                  }}
               >
                 <Send size={18} />
               </button>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.8rem' }}>
            {user ? `Logged in to AI Studio` : 'Sign in to generate high-quality thumbnails'}
          </p>
        </div>
      </div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .sidebar-toggle:hover { background: #333 !important; }

        @media (max-width: 768px) {
          .sidebar-wrapper { position: fixed; height: 100vh; left: 0; top: 0; z-index: 1000; }
          .input-container-float { left: 0 !important; }
          .sidebar-toggle { display: none !important; }
        }
      `}</style>
    </div>
  );
};


export default Home;
