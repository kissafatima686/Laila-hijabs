import React, { useState, useEffect } from 'react';

/**
 * Review Banner Manager Page (Under Home Page Manager -> Review Banner):
 *  - Panel 1: Review Banner Appearance & Global Settings (Status, Colors, Star Color)
 *  - Panel 2: Review Banner Fields (with "+ Add More Field" on top, 3-button action row [ Deactivate / Activate ] [ Edit Icon ] [ Trash Icon ] on every field right side, and "Save Changes" on bottom)
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

const FieldRow = ({ label, value, status, onChangeValue, onToggleStatus, onEditLabel, onDelete }) => (
  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', width: '100%', marginBottom: '14px' }}>
    <div style={{ flex: 1 }}>
      <label style={lStyle}>{label}</label>
      <input 
        value={value} 
        onChange={e => onChangeValue(e.target.value)} 
        style={iStyle} 
        placeholder={`Enter ${label.toLowerCase()}...`} 
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
        title="Edit Field Label"
      >
        <EditIcon />
      </button>
      <button 
        type="button" 
        onClick={onDelete} 
        style={{ ...btnD, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
        title="Delete Field"
      >
        <TrashIcon />
      </button>
    </div>
  </div>
);

const ReviewBannerManagerPage = () => {
  // Panel 1: Global Settings
  const [globalSettings, setGlobalSettings] = useState({
    is_enabled: 'true',
    background_color: '#000000',
    text_color: '#FFFFFF',
    star_color: '#FFD700'
  });

  // Panel 2: Fields List State
  const [fields, setFields] = useState([
    { key: 'title', label: 'REVIEW BANNER MAIN TITLE', value: 'Our customers say Excellent', status: 'Active' },
    { key: 'star_count', label: 'STAR RATING SCORE (OUT OF 5)', value: '4.5', status: 'Active' },
    { key: 'subtitle', label: 'REVIEW RATING SUBTITLE', value: '4.3 based on 1,561 reviews', status: 'Active' }
  ]);

  const [savingSettings, setSavingSettings] = useState(false);

  const fetchSettings = () => {
    fetch(`${API}/sections/home_review_banner`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          let meta = {};
          try { meta = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : (data.metadata || {}); } catch(e) {}
          
          setGlobalSettings({
            is_enabled: meta.is_enabled || 'true',
            background_color: meta.background_color || '#000000',
            text_color: meta.text_color || '#FFFFFF',
            star_color: meta.star_color || '#FFD700'
          });

          if (Array.isArray(meta.fields)) {
            setFields(meta.fields);
          } else {
            setFields([
              { key: 'title', label: 'REVIEW BANNER MAIN TITLE', value: data.title || 'Our customers say Excellent', status: meta.title_status || 'Active' },
              { key: 'star_count', label: 'STAR RATING SCORE (OUT OF 5)', value: meta.star_count || '4.5', status: meta.star_status || 'Active' },
              { key: 'subtitle', label: 'REVIEW RATING SUBTITLE', value: data.subtitle || '4.3 based on 1,561 reviews', status: meta.subtitle_status || 'Active' }
            ]);
          }
        }
      })
      .catch(err => console.error("Error fetching review banner settings:", err));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleEditLabel = (key, currentLabel) => {
    const newLabel = window.prompt("Edit field label name:", currentLabel);
    if (!newLabel || !newLabel.trim()) return;
    setFields(prev => prev.map(f => f.key === key ? { ...f, label: newLabel.trim().toUpperCase() } : f));
  };

  const handleAddMoreField = () => {
    const name = window.prompt("Enter new review banner field label:");
    if (!name || !name.trim()) return;
    const key = `custom_${Date.now()}`;
    setFields(prev => [
      ...prev,
      { key, label: name.trim().toUpperCase(), value: '', status: 'Active' }
    ]);
  };

  const handleSaveSettings = () => {
    setSavingSettings(true);

    const fieldStatuses = {};
    const metaData = {
      is_enabled: globalSettings.is_enabled,
      background_color: globalSettings.background_color,
      text_color: globalSettings.text_color,
      star_color: globalSettings.star_color,
      fields: fields,
      field_statuses: fieldStatuses
    };

    fields.forEach(f => {
      fieldStatuses[f.key] = f.status;
      if (f.status === 'Active') {
        metaData[f.key] = f.value;
      } else {
        metaData[f.key] = '[DISABLED]';
      }
    });

    const mainTitle = fields.find(f => f.key === 'title' && f.status === 'Active')?.value || 'Our customers say Excellent';
    const mainSub = fields.find(f => f.key === 'subtitle' && f.status === 'Active')?.value || '4.3 based on 1,561 reviews';

    fetch(`${API}/sections/home_review_banner`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: mainTitle,
        subtitle: mainSub,
        metadata: metaData
      })
    })
      .then(() => alert('Review Banner settings saved successfully!'))
      .catch(err => console.error("Error saving review banner settings:", err))
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
            Review Banner Settings & Manager
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Configure Homepage Customer Review Banner text, star score, background colors, and 3-button field controls.
          </p>
        </div>
        <button onClick={handleAddMoreField} style={{ ...btnP, boxShadow: '0 4px 14px rgba(184,147,91,0.4)' }}>
          + Add Review Field
        </button>
      </div>

      {/* ── PANEL 1: GLOBAL REVIEW BANNER APPEARANCE ──────────────────────── */}
      <div style={cardStyle}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px', marginBottom: '4px' }}>PANEL 1</div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
          Review Banner Colors & Display Status
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={lStyle}>BANNER STATUS</label>
            <select value={globalSettings.is_enabled} onChange={e => setGlobalSettings(s => ({ ...s, is_enabled: e.target.value }))} style={iStyle}>
              <option value="true">Active (Show Banner)</option>
              <option value="false">Disabled (Hide Banner)</option>
            </select>
          </div>
          <div>
            <label style={lStyle}>BACKGROUND COLOR</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="color" value={globalSettings.background_color} onChange={e => setGlobalSettings(s => ({ ...s, background_color: e.target.value }))} style={{ width: '42px', height: '39px', padding: 0, border: '1px solid #B8935B', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#182012' }} />
              <input value={globalSettings.background_color} onChange={e => setGlobalSettings(s => ({ ...s, background_color: e.target.value }))} style={iStyle} placeholder="#000000" />
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
            <label style={lStyle}>STAR RATING COLOR</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="color" value={globalSettings.star_color} onChange={e => setGlobalSettings(s => ({ ...s, star_color: e.target.value }))} style={{ width: '42px', height: '39px', padding: 0, border: '1px solid #B8935B', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#182012' }} />
              <input value={globalSettings.star_color} onChange={e => setGlobalSettings(s => ({ ...s, star_color: e.target.value }))} style={iStyle} placeholder="#FFD700" />
            </div>
          </div>
        </div>
      </div>

      {/* ── PANEL 2: DYNAMIC REVIEW FIELDS ──────────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 2</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
              Review Banner Fields & Content
            </h3>
          </div>
          <button type="button" onClick={handleAddMoreField} style={{ ...btnG, border: '1px solid #B8935B', fontWeight: '700' }}>
            + Add More Field
          </button>
        </div>

        {fields.map((f) => (
          <FieldRow 
            key={f.key} 
            label={f.label} 
            value={f.value} 
            status={f.status} 
            onChangeValue={v => setFields(prev => prev.map(item => item.key === f.key ? { ...item, value: v } : item))} 
            onToggleStatus={() => setFields(prev => prev.map(item => item.key === f.key ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item))} 
            onEditLabel={() => handleEditLabel(f.key, f.label)} 
            onDelete={() => setFields(prev => prev.filter(item => item.key !== f.key))} 
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

export default ReviewBannerManagerPage;
