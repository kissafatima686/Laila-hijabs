import React, { useState, useEffect } from 'react';

/**
 * Announcement Bar Settings Manager (Under Header Utilities -> Announcement Bar):
 *  - Panel 1: Announcement Bar Global Styling (Background Color, Text Color, Enable/Disable, Speed)
 *  - Panel 2: Announcement Bar Text Slides (with "+ Add More Field" on top, 3-button action row [ Deactivate / Activate ] [ Edit Icon ] [ Trash Icon ] on every slide right side, and "Save Changes" on bottom)
 */

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

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

const FieldRow = ({ label, value, status, onChangeValue, onToggleStatus, onEditLabel, onDelete }) => (
  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', width: '100%', marginBottom: '14px' }}>
    <div style={{ flex: 1 }}>
      <label style={lStyle}>{label}</label>
      <input 
        value={value} 
        onChange={e => onChangeValue(e.target.value)} 
        style={iStyle} 
        placeholder={`Enter announcement text slide...`} 
      />
    </div>
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button 
        type="button" 
        onClick={onToggleStatus} 
        style={{ 
          ...btnG, 
          height: '39px', 
          padding: '0 16px', 
          fontWeight: '600',
          backgroundColor: status === 'Active' ? '#3E4930' : 'rgba(239,68,68,0.15)',
          color: status === 'Active' ? '#F6F1E3' : '#EF4444',
          borderColor: status === 'Active' ? '#B8935B' : 'rgba(239,68,68,0.4)'
        }}
      >
        {status === 'Active' ? 'Deactivate' : 'Activate'}
      </button>
      <button 
        type="button" 
        onClick={onEditLabel} 
        style={{ ...btnG, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
        title="Edit Slide Label"
      >
        <EditIcon />
      </button>
      <button 
        type="button" 
        onClick={onDelete} 
        style={{ ...btnD, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
        title="Delete Slide"
      >
        <TrashIcon />
      </button>
    </div>
  </div>
);

const AnnouncementBarManagerPage = () => {
  // Panel 1: Global Settings
  const [globalSettings, setGlobalSettings] = useState({
    is_enabled: 'true',
    background_color: '#B8935B',
    text_color: '#FFFFFF',
    slide_speed: '4'
  });

  // Panel 2: Slides List State
  const [slides, setSlides] = useState([
    { key: 'slide_1', label: 'ANNOUNCEMENT SLIDE 1', value: 'WORLDWIDE SHIPPING AVAILABLE · EASY 14-DAY RETURNS & EXCHANGES', status: 'Active' },
    { key: 'slide_2', label: 'ANNOUNCEMENT SLIDE 2', value: 'Free delivery across Pakistan on orders above Rs. 4,000 · Order via WhatsApp', status: 'Active' },
    { key: 'slide_3', label: 'ANNOUNCEMENT SLIDE 3', value: 'New High Summer 2026 Collection Available Now · Shop Latest Arrivals', status: 'Active' },
    { key: 'slide_4', label: 'ANNOUNCEMENT SLIDE 4', value: 'Special Offer: Use Code LAILA10 for 10% Off Your First Order', status: 'Active' }
  ]);

  const [savingSettings, setSavingSettings] = useState(false);

  const fetchSettings = () => {
    fetch(`${API}/sections/home_announcement_bar`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          let meta = {};
          try { meta = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : (data.metadata || {}); } catch(e) {}
          
          setGlobalSettings({
            is_enabled: meta.is_enabled || 'true',
            background_color: meta.background_color || data.body_content || '#B8935B',
            text_color: meta.text_color || data.button_text || '#FFFFFF',
            slide_speed: meta.slide_speed || '4'
          });

          if (Array.isArray(meta.slides) && meta.slides.length > 0) {
            setSlides(meta.slides);
          } else if (data.title) {
            setSlides([
              { key: 'slide_1', label: 'ANNOUNCEMENT SLIDE 1', value: data.title, status: 'Active' }
            ]);
          }
        }
      })
      .catch(err => console.error("Error fetching announcement settings:", err));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleEditLabel = (key, currentLabel) => {
    const newLabel = window.prompt("Edit announcement label name:", currentLabel);
    if (!newLabel || !newLabel.trim()) return;
    setSlides(prev => prev.map(s => s.key === key ? { ...s, label: newLabel.trim().toUpperCase() } : s));
  };

  const handleAddMoreSlide = () => {
    const text = window.prompt("Enter new announcement slide text:");
    if (!text || !text.trim()) return;
    const key = `slide_${Date.now()}`;
    const num = slides.length + 1;
    setSlides(prev => [
      ...prev,
      { key, label: `ANNOUNCEMENT SLIDE ${num}`, value: text.trim(), status: 'Active' }
    ]);
  };

  const handleSaveSettings = () => {
    setSavingSettings(true);

    const activeSlides = slides.filter(s => s.status === 'Active');
    const primaryTitle = activeSlides.length > 0 ? activeSlides[0].value : 'WORLDWIDE SHIPPING AVAILABLE · EASY 14-DAY RETURNS & EXCHANGES';

    const metaData = {
      is_enabled: globalSettings.is_enabled,
      background_color: globalSettings.background_color,
      text_color: globalSettings.text_color,
      slide_speed: globalSettings.slide_speed,
      slides: slides
    };

    fetch(`${API}/sections/home_announcement_bar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: primaryTitle,
        subtitle: 'Announcement Bar',
        body_content: globalSettings.background_color,
        button_text: globalSettings.text_color,
        metadata: metaData
      })
    })
      .then(() => alert('Announcement Bar settings saved successfully!'))
      .catch(err => console.error("Error saving announcement bar settings:", err))
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
            HEADER UTILITIES
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#F6F1E3' }}>
            Announcement Bar Settings & Manager
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Configure announcement bar banner text, colors, status, and slides with 3-button actions [Deactivate] [Edit] [Trash].
          </p>
        </div>
        <button onClick={handleAddMoreSlide} style={{ ...btnP, boxShadow: '0 4px 14px rgba(184,147,91,0.4)' }}>
          + Add Announcement Slide
        </button>
      </div>

      {/* ── PANEL 1: GLOBAL ANNOUNCEMENT STYLING & STATUS ───────────────────── */}
      <div style={cardStyle}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px', marginBottom: '4px' }}>PANEL 1</div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
          Global Announcement Bar Colors & Appearance
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={lStyle}>BAR STATUS</label>
            <select value={globalSettings.is_enabled} onChange={e => setGlobalSettings(s => ({ ...s, is_enabled: e.target.value }))} style={iStyle}>
              <option value="true">Active (Show)</option>
              <option value="false">Disabled (Hide)</option>
            </select>
          </div>
          <div>
            <label style={lStyle}>BACKGROUND COLOR</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="color" value={globalSettings.background_color} onChange={e => setGlobalSettings(s => ({ ...s, background_color: e.target.value }))} style={{ width: '42px', height: '39px', padding: 0, border: '1px solid #B8935B', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#182012' }} />
              <input value={globalSettings.background_color} onChange={e => setGlobalSettings(s => ({ ...s, background_color: e.target.value }))} style={iStyle} placeholder="#B8935B" />
            </div>
          </div>
          <div>
            <label style={lStyle}>TEXT COLOR</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="color" value={globalSettings.text_color} onChange={e => setGlobalSettings(s => ({ ...s, text_color: e.target.value }))} style={{ width: '42px', height: '39px', padding: 0, border: '1px solid #B8935B', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#182012' }} />
              <input value={globalSettings.text_color} onChange={e => setGlobalSettings(s => ({ ...s, text_color: e.target.value }))} style={iStyle} placeholder="#FFFFFF" />
            </div>
          </div>
          <div>
            <label style={lStyle}>ROTATE SPEED (SECONDS)</label>
            <input type="number" min="0" value={globalSettings.slide_speed} onChange={e => setGlobalSettings(s => ({ ...s, slide_speed: e.target.value }))} style={iStyle} placeholder="4" />
          </div>
        </div>
      </div>

      {/* ── PANEL 2: ANNOUNCEMENT SLIDES WITH 3-BUTTON ACTIONS ──────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 2</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
              Announcement Bar Slide Texts ({slides.length})
            </h3>
          </div>
          <button type="button" onClick={handleAddMoreSlide} style={{ ...btnG, border: '1px solid #B8935B', fontWeight: '700' }}>
            + Add More Field
          </button>
        </div>

        {slides.map((s) => (
          <FieldRow 
            key={s.key} 
            label={s.label} 
            value={s.value} 
            status={s.status} 
            onChangeValue={v => setSlides(prev => prev.map(item => item.key === s.key ? { ...item, value: v } : item))} 
            onToggleStatus={() => setSlides(prev => prev.map(item => item.key === s.key ? { ...item, status: (item.status === 'Active' || item.status === 'Live') ? 'Inactive' : 'Active' } : item))} 
            onEditLabel={() => handleEditLabel(s.key, s.label)} 
            onDelete={() => setSlides(prev => prev.filter(item => item.key !== s.key))} 
          />
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

export default AnnouncementBarManagerPage;
