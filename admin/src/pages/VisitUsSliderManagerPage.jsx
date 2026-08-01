import React, { useState, useEffect } from 'react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#F6F1E3', border: '1px solid #B8935B', color: '#3E4930', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#3E4930', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const cardStyle = { backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '22px', border: '1px solid #E7D9C9', boxShadow: '0 2px 8px rgba(62,73,48,0.04)' };
const btnP = { padding: '9px 20px', borderRadius: '6px', backgroundColor: '#3E4930', border: 'none', color: '#F6F1E3', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnG = { padding: '7px 12px', borderRadius: '6px', backgroundColor: '#F6F1E3', border: '1px solid #B8935B', color: '#3E4930', fontSize: '12px', fontWeight: '600', cursor: 'pointer' };
const btnD = { padding: '6px 10px', borderRadius: '6px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' };

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
);

const FieldBox = ({ label, children, active = true, onToggle, onClear }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', opacity: active !== false ? 1 : 0.6, transition: 'opacity 0.2s' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <label style={lStyle}>{label}</label>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <span style={{
          fontSize: '10px', padding: '2px 8px', borderRadius: '8px', fontWeight: '700',
          color: active !== false ? '#15803D' : '#6B7280',
          backgroundColor: active !== false ? 'rgba(34,197,94,0.15)' : '#E7D9C9',
          border: `1px solid ${active !== false ? 'rgba(34,197,94,0.3)' : '#B8935B'}`
        }}>
          {active !== false ? 'Live' : 'Hidden'}
        </span>

        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            style={{
              padding: '3px 8px',
              borderRadius: '4px',
              backgroundColor: active !== false ? '#FEE2E2' : '#E0E7FF',
              border: active !== false ? '1px solid #FCA5A5' : '1px solid #A5B4FC',
              color: active !== false ? '#DC2626' : '#3730A3',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {active !== false ? 'Hide' : 'Show'}
          </button>
        )}
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            style={{ ...btnD, padding: '3px 6px' }}
            title="Delete Content"
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </div>
    <div>
      {children}
    </div>
  </div>
);

const ImageUploaderBox = ({ label, value, onChange, active = true, onToggle, onClear }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      fetch(`${API}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      })
        .then(r => r.json())
        .then(data => {
          if (data.imageUrl) {
            onChange(data.imageUrl);
          }
        })
        .catch(err => console.error("Upload failed", err))
        .finally(() => setUploading(false));
    };
    reader.readAsDataURL(file);
  };

  return (
    <FieldBox label={label} active={active} onToggle={onToggle} onClear={onClear}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            style={{ ...iStyle, flex: 1 }}
            placeholder="/hero1.png or image URL"
          />
          <label style={{
            padding: '8px 14px',
            borderRadius: '6px',
            backgroundColor: '#3E4930',
            color: '#F6F1E3',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {uploading ? 'Uploading...' : '📁 Upload Image'}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>

        {value && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E7D9C9' }}>
            <img
              src={value.startsWith('http') ? value : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${value.startsWith('/') ? '' : '/'}${value}`}
              alt="Preview"
              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #E7D9C9' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span style={{ fontSize: '11px', color: '#B8935B', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {value}
            </span>
          </div>
        )}
      </div>
    </FieldBox>
  );
};

