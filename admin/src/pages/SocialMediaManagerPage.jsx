import React, { useState, useEffect } from 'react';

/**
 * Social Media Manager Page (Under Dynamic Showcase -> Social Media Reels):
 */

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

const iStyle = { 
  width: '100%', 
  padding: '8px 12px', 
  borderRadius: '8px', 
  backgroundColor: '#182012', 
  border: '1px solid rgba(184,147,91,0.5)', 
  color: '#F6F1E3', 
  fontSize: '12px', 
  outline: 'none', 
  boxSizing: 'border-box' 
};

const lStyle = { 
  fontSize: '10px', 
  fontWeight: '700', 
  color: '#B8935B', 
  letterSpacing: '0.8px', 
  textTransform: 'uppercase', 
  display: 'block', 
  marginBottom: '4px' 
};

const cardStyle = { 
  backgroundColor: '#222C1A', 
  borderRadius: '14px', 
  padding: '22px', 
  border: '1px solid rgba(184,147,91,0.25)' 
};

const btnP = { 
  padding: '9px 18px', 
  borderRadius: '8px', 
  backgroundColor: '#B8935B', 
  border: 'none', 
  color: '#1A2010', 
  fontSize: '13px', 
  fontWeight: '700', 
  cursor: 'pointer' 
};

const btnG = { 
  padding: '7px 14px', 
  borderRadius: '6px', 
  backgroundColor: '#3E4930', 
  border: '1px solid #B8935B', 
  color: '#F6F1E3', 
  fontSize: '12px', 
  cursor: 'pointer' 
};

const btnD = { 
  padding: '7px 12px', 
  borderRadius: '6px', 
  backgroundColor: 'rgba(239,68,68,0.15)', 
  border: '1px solid rgba(239,68,68,0.35)', 
  color: '#EF4444', 
  fontSize: '12px', 
  cursor: 'pointer', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '5px' 
};

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DEFAULT_REELS = [];

