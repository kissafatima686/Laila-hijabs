import React, { useState, useEffect } from 'react';

/**
 * Value Features Strip Manager Page (Under Home Page Manager -> Value Features Strip):
 *  - Panel 1: Global Status & Styling
 *  - Panel 2: Value Strip Feature Items (with "+ Add Feature" on top, 3-button action row [ Deactivate / Activate ] [ Edit Icon ] [ Trash Icon ] on every item right side, and "Save Changes" on bottom)
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

const ValueStripManagerPage = () => {
  const [globalSettings, setGlobalSettings] = useState({
    is_enabled: 'true',
    background_color: '#3E4930',
    text_color: '#F6F1E3'
  });

  const [items, setItems] = useState([
    { key: 'item_1', title: 'EASY RETURNS', subtitle: 'Shop with confidence & enjoy easy returns. Exchanges are free.', status: 'Active' },
    { key: 'item_2', title: 'SIZE & LENGTH OPTIONS', subtitle: 'We offer dresses in size and lengths.', status: 'Active' },
    { key: 'item_3', title: 'DESIGNED IN LONDON SINCE 2009', subtitle: 'Female-led independent womenswear brand, prioritising small-batch production.', status: 'Active' }
  ]);

  const [savingSettings, setSavingSettings] = useState(false);

  const fetchSettings = () => {
    fetch(`${API}/sections/home_value_strip`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          let meta = {};
          try { meta = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : (data.metadata || {}); } catch(e) {}

          setGlobalSettings({
            is_enabled: meta.is_enabled || 'true',
            background_color: meta.background_color || '#3E4930',
            text_color: meta.text_color || '#F6F1E3'
          });

          if (Array.isArray(meta.items) && meta.items.length > 0) {
            setItems(meta.items);
          }
        }
      })
      .catch(err => console.error("Error fetching value strip settings:", err));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleEditTitle = (key, currentTitle) => {
    const newTitle = window.prompt("Edit feature item title:", currentTitle);
    if (!newTitle || !newTitle.trim()) return;
    setItems(prev => prev.map(item => item.key === key ? { ...item, title: newTitle.trim().toUpperCase() } : item));
  };

  const handleAddMoreItem = () => {
    const title = window.prompt("Enter new value feature title:");
    if (!title || !title.trim()) return;
    const subtitle = window.prompt("Enter new feature description text:") || '';
    const key = `item_${Date.now()}`;
    setItems(prev => [
      ...prev,
      { key, title: title.trim().toUpperCase(), subtitle: subtitle.trim(), status: 'Active' }
    ]);
  };

  const handleSaveSettings = () => {
    setSavingSettings(true);

    const fieldStatuses = {};
    items.forEach(it => {
      fieldStatuses[it.key] = it.status;
    });

    const metaData = {
      is_enabled: globalSettings.is_enabled,
      background_color: globalSettings.background_color,
      text_color: globalSettings.text_color,
      items: items,
      field_statuses: fieldStatuses
    };

    fetch(`${API}/sections/home_value_strip`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Value Features Strip',
        metadata: metaData
      })
    })
      .then(() => alert('Value Features Strip settings saved successfully!'))
      .catch(err => console.error("Error saving value strip settings:", err))
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
            Value Features Strip Settings & Manager
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Configure Homepage value proposition feature items, background colors, and 3-button item controls.
          </p>
        </div>
        <button onClick={handleAddMoreItem} style={{ ...btnP, boxShadow: '0 4px 14px rgba(184,147,91,0.4)' }}>
          + Add Value Feature
        </button>
      </div>

      {/* ── PANEL 1: GLOBAL STYLING & STATUS ──────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px', marginBottom: '4px' }}>PANEL 1</div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
          Value Features Strip Appearance & Status
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={lStyle}>SECTION STATUS</label>
            <select value={globalSettings.is_enabled} onChange={e => setGlobalSettings(s => ({ ...s, is_enabled: e.target.value }))} style={iStyle}>
              <option value="true">Active (Show Strip)</option>
              <option value="false">Disabled (Hide Strip)</option>
            </select>
          </div>
          <div>
            <label style={lStyle}>BACKGROUND COLOR</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="color" value={globalSettings.background_color} onChange={e => setGlobalSettings(s => ({ ...s, background_color: e.target.value }))} style={{ width: '42px', height: '39px', padding: 0, border: '1px solid #B8935B', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#182012' }} />
              <input value={globalSettings.background_color} onChange={e => setGlobalSettings(s => ({ ...s, background_color: e.target.value }))} style={iStyle} placeholder="#3E4930" />
            </div>
          </div>
          <div>
            <label style={lStyle}>TEXT COLOR</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="color" value={globalSettings.text_color} onChange={e => setGlobalSettings(s => ({ ...s, text_color: e.target.value }))} style={{ width: '42px', height: '39px', padding: 0, border: '1px solid #B8935B', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#182012' }} />
              <input value={globalSettings.text_color} onChange={e => setGlobalSettings(s => ({ ...s, text_color: e.target.value }))} style={iStyle} placeholder="#F6F1E3" />
            </div>
          </div>
        </div>
      </div>

      {/* ── PANEL 2: FEATURE ITEMS LIST ───────────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 2</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
              Value Feature Items ({items.length})
            </h3>
          </div>
          <button type="button" onClick={handleAddMoreItem} style={{ ...btnG, border: '1px solid #B8935B', fontWeight: '700' }}>
            + Add More Field
          </button>
        </div>

        {items.map((item) => (
          <div key={item.key} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', width: '100%', marginBottom: '16px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label style={lStyle}>FEATURE TITLE</label>
                <input 
                  value={item.title} 
                  onChange={e => setItems(prev => prev.map(it => it.key === item.key ? { ...it, title: e.target.value } : it))} 
                  style={iStyle} 
                  placeholder="FEATURE TITLE..." 
                />
              </div>
              <div>
                <label style={lStyle}>DESCRIPTION TEXT</label>
                <input 
                  value={item.subtitle} 
                  onChange={e => setItems(prev => prev.map(it => it.key === item.key ? { ...it, subtitle: e.target.value } : it))} 
                  style={iStyle} 
                  placeholder="Enter feature description..." 
                />
              </div>
            </div>

            {/* 3-Button Action Row */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                type="button" 
                onClick={() => setItems(prev => prev.map(it => it.key === item.key ? { ...it, status: it.status === 'Active' ? 'Inactive' : 'Active' } : it))} 
                style={{ 
                  ...btnG, 
                  height: '39px', 
                  padding: '0 16px', 
                  fontWeight: '600',
                  backgroundColor: item.status === 'Active' ? '#3E4930' : 'rgba(239,68,68,0.15)',
                  color: item.status === 'Active' ? '#F6F1E3' : '#EF4444',
                  borderColor: item.status === 'Active' ? '#B8935B' : 'rgba(239,68,68,0.4)'
                }}
              >
                {item.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
              <button 
                type="button" 
                onClick={() => handleEditTitle(item.key, item.title)} 
                style={{ ...btnG, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                title="Edit Feature Title"
              >
                <EditIcon />
              </button>
              <button 
                type="button" 
                onClick={() => setItems(prev => prev.filter(it => it.key !== item.key))} 
                style={{ ...btnD, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                title="Delete Feature"
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

export default ValueStripManagerPage;