const VisitUsSliderManagerPage = () => {
  const [locations, setLocations] = useState([]);
  const [sectionHeader, setSectionHeader] = useState({
    title: 'Prefer to see the fabric in person?',
    subtitle: 'Our studio welcomes visits by appointment.',
    body_content: 'If you\'re not close by, our team is just as happy to guide you over WhatsApp or a call.',
    badge_text: 'VISIT US',
    button_text: 'View Location Details',
    sec_active: true,
    slider_sec_active: true
  });
  const [loading, setLoading] = useState(true);
  const [savingHeader, setSavingHeader] = useState(false);
  const [savedHeader, setSavedHeader] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    name: '',
    city: '',
    address: '',
    hours: '',
    phone: '',
    email: '',
    image_url: '',
    status: 'Live'
  });

  const fetchSectionData = () => {
    setLoading(true);
    fetch(`${API}/sections/location_visit_us_section`)
      .then(r => r.json())
      .then(data => {
        if (data && data.title) {
          const meta = data.metadata || {};
          setSectionHeader({
            title: data.title || '',
            subtitle: data.subtitle || '',
            body_content: data.body_content || '',
            badge_text: data.badge_text || 'VISIT US',
            button_text: data.button_text || 'View Location Details',
            sec_active: meta.sec_active !== false,
            slider_sec_active: meta.slider_sec_active !== false
          });
        }
      })
      .catch(() => {});

    fetch(`${API}/module/locations`)
      .then(r => r.json())
      .then(data => {
        setLocations(Array.isArray(data) ? data : []);
      })
      .catch(() => setLocations([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSectionData();
  }, []);

  const handleSaveHeader = (e) => {
    if (e) e.preventDefault();
    setSavingHeader(true);
    fetch(`${API}/sections/location_visit_us_section`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: sectionHeader.title,
        subtitle: sectionHeader.subtitle,
        body_content: sectionHeader.body_content,
        badge_text: sectionHeader.badge_text,
        button_text: sectionHeader.button_text,
        metadata: {
          sec_active: sectionHeader.sec_active,
          slider_sec_active: sectionHeader.slider_sec_active
        }
      })
    })
      .then(() => {
        setSavedHeader(true);
        setTimeout(() => setSavedHeader(false), 3000);
      })
      .finally(() => setSavingHeader(false));
  };

  const openAddSlide = () => {
    setForm({
      name: '',
      city: '',
      address: '',
      hours: '',
      phone: '',
      email: '',
      image_url: '',
      status: 'Live'
    });
    setEditItem(null);
    setShowModal(true);
  };

  const openEditSlide = (item) => {
    setForm({
      name: item.name || '',
      city: item.city || '',
      address: item.address || '',
      hours: item.hours || '',
      phone: item.phone || '',
      email: item.email || '',
      image_url: item.image_url || '',
      status: item.status || 'Live'
    });
    setEditItem(item);
    setShowModal(true);
  };

  const handleSaveSlide = (e) => {
    e.preventDefault();
    const id = editItem ? (editItem.location_id || editItem.id) : null;
    const url = id ? `${API}/module/locations/${id}` : `${API}/module/locations`;

    fetch(url, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(() => {
        setShowModal(false);
        fetchSectionData();
      });
  };

  const handleToggleStatus = (item) => {
    const id = item.location_id || item.id;
    const isCurrentlyActive = item.status === 'Live' || item.status === 'Active';
    const nextStatus = isCurrentlyActive ? 'Draft' : 'Live';

    setLocations(prev => prev.map(l => {
      const lid = l.location_id || l.id;
      if (String(lid) === String(id)) {
        return { ...l, status: nextStatus };
      }
      return l;
    }));

    fetch(`${API}/module/locations/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    })
      .then(r => r.json())
      .then(() => fetchSectionData())
      .catch(() => fetchSectionData());
  };

  const handleDeleteSlide = (item) => {
    if (!window.confirm(`Delete "${item.name}" slider location card?`)) return;
    const id = item.location_id || item.id;
    fetch(`${API}/module/locations/${id}`, { method: 'DELETE' }).then(fetchSectionData);
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#3E4930', fontWeight: '600' }}>Loading Visit Us Slider Manager...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '60px' }}>
      
      {/* Header Banner */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px 24px', border: '1px solid #E7D9C9', boxShadow: '0 2px 8px rgba(62,73,48,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px' }}>STORE LOCATIONS & VISIT US</div>
          <h2 style={{ margin: '2px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#3E4930' }}>Visit Us Gallery Slider & Location Manager</h2>
        </div>
        <button onClick={openAddSlide} style={btnP}>+ Add New Location Slide</button>
      </div>

      {/* Section Text Customizer */}
      <div style={{ ...cardStyle, border: sectionHeader.sec_active !== false ? '1px solid #E7D9C9' : '1px solid #FCA5A5', opacity: sectionHeader.sec_active !== false ? 1 : 0.65 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E7D9C9', paddingBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>SECTION TEXT CONTENT</span>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#3E4930' }}>Visit Us Section Headlines & CTA Button</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setSectionHeader(p => ({ ...p, sec_active: !p.sec_active }))}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                backgroundColor: sectionHeader.sec_active !== false ? '#FEE2E2' : '#E0E7FF',
                color: sectionHeader.sec_active !== false ? '#DC2626' : '#3730A3',
                border: sectionHeader.sec_active !== false ? '1px solid #FCA5A5' : '1px solid #A5B4FC',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {sectionHeader.sec_active !== false ? 'Hide Section' : 'Show Section'}
            </button>
            {savedHeader && <span style={{ fontSize: '12px', color: '#15803D', fontWeight: '600' }}>Saved!</span>}
            <button onClick={handleSaveHeader} disabled={savingHeader} style={btnP}>
              {savingHeader ? 'Saving...' : 'Save Section Content'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveHeader} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <FieldBox label="Section Badge Tag" active={sectionHeader.badge_active} onToggle={() => setSectionHeader(p => ({ ...p, badge_active: p.badge_active === false ? true : false }))} onClear={() => setSectionHeader(p => ({ ...p, badge_text: '' }))}>
              <input value={sectionHeader.badge_text} onChange={e => setSectionHeader(p => ({ ...p, badge_text: e.target.value }))} style={iStyle} placeholder="VISIT US" />
            </FieldBox>
            <FieldBox label='"View Location Details" Button Label' active={sectionHeader.button_active} onToggle={() => setSectionHeader(p => ({ ...p, button_active: p.button_active === false ? true : false }))} onClear={() => setSectionHeader(p => ({ ...p, button_text: '' }))}>
              <input value={sectionHeader.button_text} onChange={e => setSectionHeader(p => ({ ...p, button_text: e.target.value }))} style={iStyle} placeholder="View Location Details" />
            </FieldBox>
          </div>
          <FieldBox label="Main Heading Title *" active={sectionHeader.title_active} onToggle={() => setSectionHeader(p => ({ ...p, title_active: p.title_active === false ? true : false }))} onClear={() => setSectionHeader(p => ({ ...p, title: '' }))}>
            <input required value={sectionHeader.title} onChange={e => setSectionHeader(p => ({ ...p, title: e.target.value }))} style={iStyle} placeholder="Prefer to see the fabric in person?" />
          </FieldBox>
          <FieldBox label="Subtitle Tagline" active={sectionHeader.subtitle_active} onToggle={() => setSectionHeader(p => ({ ...p, subtitle_active: p.subtitle_active === false ? true : false }))} onClear={() => setSectionHeader(p => ({ ...p, subtitle: '' }))}>
            <input value={sectionHeader.subtitle} onChange={e => setSectionHeader(p => ({ ...p, subtitle: e.target.value }))} style={iStyle} placeholder="Our studio welcomes visits by appointment." />
          </FieldBox>
          <FieldBox label="Body Content Description" active={sectionHeader.body_active} onToggle={() => setSectionHeader(p => ({ ...p, body_active: p.body_active === false ? true : false }))} onClear={() => setSectionHeader(p => ({ ...p, body_content: '' }))}>
            <textarea rows={2} value={sectionHeader.body_content} onChange={e => setSectionHeader(p => ({ ...p, body_content: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="If you're not close by, our team is just as happy to guide you over WhatsApp..." />
          </FieldBox>
        </form>
      </div>

      {/* Controlled Location Slider Cards */}
      <div style={{ ...cardStyle, border: sectionHeader.slider_sec_active !== false ? '1px solid #E7D9C9' : '1px solid #FCA5A5', opacity: sectionHeader.slider_sec_active !== false ? 1 : 0.65 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #E7D9C9', paddingBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>CONTROLLED BOUTIQUE SLIDES ({locations.length})</span>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#3E4930' }}>Location Cards in the Visit Us Slider</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setSectionHeader(p => ({ ...p, slider_sec_active: !p.slider_sec_active }))}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                backgroundColor: sectionHeader.slider_sec_active !== false ? '#FEE2E2' : '#E0E7FF',
                color: sectionHeader.slider_sec_active !== false ? '#DC2626' : '#3730A3',
                border: sectionHeader.slider_sec_active !== false ? '1px solid #FCA5A5' : '1px solid #A5B4FC',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {sectionHeader.slider_sec_active !== false ? 'Hide Section' : 'Show Section'}
            </button>
            <button onClick={openAddSlide} style={btnG}>+ Add Location Slide</button>
          </div>
        </div>

        {locations.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
            No location cards added yet. Click "+ Add New Location Slide" above to create your first slider card.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {locations.map((loc, idx) => {
              const isLive = loc.status === 'Live' || loc.status === 'Active';
              return (
                <div
                  key={loc.location_id || idx}
                  style={{
                    backgroundColor: '#F6F1E3',
                    borderRadius: '8px',
                    padding: '18px',
                    border: '1px solid #E7D9C9',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    gap: '14px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#B8935B', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        {loc.city || 'LOCATION SLIDE'}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        color: isLive ? '#15803D' : '#6B7280',
                        backgroundColor: isLive ? 'rgba(34,197,94,0.15)' : '#E7D9C9'
                      }}>
                        {isLive ? 'Live' : 'Hidden'}
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '800', color: '#3E4930' }}>{loc.name}</h4>
                    <div style={{ fontSize: '12px', color: '#3E4930', lineHeight: '1.5', marginBottom: '8px' }}>{loc.address}</div>
                    
                    {loc.hours && <div style={{ fontSize: '11px', color: '#6B7280' }}><strong>Hours:</strong> {loc.hours}</div>}
                    {loc.phone && <div style={{ fontSize: '11px', color: '#B8935B', marginTop: '2px' }}><strong>Phone:</strong> {loc.phone}</div>}
                  </div>

                  {/* Action Controls matching standard design */}
                  <div style={{ paddingTop: '10px', borderTop: '1px solid #E7D9C9', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleToggleStatus(loc)} style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: isLive ? '#FEE2E2' : '#E0E7FF', color: isLive ? '#DC2626' : '#3730A3', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                      {isLive ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => openEditSlide(loc)} style={{ ...btnG, padding: '4px 8px' }} title="Edit Slide Details"><EditIcon /></button>
                    <button onClick={() => handleDeleteSlide(loc)} style={{ ...btnD, padding: '4px 8px' }} title="Delete Slide"><TrashIcon /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal to Add/Edit Controlled Slider Location Card */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '540px', border: '1px solid #E7D9C9', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #E7D9C9', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#3E4930' }}>
                {editItem ? 'Edit Location Slide Card' : 'Add New Location Slide Card'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#3E4930', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>✕</button>
            </div>

            <form onSubmit={handleSaveSlide} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>City & Country *</label>
                  <input required value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} style={iStyle} placeholder="e.g. Islamabad, Pakistan" />
                </div>
                <div>
                  <label style={lStyle}>Studio Name *</label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={iStyle} placeholder="e.g. Laila Hijabs Studio" />
                </div>
              </div>

              <div>
                <label style={lStyle}>Full Address *</label>
                <textarea rows={2} required value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="Office #22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>Opening Hours</label>
                  <input value={form.hours} onChange={e => setForm(p => ({ ...p, hours: e.target.value }))} style={iStyle} placeholder="Mon–Sat: 11am–8pm" />
                </div>
                <div>
                  <label style={lStyle}>Phone Number</label>
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={iStyle} placeholder="+92 323 8399480" />
                </div>
              </div>

              <ImageUploaderBox label="Studio Photo (Slide Image)" value={form.image_url} onChange={val => setForm(p => ({ ...p, image_url: val }))} />

              <div>
                <label style={lStyle}>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={iStyle}>
                  <option value="Live">Live (Active in Slider)</option>
                  <option value="Draft">Draft (Hidden from Slider)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid #E7D9C9', paddingTop: '14px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnG}>Cancel</button>
                <button type="submit" style={btnP}>{editItem ? 'Update Slide' : 'Add Slide Card'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default VisitUsSliderManagerPage;
