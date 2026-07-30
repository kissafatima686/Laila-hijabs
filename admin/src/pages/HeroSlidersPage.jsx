import React, { useState, useEffect } from 'react';

/**
 * Hero Sliders Settings & Manager Page (Under Home Page Manager -> Hero Sliders):
 *  - Panel 1: Active Hero Sliders List with Image Preview, Editable fields,
 *             3-button action row [ Deactivate / Activate ] [ Edit Icon ] [ Trash Icon ],
 *             and "+ Add New Hero Slide" modal.
 */

const API = 'http://localhost:5000/api/admin';

const iStyle = { 
  width: '100%', 
  padding: '10px 14px', 
  borderRadius: '8px', 
  backgroundColor: '#182012', 
  border: '1px solid rgba(184,147,91,0.5)', 
  color: '#F6F1E3', 
  fontSize: '13px', 
  outline: 'none', 
  boxSizing: 'border-box' 
};

const lStyle = { 
  fontSize: '11px', 
  fontWeight: '700', 
  color: '#B8935B', 
  letterSpacing: '0.8px', 
  textTransform: 'uppercase', 
  display: 'block', 
  marginBottom: '5px' 
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

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const HeroSlidersPage = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editSlider, setEditSlider] = useState(null);
  const [slideForm, setSlideForm] = useState({
    title: '',
    subtitle: '',
    image_url: '/hero2.png',
    button_link: '/categories',
    status: 'Live'
  });

  const fetchSliders = () => {
    setLoading(true);
    fetch(`${API}/module/sliders`)
      .then(res => res.json())
      .then(data => setSliders(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching sliders:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const openAddSlide = () => {
    setEditSlider(null);
    setSlideForm({
      title: '',
      subtitle: '',
      image_url: '/hero2.png',
      button_link: '/categories',
      status: 'Live'
    });
    setShowModal(true);
  };

  const openEditSlide = (slide) => {
    setEditSlider(slide);
    setSlideForm({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      image_url: slide.image_url || '/hero2.png',
      button_link: slide.button_link || '/categories',
      status: slide.status || 'Live'
    });
    setShowModal(true);
  };

  const handleSaveSlide = (e) => {
    if (e) e.preventDefault();
    const url = editSlider ? `${API}/module/sliders/${editSlider.slider_id}` : `${API}/module/sliders`;
    const method = editSlider ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slideForm)
    })
      .then(() => { setShowModal(false); fetchSliders(); })
      .catch(err => console.error("Error saving hero slide:", err));
  };

  const handleToggleStatus = (slide) => {
    const nextStatus = (slide.status === 'Live' || slide.status === 'Active') ? 'Draft' : 'Live';
    fetch(`${API}/module/sliders/${slide.slider_id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    }).then(fetchSliders);
  };

  const handleDeleteSlide = (id) => {
    if (!window.confirm("Are you sure you want to delete this hero slide?")) return;
    fetch(`${API}/module/sliders/${id}`, { method: 'DELETE' }).then(fetchSliders);
  };

  const handleUpdateSlideField = (slide, fieldName, newValue) => {
    const updatedForm = {
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      image_url: slide.image_url || '/hero2.png',
      button_link: slide.button_link || '/categories',
      status: slide.status || 'Live',
      [fieldName]: newValue
    };

    fetch(`${API}/module/sliders/${slide.slider_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedForm)
    }).then(fetchSliders);
  };

  const filteredSliders = sliders.filter(s => {
    const q = searchQuery.toLowerCase();
    return (s.title || '').toLowerCase().includes(q) || (s.subtitle || '').toLowerCase().includes(q);
  });

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
            HOME PAGE MANAGER
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#F6F1E3' }}>
            Hero Sliders & Banner Manager
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Manage homepage hero sliders with individual sections for titles, images, links, and status.
          </p>
        </div>
        <button onClick={openAddSlide} style={{ ...btnP, boxShadow: '0 4px 14px rgba(184,147,91,0.4)' }}>
          + Add New Hero Slide
        </button>
      </div>

      {/* ── PANEL: HERO SLIDERS LIST ───────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>HERO SLIDERS</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
              Active Homepage Hero Sliders ({sliders.length})
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search slide title..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              style={{ ...iStyle, width: '220px' }} 
            />
            <button onClick={openAddSlide} style={btnP}>+ Add Hero Slide</button>
          </div>
        </div>

        {loading ? (
          <div style={cardStyle}>
            <div style={{ padding: '30px', textAlign: 'center', color: '#E7D9C9' }}>Loading Hero Sliders...</div>
          </div>
        ) : filteredSliders.length === 0 ? (
          <div style={cardStyle}>
            <div style={{ padding: '30px', textAlign: 'center', color: '#B8A99A', fontSize: '13px' }}>
              No hero slides found. Click "+ Add New Hero Slide" above to add one!
            </div>
          </div>
        ) : (
          filteredSliders.map((s, idx) => {
            const isLive = s.status === 'Live' || s.status === 'Active';
            return (
              <div key={s.slider_id} style={cardStyle}>
                {/* Section Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>HERO SLIDE #{idx + 1}</div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
                      {s.title || `Slide #${idx + 1}`}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      type="button" 
                      onClick={() => handleToggleStatus(s)} 
                      style={{ 
                        ...btnG, 
                        height: '35px', 
                        padding: '0 14px', 
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
                      onClick={() => openEditSlide(s)} 
                      style={{ ...btnG, height: '35px', width: '35px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                      title="Edit Full Slide"
                    >
                      <EditIcon />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteSlide(s.slider_id)} 
                      style={{ ...btnD, height: '35px', width: '35px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                      title="Delete Slide"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>

                {/* Individual Separated Field Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Field 1: Slide Main Title */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <label style={lStyle}>SLIDE MAIN TITLE</label>
                      <input 
                        type="text"
                        value={s.title || ''} 
                        onChange={e => handleUpdateSlideField(s, 'title', e.target.value)} 
                        style={iStyle} 
                        placeholder="Enter slide main title..." 
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '18px' }}>
                      <button 
                        type="button" 
                        onClick={() => handleToggleStatus(s)} 
                        style={{ 
                          ...btnG, 
                          height: '39px', 
                          padding: '0 16px', 
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
                        onClick={() => openEditSlide(s)} 
                        style={{ ...btnG, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                        title="Edit Field"
                      >
                        <EditIcon />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteSlide(s.slider_id)} 
                        style={{ ...btnD, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                        title="Delete Field"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  {/* Field 2: Subtitle Description */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <label style={lStyle}>SUBTITLE DESCRIPTION</label>
                      <input 
                        type="text"
                        value={s.subtitle || ''} 
                        onChange={e => handleUpdateSlideField(s, 'subtitle', e.target.value)} 
                        style={iStyle} 
                        placeholder="Enter subtitle description..." 
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '18px' }}>
                      <button 
                        type="button" 
                        onClick={() => handleToggleStatus(s)} 
                        style={{ 
                          ...btnG, 
                          height: '39px', 
                          padding: '0 16px', 
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
                        onClick={() => openEditSlide(s)} 
                        style={{ ...btnG, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                        title="Edit Field"
                      >
                        <EditIcon />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteSlide(s.slider_id)} 
                        style={{ ...btnD, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                        title="Delete Field"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  {/* Field 3: Image Section (Separate Section with Preview) */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', backgroundColor: '#182012', padding: '14px', borderRadius: '10px', border: '1px solid rgba(184,147,91,0.2)' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <label style={lStyle}>HERO IMAGE URL & PREVIEW</label>
                      <input 
                        type="text"
                        value={s.image_url || ''} 
                        onChange={e => handleUpdateSlideField(s, 'image_url', e.target.value)} 
                        style={iStyle} 
                        placeholder="Enter hero image URL..." 
                      />
                      {s.image_url && (
                        <div style={{ marginTop: '10px' }}>
                          <img 
                            src={s.image_url} 
                            alt="Slide Preview" 
                            style={{ height: '90px', width: '160px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #B8935B' }} 
                          />
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '18px' }}>
                      <button 
                        type="button" 
                        onClick={() => handleToggleStatus(s)} 
                        style={{ 
                          ...btnG, 
                          height: '39px', 
                          padding: '0 16px', 
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
                        onClick={() => openEditSlide(s)} 
                        style={{ ...btnG, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                        title="Edit Field"
                      >
                        <EditIcon />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteSlide(s.slider_id)} 
                        style={{ ...btnD, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                        title="Delete Field"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  {/* Field 4: Button Target Link URL */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <label style={lStyle}>BUTTON TARGET LINK URL</label>
                      <input 
                        type="text"
                        value={s.button_link || ''} 
                        onChange={e => handleUpdateSlideField(s, 'button_link', e.target.value)} 
                        style={iStyle} 
                        placeholder="Enter target link URL..." 
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '18px' }}>
                      <button 
                        type="button" 
                        onClick={() => handleToggleStatus(s)} 
                        style={{ 
                          ...btnG, 
                          height: '39px', 
                          padding: '0 16px', 
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
                        onClick={() => openEditSlide(s)} 
                        style={{ ...btnG, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                        title="Edit Field"
                      >
                        <EditIcon />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteSlide(s.slider_id)} 
                        style={{ ...btnD, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                        title="Delete Field"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Slide Add / Edit Modal ───────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '26px', width: '90%', maxWidth: '500px', border: '1px solid #B8935B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>HERO SLIDER MANAGEMENT</div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#F6F1E3' }}>
                  {editSlider ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer' }}><CloseIcon /></button>
            </div>

            <form onSubmit={handleSaveSlide} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={lStyle}>Slide Main Title *</label>
                <input required value={slideForm.title} onChange={e => setSlideForm(p => ({ ...p, title: e.target.value }))} style={iStyle} placeholder="e.g. ELEGANCE IN EVERY FOLD" />
              </div>
              <div>
                <label style={lStyle}>Subtitle Description</label>
                <input value={slideForm.subtitle} onChange={e => setSlideForm(p => ({ ...p, subtitle: e.target.value }))} style={iStyle} placeholder="e.g. Discover our handcrafted Silk Hijab Collections..." />
              </div>
              <div>
                <label style={lStyle}>Hero Image URL *</label>
                <input required value={slideForm.image_url} onChange={e => setSlideForm(p => ({ ...p, image_url: e.target.value }))} style={iStyle} placeholder="e.g. /hero2.png or https://..." />
                {slideForm.image_url && (
                  <div style={{ marginTop: '8px' }}>
                    <img src={slideForm.image_url} alt="Preview" style={{ width: '100%', height: '110px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #B8935B' }} />
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>Button Target Link URL</label>
                  <input value={slideForm.button_link} onChange={e => setSlideForm(p => ({ ...p, button_link: e.target.value }))} style={iStyle} placeholder="e.g. /categories" />
                </div>
                <div>
                  <label style={lStyle}>Status</label>
                  <select value={slideForm.status} onChange={e => setSlideForm(p => ({ ...p, status: e.target.value }))} style={iStyle}>
                    <option value="Live">Live (Active)</option>
                    <option value="Draft">Draft (Inactive)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnG}>Cancel</button>
                <button type="submit" style={btnP}>{editSlider ? 'Save & Update' : 'Add Hero Slide'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSlidersPage;
