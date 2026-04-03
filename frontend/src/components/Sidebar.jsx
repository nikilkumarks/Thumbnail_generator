import React, { useState } from 'react';
import { History, Plus, Image as ImageIcon, Trash2, Search, X, Clock, MessageSquare } from 'lucide-react';

const Sidebar = ({ history = [], onNewChat, onSelectWork, onDeleteWork, currentId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.generations?.[0]?.prompt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      backgroundColor: '#0F0F0F',
      borderRight: '1px solid #2A2A2A',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      zIndex: 100,
      position: 'relative'
    }}>
      {/* Search Input Section */}
      <div style={{ padding: '1rem 0.75rem 0.5rem' }}>
        <div style={{ 
          position: 'relative', 
          background: '#1A1A1A', 
          borderRadius: '8px', 
          border: '1px solid #2A2A2A',
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px'
        }}>
          <Search size={16} color="#666" />
          <input 
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px 10px',
              color: 'white',
              fontSize: '0.85rem',
              width: '100%',
              outline: 'none'
            }}
          />
          {searchTerm && <X size={14} color="#666" onClick={() => setSearchTerm('')} style={{ cursor: 'pointer' }} />}
        </div>
      </div>

      <div style={{ padding: '0.5rem 0.75rem' }}>
        <button 
          onClick={onNewChat}
          style={{
            width: '100%',
            padding: '0.8rem 1rem',
            background: 'transparent',
            border: '1px dashed #3F3F3F',
            borderRadius: '12px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          className="sidebar-new-btn"
        >
          <div style={{ width: '24px', height: '24px', background: 'var(--youtube-red)', borderRadius: '6px', display: 'grid', placeItems: 'center' }}>
            <Plus size={16} />
          </div>
          New Creation
        </button>
      </div>

      {/* History List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0.5rem 1rem' }}>
        <div style={{ 
          padding: '1.25rem 0.5rem 0.5rem', 
          fontSize: '0.75rem', 
          fontWeight: '700', 
          textTransform: 'uppercase', 
          color: 'var(--text-muted)',
          letterSpacing: '0.5px'
        }}>
          Recent Threads
        </div>

        {filteredHistory.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#555', fontSize: '0.875rem' }}>
            <Clock size={32} style={{ marginBottom: '0.5rem', opacity: 0.5, margin: '0 auto' }} />
            <p>{searchTerm ? 'No threads found' : 'Start your first thread.'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {filteredHistory.map((item) => (
              <div key={item._id} className="sidebar-history-item" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => onSelectWork(item)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    paddingRight: '40px',
                    background: currentId === item._id ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: 'none',
                    borderRadius: '10px',
                    color: currentId === item._id ? 'white' : '#AAAAAA',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ 
                    width: '40px', 
                    height: '24px', 
                    borderRadius: '4px', 
                    overflow: 'hidden', 
                    flexShrink: 0,
                    background: '#1A1A1A',
                    border: '1px solid #333'
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
                    textOverflow: 'ellipsis'
                  }}>
                    {item.title}
                  </span>
                </button>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Delete this entire chat thread?")) {
                      onDeleteWork(item._id);
                    }
                  }}
                  className="trash-btn"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'transparent',
                    border: 'none',
                    color: '#444',
                    cursor: 'pointer',
                    zIndex: 2,
                    padding: '4px',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid #333', background: '#090909' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <div style={{ width: '8px', height: '8px', background: '#19c37d', borderRadius: '50%' }}></div>
            Conversational Mode Active
         </div>
      </div>

      <style>{`
        .sidebar-history-item .trash-btn { opacity: 0; }
        .sidebar-history-item:hover .trash-btn { opacity: 1; }
        .trash-btn:hover { color: #FF4C4C !important; background: rgba(255,0,0,0.1) !important; border-radius: 4px; }
        .sidebar-new-btn:hover { background: rgba(255,255,255,0.05) !important; border-color: #FF0000 !important; }
      `}</style>
    </div>
  );
};

export default Sidebar;