const SocialMediaManagerPage = () => {
  const [globalSettings, setGlobalSettings] = useState({
    title: '@Laila.Hijabs',
    subtitle: 'Follow us on Instagram',
    is_enabled: 'true'
  });

  const [cards, setCards] = useState(DEFAULT_REELS);
  const [savingSettings, setSavingSettings] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editCard, setEditCard] = useState(null);
  const [cardForm, setCardForm] = useState({
    title: '',
    subtitle: 'Watch Video',
    videoUrl: '',
    instagramLink: '',
    status: 'Active'
  });

  const fetchSettings = () => {
    fetch(`${API}/sections/home_social_media`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          let meta = {};
          try { meta = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : (data.metadata || {}); } catch(e) {}

          setGlobalSettings({
            title: data.title || '@Laila.Hijabs',
            subtitle: data.subtitle || 'Follow us on Instagram',
            is_enabled: meta.is_enabled || 'true'
          });

          if (Array.isArray(meta.cards) && meta.cards.length > 0) {
            setCards(meta.cards);
          }
        }
      })
      .catch(err => console.error("Error fetching social media settings:", err));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const openAddCard = () => {
    setEditCard(null);
    setCardForm({
      title: '',
      subtitle: 'Watch Video',
      videoUrl: '',
      instagramLink: '',
      status: 'Active'
    });
    setShowModal(true);
  };

  const openEditCard = (card) => {
    setEditCard(card);
    setCardForm({
      title: card.title || '',
      subtitle: card.subtitle || 'Watch Video',
      videoUrl: card.videoUrl || '',
      instagramLink: card.instagramLink || '',
      status: card.status || 'Active'
    });
    setShowModal(true);
  };

  const handleSaveModalCard = (e) => {
    e.preventDefault();
    if (editCard) {
      setCards(prev => prev.map(c => c.key === editCard.key ? { ...c, ...cardForm } : c));
    } else {
      const key = `reel_${Date.now()}`;
      setCards(prev => [...prev, { key, ...cardForm }]);
    }
    setShowModal(false);
  };

  const handleSaveAllSettings = () => {
    setSavingSettings(true);

    const fieldStatuses = {};
    cards.forEach(c => {
      fieldStatuses[c.key] = c.status;
    });

    const metaData = {
      is_enabled: globalSettings.is_enabled,
      cards: cards,
      field_statuses: fieldStatuses
    };

    fetch(`${API}/sections/home_social_media`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: globalSettings.title,
        subtitle: globalSettings.subtitle,
        metadata: JSON.stringify(metaData)
      })
    })
      .then(res => res.json())
      .then(() => {
        alert("Social Media settings saved successfully!");
        fetchSettings();
      })
      .catch(err => console.error("Error saving:", err))
      .finally(() => setSavingSettings(false));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '50px' }}>
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div style={{ 
        background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', 
        borderRadius: '16px', 
        padding: '24px 28px', 
        border: '1px solid #B8935B', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '12px' 
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '5px' }}>
            DYNAMIC SHOWCASE
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#F6F1E3' }}>
            Social Media Reels Manager
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Manage the Instagram reels/videos displayed on the homepage.
          </p>
        </div>
        <button onClick={handleSaveAllSettings} disabled={savingSettings} style={{ ...btnP, boxShadow: '0 4px 14px rgba(184,147,91,0.4)' }}>
          {savingSettings ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* ── Section Header Settings ──────────────────────────────────────────── */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#F6F1E3' }}>Section Settings</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={lStyle}>Section Title</label>
            <input 
              value={globalSettings.title} 
              onChange={e => setGlobalSettings(s => ({ ...s, title: e.target.value }))} 
              style={iStyle} 
              placeholder="@Laila.Hijabs" 
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={lStyle}>Section Subtitle</label>
            <input 
              value={globalSettings.subtitle} 
              onChange={e => setGlobalSettings(s => ({ ...s, subtitle: e.target.value }))} 
              style={iStyle} 
              placeholder="Follow us on Instagram" 
            />
          </div>
          <div style={{ width: '180px' }}>
            <label style={lStyle}>Visibility</label>
            <select 
              value={globalSettings.is_enabled} 
              onChange={e => setGlobalSettings(s => ({ ...s, is_enabled: e.target.value }))} 
              style={iStyle}
            >
              <option value="true">Active (Show Section)</option>
              <option value="false">Disabled (Hide Section)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Reel Cards List ────────────────────────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', color: '#F6F1E3' }}>Instagram Reels ({cards.length})</h3>
          <button onClick={openAddCard} style={btnP}>+ Add Reel</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {cards.length === 0 ? (
            <div style={{ color: '#B8A99A', fontSize: '13px', padding: '20px', textAlign: 'center', width: '100%' }}>
              No reels added yet.
            </div>
          ) : (
            cards.map(c => {
              const isLive = c.status === 'Active' || c.status === 'Live';
              return (
                <div key={c.key} style={{ backgroundColor: '#1A2010', borderRadius: '12px', padding: '16px', border: '1px solid rgba(184,147,91,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ fontWeight: '700', color: '#F6F1E3', fontSize: '14px' }}>{c.title || 'Untitled Reel'}</div>
                    <div style={{ fontSize: '11px', color: isLive ? '#22c55e' : '#EF4444', fontWeight: '600' }}>
                      {isLive ? 'ACTIVE' : 'INACTIVE'}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#B8A99A', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Video URL: {c.videoUrl}
                  </div>
                  
                  {c.videoUrl && (
                     <div style={{ marginBottom: '12px', height: '140px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                       <video src={c.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline />
                     </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      type="button" 
                      onClick={() => setCards(prev => prev.map(item => item.key === c.key ? { ...item, status: (item.status === 'Active' || item.status === 'Live') ? 'Inactive' : 'Active' } : item))} 
                      style={{ 
                        ...btnG, 
                        flex: 1, 
                        height: '35px', 
                        padding: '0 10px', 
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: isLive ? '#3E4930' : 'rgba(239,68,68,0.15)',
                        color: isLive ? '#F6F1E3' : '#EF4444',
                        borderColor: isLive ? '#B8935B' : 'rgba(239,68,68,0.4)'
                      }}
                    >
                      {isLive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => openEditCard(c)} 
                      style={{ ...btnG, height: '35px', width: '35px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                      title="Edit Reel"
                    >
                      <EditIcon />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setCards(prev => prev.filter(item => item.key !== c.key))} 
                      style={{ ...btnD, height: '35px', width: '35px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                      title="Delete Reel"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
          <button type="button" onClick={handleSaveAllSettings} disabled={savingSettings} style={btnP}>
            {savingSettings ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── Modal Add / Edit Reel ────────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '26px', width: '90%', maxWidth: '520px', border: '1px solid #B8935B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>SOCIAL MEDIA MANAGER</div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#F6F1E3' }}>
                  {editCard ? 'Edit Reel' : 'Add New Reel'}
                </h3>
              </div>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            <form onSubmit={handleSaveModalCard} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>Title / Overlay Text *</label>
                  <input required value={cardForm.title} onChange={e => setCardForm(p => ({ ...p, title: e.target.value }))} style={iStyle} placeholder="e.g. ELEGANT STYLE" />
                </div>
                <div>
                  <label style={lStyle}>Subtitle</label>
                  <input value={cardForm.subtitle} onChange={e => setCardForm(p => ({ ...p, subtitle: e.target.value }))} style={iStyle} placeholder="e.g. Watch Video" />
                </div>
              </div>
              <div>
                <label style={lStyle}>Video URL (.mp4) *</label>
                <input required value={cardForm.videoUrl} onChange={e => setCardForm(p => ({ ...p, videoUrl: e.target.value }))} style={iStyle} placeholder="e.g. /instagram/video1.mp4 or https://..." />
              </div>
              <div>
                <label style={lStyle}>Instagram Link Target *</label>
                <input required value={cardForm.instagramLink} onChange={e => setCardForm(p => ({ ...p, instagramLink: e.target.value }))} style={iStyle} placeholder="e.g. https://www.instagram.com/p/..." />
              </div>
              <div>
                <label style={lStyle}>Status</label>
                <select value={cardForm.status} onChange={e => setCardForm(p => ({ ...p, status: e.target.value }))} style={iStyle}>
                  <option value="Active">Active (Show Reel)</option>
                  <option value="Inactive">Inactive (Hide Reel)</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnG}>Cancel</button>
                <button type="submit" style={btnP}>{editCard ? 'Save & Update' : 'Add Reel'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaManagerPage;
