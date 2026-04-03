import React, { useState } from 'react';
import { History, Plus, Image as ImageIcon, Trash2, Search, X, Clock, MessageSquare, ChevronRight } from 'lucide-react';

const Sidebar = ({ history = [], onNewChat, onSelectWork, onDeleteWork, currentId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.generations?.[0]?.prompt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      width: '260px',
      height: '100dvh',
      backgroundColor: '#0A0A0A',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      zIndex: 100,
      position: 'relative'
    }}>
      {/* Premium Search Container */}
      <div style={{ padding: '1.25rem 0.75rem 0.75rem' }}>
        <div style={{ 
          position: 'relative', 
          background: 'rgba(255, 255, 255, 0.03)', 
          borderRadius: '12px', 
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          padding: '2px 10px',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }} className="search-glass">
          <Search size={14} color="#666" />
          <input 
            type="text"
            placeholder="Search creations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '10px 8px',
              color: 'white',
              fontSize: '0.8125rem',
              width: '100%',
              outline: 'none',
              fontWeight: '500'
            }}
          />
          {searchTerm && <X size={14} color="#666" onClick={() => setSearchTerm('')} style={{ cursor: 'pointer' }} />}
        </div>
      </div>

      <div style={{ padding: '0.25rem 0.75rem 1rem' }}>
        <button 
          onClick={onNewChat}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(rgba(255, 255, 255, 0.05), transparent)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.3s ease'
          }}
          className="sidebar-new-btn"
        >
          <div style={{ 
            width: '28px', 
            height: '28px', 
            background: 'var(--youtube-red)', 
            borderRadius: '8px', 
            display: 'grid', 
            placeItems: 'center',
            boxShadow: '0 4px 10px rgba(255,0,0,0.2)'
          }}>
            <Plus size={16} strokeWidth={3} />
          </div>
          New Generation
        </button>
      </div>

      {/* History List - Scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0.5rem 1rem' }} className="history-scroll">
        <div style={{ 
          padding: '1.5rem 0.75rem 0.75rem', 
          fontSize: '0.6875rem', 
          fontWeight: '800', 
          textTransform: 'uppercase', 
          color: '#555',
          letterSpacing: '1.5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>History Threads</span>
          {searchTerm && <span style={{ color: 'var(--youtube-red)', fontVariantNumeric: 'tabular-nums' }}>{filteredHistory.length}</span>}
        </div>

        {filteredHistory.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#333', fontSize: '0.8125rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid rgba(255,255,255,0.03)' }}>
               <Clock size={24} color="#222" />
            </div>
            <p style={{ fontWeight: '500' }}>No creative history yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {filteredHistory.map((item) => {
              const isActive = currentId === item._id;
              return (
                <div key={item._id} className="sidebar-history-item" style={{ position: 'relative', display: 'flex', alignItems: 'center', group: 'true' }}>
                  <button
                    onClick={() => onSelectWork(item)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      paddingRight: '45px',
                      background: isActive ? 'rgba(255, 0, 0, 0.08)' : 'transparent',
                      border: isActive ? '1px solid rgba(255, 0, 0, 0.15)' : '1px solid transparent',
                      borderRadius: '12px',
                      color: isActive ? 'white' : '#999',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '0.875rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ 
                      width: '42px', 
                      height: '26px', 
                      borderRadius: '6px', 
                      overflow: 'hidden', 
                      flexShrink: 0,
                      background: '#1A1A1A',
                      border: '1px solid rgba(255,255,255,0.05)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                    }}>
                      {item.generations?.[0] ? (
                        <img src={item.generations[item.generations.length-1].imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}><MessageSquare size={12} /></div>
                      )}
                    </div>
                    
                    <span style={{ 
                      flex: 1, 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      fontWeight: isActive ? '700' : '500',
                      letterSpacing: '-0.1px'
                    }}>
                      {item.title}
                    </span>
                    
                    {isActive && <ChevronRight size={14} color="var(--youtube-red)" strokeWidth={3} />}
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this masterpiece thread? This cannot be undone.")) {
                        onDeleteWork(item._id);
                      }
                    }}
                    className="trash-btn"
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(4px)',
                      border: 'none',
                      color: '#444',
                      cursor: 'pointer',
                      zIndex: 2,
                      padding: '6px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Persistent Visual Footer */}
      <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#070707' }}>
         <div style={{ 
           display: 'flex', 
           alignItems: 'center', 
           gap: '12px', 
           color: 'var(--text-muted)', 
           fontSize: '0.75rem',
           fontWeight: '600'
         }}>
            <div style={{ width: '8px', height: '8px', background: '#FF0000', borderRadius: '50%' }}></div>
            Studio Live (Flux Engine)
         </div>
      </div>

      <style>{`
        .sidebar-history-item .trash-btn { opacity: 0; }
        .sidebar-history-item:hover .trash-btn { opacity: 1; }
        .sidebar-history-item:hover button:not(.trash-btn) { background: rgba(255,255,255,0.03); color: white; }
        .trash-btn:hover { color: #FF4C4C !important; background: rgba(255,0,0,0.15) !important; }
        .sidebar-new-btn:hover { border-color: rgba(255,0,0,0.3); background-color: rgba(255,255,255,0.01); }
        .search-glass:focus-within { border-color: rgba(255,0,0,0.3) !important; background: rgba(255,255,255,0.05) !important; }
      `}</style>
    </div>
  );
};

export default Sidebar;
