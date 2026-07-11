import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, X, Clock, MessageSquare, ChevronRight, Star } from 'lucide-react';

const STROKE = 2;

const Sidebar = ({
  history = [],
  historyLoading = false,
  onNewChat,
  onSelectWork,
  onDeleteWork,
  currentId,
  onClose,
  isMobile,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    const params = { q: searchTerm || undefined, favorites: view === 'favorites' ? 'true' : undefined };
    if (dateRange === 'week') {
      params.from = new Date(Date.now() - 7 * 86400000).toISOString();
    } else if (dateRange === 'month') {
      params.from = new Date(Date.now() - 30 * 86400000).toISOString();
    }
    onFilterChange?.(params);
  }, [searchTerm, view, dateRange, onFilterChange]);

  const filteredHistory = history.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return item.title?.toLowerCase().includes(term) ||
      item.generations?.some((g) =>
        g.userPrompt?.toLowerCase().includes(term) ||
        g.refinedPrompt?.toLowerCase().includes(term) ||
        g.prompt?.toLowerCase().includes(term)
      );
  });

  return (
    <div className="sidebar-panel">
      {isMobile && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 'var(--space-3)' }}>
          <button type="button" onClick={onClose} className="btn-icon btn-icon--ghost" aria-label="Close">
            <X size={18} strokeWidth={STROKE} />
          </button>
        </div>
      )}

      <div style={{ padding: 'var(--space-4)' }}>
        <div className="glass search-glass" style={{ display: 'flex', alignItems: 'center', padding: '2px var(--space-3)', gap: 'var(--space-2)' }}>
          <Search size={15} strokeWidth={STROKE} color="#666" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '0.85rem', padding: 'var(--space-3) 0', outline: 'none' }}
          />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm('')} className="btn-icon" style={{ padding: 4 }}>
              <X size={14} strokeWidth={STROKE} />
            </button>
          )}
        </div>
      </div>

      <div className="sidebar-filters">
        <button type="button" className={`sidebar-filter-tab ${view === 'all' ? 'sidebar-filter-tab--active' : ''}`} onClick={() => setView('all')}>All</button>
        <button type="button" className={`sidebar-filter-tab ${view === 'favorites' ? 'sidebar-filter-tab--active' : ''}`} onClick={() => setView('favorites')}>
          <Star size={12} strokeWidth={STROKE} /> Favorites
        </button>
      </div>

      <div className="sidebar-date-filters">
        {['all', 'week', 'month'].map((r) => (
          <button key={r} type="button" className={`prompt-tools-pill ${dateRange === r ? 'prompt-tools-pill--active' : ''}`} style={{ fontSize: '0.68rem', padding: '4px 10px' }} onClick={() => setDateRange(r)}>
            {r === 'all' ? 'All time' : r === 'week' ? '7 days' : '30 days'}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 var(--space-4) var(--space-4)' }}>
        <button type="button" onClick={onNewChat} className="sidebar-new-btn">
          <span className="sidebar-new-btn__icon"><Plus size={18} strokeWidth={2.5} /></span>
          New Thumbnail
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--space-3)' }}>
        <p className="text-caption" style={{ padding: 'var(--space-4) var(--space-2) var(--space-2)' }}>
          {view === 'favorites' ? 'Starred' : 'Recent'} {searchTerm && <span className="text-accent">({filteredHistory.length})</span>}
        </p>

        {historyLoading ? (
          <div className="sidebar-skeleton">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="sidebar-skeleton__row shimmer" />
            ))}
          </div>
        ) : filteredHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-4)', color: '#444' }}>
            <div style={{ width: 56, height: 56, margin: '0 auto var(--space-4)', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center' }}>
              <Clock size={24} strokeWidth={STROKE} color="#333" />
            </div>
            <p className="text-body-sm">{view === 'favorites' ? 'No favorites yet' : 'Your creations will appear here'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {filteredHistory.map((item) => {
              const isActive = currentId === item._id;
              const thumb = item.generations?.[item.generations.length - 1];
              const hasFavorite = item.generations?.some((g) => g.isFavorite);
              return (
                <div key={item._id} className="sidebar-history-item" style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => onSelectWork(item)}
                    style={{
                      width: '100%',
                      padding: 'var(--space-3)',
                      paddingRight: 44,
                      background: isActive ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
                      border: isActive ? '1px solid rgba(255, 0, 0, 0.25)' : '1px solid transparent',
                      borderRadius: 'var(--radius-md)',
                      color: isActive ? 'white' : '#999',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ width: 44, height: 28, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#222', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {thumb ? (
                        <img src={thumb.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                          <MessageSquare size={12} strokeWidth={STROKE} />
                        </div>
                      )}
                    </div>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: isActive ? 600 : 400, fontSize: '0.85rem' }}>
                      {hasFavorite && <Star size={10} fill="currentColor" className="text-accent" style={{ display: 'inline', marginRight: 4 }} />}
                      {item.title}
                    </span>
                    {isActive && <ChevronRight size={14} strokeWidth={2.5} className="text-accent" />}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this thread?')) onDeleteWork(item._id);
                    }}
                    className="trash-btn btn-icon"
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
                    aria-label="Delete"
                  >
                    <Trash2 size={14} strokeWidth={STROKE} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ padding: 'var(--space-4)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="badge" style={{ width: 'fit-content' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0f0', boxShadow: '0 0 8px #0f0' }} />
          Engine Online
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
