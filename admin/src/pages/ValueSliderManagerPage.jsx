import React, { useState, useEffect } from 'react';

/**
 * Interactive Value Slider Manager Page (Under Home Page Manager -> Interactive Value Slider):
 *  - Panel 1: Global Status & Styling & Autoplay Speed
 *  - Panel 2: Interactive Value Slides (with "+ Add Value Slide" on top, 3-button action row [ Deactivate / Activate ] [ Edit Icon ] [ Trash Icon ] on every slide right side, and "Save Changes" on bottom)
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

const ValueSliderManagerPage = () => {
  const [globalSettings, setGlobalSettings] = useState({
    is_enabled: 'true',
    background_color: '#FAF7F2',
    text_color: '#222C1A',
    slide_speed: '5'
  });

  const [slides, setSlides] = useState([
    { 
      key: 'slide_1', 
      title: 'A FEMALE-LED INDEPENDENT WOMENSWEAR BRAND', 
      text: 'We prioritise small-batch production to ensure every piece is made with care and designed to last.', 
      status: 'Active' 
    },
    { 
      key: 'slide_2', 
      title: 'WE OFFER SIZE & LENGTH OPTIONS', 
      text: 'We don’t believe one length fits all. Our dresses are designed around coverage, without plunging necklines or awkward slits.', 
      status: 'Active' 
    },
    { 
      key: 'slide_3', 
      title: 'ELEGANT MODESTY & PREMIUM FABRICS', 
      text: 'Designed in Lahore with luxury silk, crepe, and chiffon crafted for timeless style and effortless comfort.', 
      status: 'Active' 
    }
  ]);

  const [savingSettings, setSavingSettings] = useState(false);

  const fetchSettings = () => {
    fetch(`${API}/sections/home_value_slider`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          let meta = {};
          try { meta = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : (data.metadata || {}); } catch(e) {}

          setGlobalSettings({
            is_enabled: meta.is_enabled || 'true',
            background_color: meta.background_color || '#FAF7F2',
            text_color: meta.text_color || '#222C1A',
            slide_speed: meta.slide_speed || '5'
          });

          if (Array.isArray(meta.slides) && meta.slides.length > 0) {
            setSlides(meta.slides);
          }
        }
      })
      .catch(err => console.error("Error fetching value slider settings:", err));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleEditTitle = (key, currentTitle) => {
    const newTitle = window.prompt("Edit value slide heading:", currentTitle);
    if (!newTitle || !newTitle.trim()) return;
    setSlides(prev => prev.map(s => s.key === key ? { ...s, title: newTitle.trim().toUpperCase() } : s));
  };

  const handleAddMoreSlide = () => {
    const title = window.prompt("Enter new interactive slide heading:");
    if (!title || !title.trim()) return;
    const text = window.prompt("Enter slide description text:") || '';
    const key = `slide_${Date.now()}`;
    setSlides(prev => [
      ...prev,
      { key, title: title.trim().toUpperCase(), text: text.trim(), status: 'Active' }
    ]);
  };

  const handleSaveSettings = () => {
    setSavingSettings(true);

    const fieldStatuses = {};
    slides.forEach(s => {
      fieldStatuses[s.key] = s.status;
    });

    const metaData = {
      is_enabled: globalSettings.is_enabled,
      background_color: globalSettings.background_color,
      text_color: globalSettings.text_color,
      slide_speed: globalSettings.slide_speed,
      slides: slides,
      field_statuses: fieldStatuses
    };

    fetch(`${API}/sections/home_value_slider`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Interactive Value Slider',
        metadata: metaData
      })
    })
      .then(() => alert('Interactive Value Slider settings saved successfully!'))
      .catch(err => console.error("Error saving value slider settings:", err))
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
            HOME PAGE MANAGER
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#F6F1E3' }}>
            Interactive Value Slider Manager
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Configure Homepage interactive value proposition slides, autoplay speed, colors, and 3-button slide controls.
          </p>
        </div>
        <button onClick={handleAddMoreSlide} style={{ ...btnP, boxShadow: '0 4px 14px rgba(184,147,91,0.4)' }}>
          + Add Value Slide
        </button>
      </div>

      {/* ── PANEL 1: GLOBAL STYLING & STATUS ──────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px', marginBottom: '4px' }}>PANEL 1</div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
          Interactive Value Slider Colors & Speed
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={lStyle}>SLIDER STATUS</label>
            <select value={globalSettings.is_enabled} onChange={e => setGlobalSettings(s => ({ ...s, is_enabled: e.target.value }))} style={iStyle}>
              <option value="true">Active (Show Slider)</option>
              <option value="false">Disabled (Hide Slider)</option>
            </select>
          </div>
          <div>
            <label style={lStyle}>BACKGROUND COLOR</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="color" value={globalSettings.background_color} onChange={e => setGlobalSettings(s => ({ ...s, background_color: e.target.value }))} style={{ width: '42px', height: '39px', padding: 0, border: '1px solid #B8935B', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#182012' }} />
              <input value={globalSettings.background_color} onChange={e => setGlobalSettings(s => ({ ...s, background_color: e.target.value }))} style={iStyle} placeholder="#FAF7F2" />
            </div>
          </div>
          <div>
            <label style={lStyle}>TEXT COLOR</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="color" value={globalSettings.text_color} onChange={e => setGlobalSettings(s => ({ ...s, text_color: e.target.value }))} style={{ width: '42px', height: '39px', padding: 0, border: '1px solid #B8935B', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#182012' }} />
              <input value={globalSettings.text_color} onChange={e => setGlobalSettings(s => ({ ...s, text_color: e.target.value }))} style={iStyle} placeholder="#222C1A" />
            </div>
          </div>
          <div>
            <label style={lStyle}>AUTOPLAY SPEED (SEC)</label>
            <input type="number" min="0" value={globalSettings.slide_speed} onChange={e => setGlobalSettings(s => ({ ...s, slide_speed: e.target.value }))} style={iStyle} placeholder="5" />
          </div>
        </div>
      </div>

      {/* ── PANEL 2: VALUE SLIDES LIST ───────────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 2</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
              Interactive Value Slides ({slides.length})
            </h3>
          </div>
          <button type="button" onClick={handleAddMoreSlide} style={{ ...btnG, border: '1px solid #B8935B', fontWeight: '700' }}>
            + Add More Field
          </button>
        </div>

        {slides.map((s) => (
          <div key={s.key} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', width: '100%', marginBottom: '16px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label style={lStyle}>SLIDE HEADING</label>
                <input 
                  value={s.title} 
                  onChange={e => setSlides(prev => prev.map(item => item.key === s.key ? { ...item, title: e.target.value } : item))} 
                  style={iStyle} 
                  placeholder="SLIDE HEADING..." 
                />
              </div>
              <div>
                <label style={lStyle}>DESCRIPTION TEXT</label>
                <input 
                  value={s.text} 
                  onChange={e => setSlides(prev => prev.map(item => item.key === s.key ? { ...item, text: e.target.value } : item))} 
                  style={iStyle} 
                  placeholder="Enter slide description..." 
                />
              </div>
            </div>

            {/* 3-Button Action Row */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                type="button" 
                onClick={() => setSlides(prev => prev.map(item => item.key === s.key ? { ...item, status: (item.status === 'Active' || item.status === 'Live') ? 'Inactive' : 'Active' } : item))} 
                style={{ 
                  ...btnG, 
                  height: '39px', 
                  padding: '0 16px', 
                  fontWeight: '600',
                  backgroundColor: s.status === 'Active' ? '#3E4930' : 'rgba(239,68,68,0.15)',
                  color: s.status === 'Active' ? '#F6F1E3' : '#EF4444',
                  borderColor: s.status === 'Active' ? '#B8935B' : 'rgba(239,68,68,0.4)'
                }}
              >
                {s.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
              <button 
                type="button" 
                onClick={() => handleEditTitle(s.key, s.title)} 
                style={{ ...btnG, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                title="Edit Slide Heading"
              >
                <EditIcon />
              </button>
              <button 
                type="button" 
                onClick={() => setSlides(prev => prev.filter(item => item.key !== s.key))} 
                style={{ ...btnD, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                title="Delete Slide"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}

        <div style={{ marginTop: '10px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
          <button type="button" onClick={handleSaveSettings} disabled={savingSettings} style={btnP}>
            {savingSettings ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValueSliderManagerPage;
