import React, { useState, useEffect } from 'react';

/**
 * Featured Collections Manager Page (Under Dynamic Showcase -> Featured Collections / Shop by Category):
 *  - Panel 1: Section Header Settings (Section Title, Active/Disabled status, Autoplay Speed)
 *  - Panel 2: Category Collection Cards with editable Category Title, Design Count, Description Text, Image URL, Target Link,
 *             and 3-button action row [ Deactivate / Activate ] [ Edit Icon ] [ Trash Icon ] on every card.
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

const DEFAULT_CATEGORIES = [
  { key: 'cat_1', title: 'Jilbab', count: '4 DESIGNS', desc: 'Classic overhead and two-piece jilbabs designed for comfort and modesty.', image_url: '/Categories/jilbab/jilbab.png', path: '/categories/jilbab', status: 'Active' },
  { key: 'cat_2', title: 'Namaz Chadar', count: '1 DESIGN', desc: 'Breathable and comfortable prayer chadar for your daily devotions.', image_url: '/Categories/namazchadar/namazchaddar.png', path: '/categories/namaz-chadar', status: 'Active' },
  { key: 'cat_3', title: 'Round Chadar', count: '1 DESIGN', desc: 'Classic round chadar ensuring perfect coverage with premium nida fabric.', image_url: '/Categories/roundchadar/round1.png', path: '/categories/round-chadar', status: 'Active' },
  { key: 'cat_4', title: 'Abayas', count: '5 DESIGNS', desc: 'Structured yet soft silhouettes tailored generously for daily grace and formal Eid gatherings.', image_url: '/Categories/abaya/abaya1.png', path: '/categories/abayas', status: 'Active' },
  { key: 'cat_5', title: 'Hijabs', count: '2 COLORS', desc: 'Premium fabrics crafted with hand-rolled edges for everyday and formal elegance.', image_url: '/Categories/hijabs/hijab1.png', path: '/categories/hijabs', status: 'Active' },
  { key: 'cat_6', title: 'Irani Chadar', count: '5 DESIGNS', desc: 'Traditional flowing chadar providing full coverage with an elegant drape.', image_url: '/Categories/iranichadar/irani1.png', path: '/categories/irani-chadar', status: 'Active' }
];

const FeaturedCollectionsManagerPage = () => {
  const [globalSettings, setGlobalSettings] = useState({
    title: 'SHOP BY CATEGORY',
    is_enabled: 'true',
    slide_speed: '3'
  });

  const [cards, setCards] = useState(DEFAULT_CATEGORIES);
  const [savingSettings, setSavingSettings] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editCard, setEditCard] = useState(null);
  const [dbCategories, setDbCategories] = useState([]);
  const [cardForm, setCardForm] = useState({
    title: '',
    count: '4 DESIGNS',
    desc: '',
    image_url: '/Categories/jilbab/jilbab.png',
    path: '/categories/jilbab',
    status: 'Active'
  });

  const fetchSettings = () => {
    Promise.all([
      fetch(`${API}/sections/home_featured_collections`).then(res => res.json()),
      fetch(`${API}/module/categories`).then(res => res.json())
    ])
      .then(([settingsData, catsData]) => {
        if (settingsData) {
          let meta = {};
          try { meta = typeof settingsData.metadata === 'string' ? JSON.parse(settingsData.metadata) : (settingsData.metadata || {}); } catch(e) {}

          setGlobalSettings({
            title: settingsData.title || 'SHOP BY CATEGORY',
            is_enabled: meta.is_enabled || 'true',
            slide_speed: meta.slide_speed || '3'
          });

          if (Array.isArray(meta.cards) && meta.cards.length > 0) {
            setCards(meta.cards);
          }
        }
        if (Array.isArray(catsData)) {
          setDbCategories(catsData);
        }
      })
      .catch(err => console.error("Error fetching data:", err));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const openAddCard = () => {
    setEditCard(null);
    setCardForm({
      title: '',
      count: '4 DESIGNS',
      desc: '',
      image_url: '/Categories/jilbab/jilbab.png',
      path: '/categories/jilbab',
      status: 'Active'
    });
    setShowModal(true);
  };

  const openEditCard = (card) => {
    setEditCard(card);
    setCardForm({
      title: card.title || '',
      count: card.count || '4 DESIGNS',
      desc: card.desc || '',
      image_url: card.image_url || card.image || '/Categories/jilbab/jilbab.png',
      path: card.path || '/categories/jilbab',
      status: card.status || 'Active'
    });
    setShowModal(true);
  };

  const handleSaveModalCard = (e) => {
    e.preventDefault();
    if (editCard) {
      setCards(prev => prev.map(c => c.key === editCard.key ? { ...c, ...cardForm } : c));
    } else {
      const key = `cat_${Date.now()}`;
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
      slide_speed: globalSettings.slide_speed,
      cards: cards,
      field_statuses: fieldStatuses
    };

    fetch(`${API}/sections/home_featured_collections`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: globalSettings.title,
        metadata: metaData
      })
    })
      .then(() => alert('Featured Collections (Shop By Category) settings saved successfully!'))
      .catch(err => console.error("Error saving featured collections settings:", err))
      .finally(() => setSavingSettings(false));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '50px' }}>
      {/* Page Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', 
        borderRadius: '16px', 
        padding: '24px 28px', 
        border: '1px solid #B8935B', 
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '12px' 
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '5px' }}>
            DYNAMIC SHOWCASE
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#F6F1E3' }}>
            Featured Collections (Shop By Category) Manager
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Manage homepage Shop By Category collection cards, titles, design count tags, images, & 3-button actions.
          </p>
        </div>
        <button onClick={openAddCard} style={{ ...btnP, boxShadow: '0 4px 14px rgba(184,147,91,0.4)' }}>
          + Add Category Collection
        </button>
      </div>

      {/* ── PANEL 1: GLOBAL STYLING & STATUS ──────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px', marginBottom: '4px' }}>PANEL 1</div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
          Featured Collections Title & Section Status
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={lStyle}>SECTION STATUS</label>
            <select value={globalSettings.is_enabled} onChange={e => setGlobalSettings(s => ({ ...s, is_enabled: e.target.value }))} style={{ ...iStyle, padding: '10px 14px', fontSize: '13px' }}>
              <option value="true">Active (Show Section)</option>
              <option value="false">Disabled (Hide Section)</option>
            </select>
          </div>
          <div>
            <label style={lStyle}>SECTION MAIN TITLE</label>
            <input value={globalSettings.title} onChange={e => setGlobalSettings(s => ({ ...s, title: e.target.value }))} style={{ ...iStyle, padding: '10px 14px', fontSize: '13px' }} placeholder="SHOP BY CATEGORY" />
          </div>
          <div>
            <label style={lStyle}>SLIDER AUTOPLAY SPEED (SEC)</label>
            <input type="number" min="0" value={globalSettings.slide_speed} onChange={e => setGlobalSettings(s => ({ ...s, slide_speed: e.target.value }))} style={{ ...iStyle, padding: '10px 14px', fontSize: '13px' }} placeholder="3" />
          </div>
        </div>
      </div>

      {/* ── PANEL 2: FEATURED CATEGORY CARDS ─────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 2</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
              Featured Category Cards ({cards.length})
            </h3>
          </div>
          <button type="button" onClick={openAddCard} style={{ ...btnG, border: '1px solid #B8935B', fontWeight: '700' }}>
            + Add More Field
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cards.map((c) => {
            const isLive = c.status === 'Active' || c.status === 'Live';
            return (
              <div key={c.key} style={{ 
                backgroundColor: '#182012', 
                borderRadius: '14px', 
                padding: '18px', 
                border: '1px solid rgba(184,147,91,0.3)',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                {/* Category Picture Preview */}
                <div style={{ position: 'relative', width: '90px', height: '115px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #B8935B', flexShrink: 0 }}>
                  <img src={c.image_url || c.image || '/Categories/jilbab/jilbab.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {c.count && (
                    <span style={{ position: 'absolute', top: '4px', left: '4px', backgroundColor: '#B8935B', color: '#1A2010', fontSize: '8px', fontWeight: '800', padding: '2px 5px', borderRadius: '10px', textTransform: 'uppercase' }}>
                      {c.count}
                    </span>
                  )}
                </div>

                {/* Editable Category Details Grid */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr 1.5fr', gap: '12px', minWidth: '300px' }}>
                  <div>
                    <label style={lStyle}>CATEGORY TITLE</label>
                    <input 
                      value={c.title} 
                      onChange={e => setCards(prev => prev.map(item => item.key === c.key ? { ...item, title: e.target.value } : item))} 
                      style={iStyle} 
                      placeholder="Jilbab" 
                    />
                  </div>
                  <div>
                    <label style={lStyle}>DESIGN COUNT TAG</label>
                    <input 
                      value={c.count} 
                      onChange={e => setCards(prev => prev.map(item => item.key === c.key ? { ...item, count: e.target.value } : item))} 
                      style={iStyle} 
                      placeholder="4 DESIGNS" 
                    />
                  </div>
                  <div>
                    <label style={lStyle}>DESCRIPTION TEXT</label>
                    <input 
                      value={c.desc} 
                      onChange={e => setCards(prev => prev.map(item => item.key === c.key ? { ...item, desc: e.target.value } : item))} 
                      style={iStyle} 
                      placeholder="Classic overhead and two-piece..." 
                    />
                  </div>
                  <div>
                    <label style={lStyle}>IMAGE URL</label>
                    <input 
                      value={c.image_url || c.image || ''} 
                      onChange={e => setCards(prev => prev.map(item => item.key === c.key ? { ...item, image_url: e.target.value, image: e.target.value } : item))} 
                      style={iStyle} 
                      placeholder="/Categories/jilbab/jilbab.png" 
                    />
                  </div>
                </div>

                {/* 3-Button Action Controls */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button 
                    type="button" 
                    onClick={() => setCards(prev => prev.map(item => item.key === c.key ? { ...item, status: (item.status === 'Active' || item.status === 'Live') ? 'Inactive' : 'Active' } : item))} 
                    style={{ 
                      ...btnG, 
                      height: '39px', 
                      padding: '0 14px', 
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
                    style={{ ...btnG, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                    title="Edit Category Card Details"
                  >
                    <EditIcon />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setCards(prev => prev.filter(item => item.key !== c.key))} 
                    style={{ ...btnD, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                    title="Delete Category Card"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
          <button type="button" onClick={handleSaveAllSettings} disabled={savingSettings} style={btnP}>
            {savingSettings ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── Modal Add / Edit Card ────────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '26px', width: '90%', maxWidth: '520px', border: '1px solid #B8935B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>FEATURED COLLECTIONS MANAGER</div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#F6F1E3' }}>
                  {editCard ? 'Edit Category Card' : 'Add New Category Card'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            <form onSubmit={handleSaveModalCard} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>Target Category (Product Catalog) *</label>
                  <select 
                    required 
                    value={cardForm.title} 
                    onChange={e => {
                      const selectedCat = dbCategories.find(c => c.name === e.target.value);
                      if (selectedCat) {
                        setCardForm(p => ({ 
                          ...p, 
                          title: selectedCat.name, 
                          path: `/categories/${selectedCat.slug}`,
                          image_url: selectedCat.image_url || p.image_url,
                          desc: selectedCat.description || p.desc
                        }));
                      } else {
                        setCardForm(p => ({ ...p, title: e.target.value }));
                      }
                    }} 
                    style={iStyle}
                  >
                    <option value="" disabled>Select a Category...</option>
                    {dbCategories.map(cat => (
                      <option key={cat.category_id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={lStyle}>Design Count Tag</label>
                  <input value={cardForm.count} onChange={e => setCardForm(p => ({ ...p, count: e.target.value }))} style={iStyle} placeholder="e.g. 4 DESIGNS" />
                </div>
              </div>
              <div>
                <label style={lStyle}>Description Subtitle *</label>
                <textarea rows={3} required value={cardForm.desc} onChange={e => setCardForm(p => ({ ...p, desc: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="Enter category description..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>Category Image URL *</label>
                  <input required value={cardForm.image_url} onChange={e => setCardForm(p => ({ ...p, image_url: e.target.value }))} style={iStyle} placeholder="/Categories/jilbab/jilbab.png" />
                </div>
                <div>
                  <label style={lStyle}>Explore Link Path</label>
                  <input readOnly value={cardForm.path} style={{...iStyle, backgroundColor: '#111', color: '#888'}} placeholder="Auto-generated from category selection" />
                </div>
              </div>
              {cardForm.image_url && (
                <div style={{ textAlign: 'center' }}>
                  <img src={cardForm.image_url} alt="Preview" style={{ width: '110px', height: '140px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #B8935B' }} />
                </div>
              )}
              <div>
                <label style={lStyle}>Status</label>
                <select value={cardForm.status} onChange={e => setCardForm(p => ({ ...p, status: e.target.value }))} style={iStyle}>
                  <option value="Active">Active (Show Category Card)</option>
                  <option value="Inactive">Inactive (Deactivate)</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnG}>Cancel</button>
                <button type="submit" style={btnP}>{editCard ? 'Save & Update' : 'Add Category Card'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedCollectionsManagerPage;
