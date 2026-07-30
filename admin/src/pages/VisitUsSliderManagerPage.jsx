import React, { useState, useEffect } from 'react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const cardStyle = { backgroundColor: '#222C1A', borderRadius: '14px', padding: '22px', border: '1px solid rgba(184,147,91,0.25)' };
const btnP = { padding: '9px 18px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnG = { padding: '7px 12px', borderRadius: '6px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer' };
const btnD = { padding: '7px 10px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#EF4444', fontSize: '12px', cursor: 'pointer' };

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
  </svg>
);

const VisitUsSliderManagerPage = () => {
  const [locations, setLocations] = useState([]);
  const [sectionHeader, setSectionHeader] = useState({
    title: 'Prefer to see the fabric in person?',
    subtitle: 'Our studio welcomes visits by appointment.',
    body_content: 'If you\'re not close by, our team is just as happy to guide you over WhatsApp or a call.',
    badge_text: 'VISIT US',
    button_text: 'View Location Details'
  });
  const [loading, setLoading] = useState(true);
  const [savingHeader, setSavingHeader] = useState(false);
  const [savedHeader, setSavedHeader] = useState(false);
  
  // Modal state for adding/editing a controlled location slide
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
    // Fetch overall Section text
    fetch(`${API}/sections/location_visit_us_section`)
      .then(r => r.json())
      .then(data => {
        if (data && data.title) {
          setSectionHeader({
            title: data.title || '',
            subtitle: data.subtitle || '',
            body_content: data.body_content || '',
            badge_text: data.badge_text || 'VISIT US',
            button_text: data.button_text || 'View Location Details'
          });
        }
      })
      .catch(() => {});

    // Fetch Controlled Location Slides
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
    e.preventDefault();
    setSavingHeader(true);
    fetch(`${API}/sections/location_visit_us_section`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sectionHeader)
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

    // Optimistically update UI immediately
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

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#E7D9C9' }}>Loading Visit Us Slider Manager...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '60px' }}>
      
      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', borderRadius: '16px', padding: '24px 28px', border: '1px solid #B8935B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '5px' }}>ABOUT US PAGE</div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#F6F1E3' }}>Visit Us Gallery Slider Manager</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Control section heading, description, and manage as many boutique location slides as you wish.
          </p>
        </div>
        <button onClick={openAddSlide} style={btnP}>+ Add New Location Slide</button>
      </div>

      {/* ── Section Text Customizer ────────────────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>SECTION TEXT CONTENT</span>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Visit Us Section Headlines & CTA Button</h3>
          </div>
          {savedHeader && <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600' }}>Saved!</span>}
          <button onClick={handleSaveHeader} disabled={savingHeader} style={btnP}>
            {savingHeader ? 'Saving...' : 'Save Section Content'}
          </button>
        </div>

        <form onSubmit={handleSaveHeader} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={lStyle}>Section Badge Tag</label>
              <input value={sectionHeader.badge_text} onChange={e => setSectionHeader(p => ({ ...p, badge_text: e.target.value }))} style={iStyle} placeholder="VISIT US" />
            </div>
            <div>
              <label style={lStyle}>"View Location Details" Button Label</label>
              <input value={sectionHeader.button_text} onChange={e => setSectionHeader(p => ({ ...p, button_text: e.target.value }))} style={iStyle} placeholder="View Location Details" />
            </div>
          </div>
          <div>
            <label style={lStyle}>Main Heading Title *</label>
            <input required value={sectionHeader.title} onChange={e => setSectionHeader(p => ({ ...p, title: e.target.value }))} style={iStyle} placeholder="Prefer to see the fabric in person?" />
          </div>
          <div>
            <label style={lStyle}>Subtitle Tagline</label>
            <input value={sectionHeader.subtitle} onChange={e => setSectionHeader(p => ({ ...p, subtitle: e.target.value }))} style={iStyle} placeholder="Our studio welcomes visits by appointment." />
          </div>
          <div>
            <label style={lStyle}>Body Content Description</label>
            <textarea rows={2} value={sectionHeader.body_content} onChange={e => setSectionHeader(p => ({ ...p, body_content: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="If you're not close by, our team is just as happy to guide you over WhatsApp..." />
          </div>
        </form>
      </div>

      {/* ── Controlled Location Slider Cards ───────────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>CONTROLLED BOUTIQUE SLIDES ({locations.length})</span>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Location Cards in the Visit Us Slider</h3>
          </div>
          <button onClick={openAddSlide} style={btnG}>+ Add Location Slide</button>
        </div>

        {locations.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#B8A99A', fontSize: '13px' }}>
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
                    backgroundColor: '#182012',
                    borderRadius: '12px',
                    padding: '18px',
                    border: isLive ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    gap: '14px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#B8935B', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        //{loc.city || 'LOCATION SLIDE'}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        color: isLive ? '#22c55e' : '#EF4444',
                        backgroundColor: isLive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        border: `1px solid ${isLive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                      }}>
                        {isLive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '800', color: '#F6F1E3' }}>{loc.name}</h4>
                    <div style={{ fontSize: '12px', color: '#E7D9C9', lineHeight: '1.5', marginBottom: '8px' }}>{loc.address}</div>
                    
                    {loc.hours && <div style={{ fontSize: '11px', color: '#B8A99A' }}><strong>Hours:</strong> {loc.hours}</div>}
                    {loc.phone && <div style={{ fontSize: '11px', color: '#B8935B', marginTop: '2px' }}><strong>Phone:</strong> {loc.phone}</div>}
                  </div>

                  {/* Slider Connection CTA Button */}
                  <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(184,147,91,0.15)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '600' }}>
                      🔗 Button link connects to: <span style={{ color: '#F6F1E3' }}>/sections/location_detail_page</span>
                    </div>

                    {/* Action Controls matching standard design */}
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleToggleStatus(loc)} style={{ ...btnG, padding: '6px 12px', fontSize: '11px' }}>
                        {isLive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => openEditSlide(loc)} style={{ ...btnG, padding: '6px 10px' }} title="Edit Slide Details"><EditIcon /></button>
                      <button onClick={() => handleDeleteSlide(loc)} style={{ ...btnD, padding: '6px 10px' }} title="Delete Slide"><TrashIcon /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modal to Add/Edit Controlled Slider Location Card ─────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '26px', width: '90%', maxWidth: '520px', border: '1px solid #B8935B', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#F6F1E3' }}>
                {editItem ? 'Edit Location Slide Card' : 'Add New Location Slide Card'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>✕</button>
            </div>

            <form onSubmit={handleSaveSlide} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>City & Country *</label>
                  <input required value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} style={iStyle} placeholder="e.g. Dubai, UAE" />
                </div>
                <div>
                  <label style={lStyle}>Studio Name *</label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={iStyle} placeholder="e.g. Laila Hijabs Boutique" />
                </div>
              </div>

              <div>
                <label style={lStyle}>Full Address *</label>
                <textarea rows={2} required value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="Business Village Block-B, Office 301, Dubai" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>Opening Hours</label>
                  <input value={form.hours} onChange={e => setForm(p => ({ ...p, hours: e.target.value }))} style={iStyle} placeholder="Mon–Sat: 10am–9pm" />
                </div>
                <div>
                  <label style={lStyle}>Phone Number</label>
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={iStyle} placeholder="+971 4 234 5678" />
                </div>
              </div>

              <div>
                <label style={lStyle}>Studio Image URL (Slide Photo)</label>
                <input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} style={iStyle} placeholder="https://... or /hero1.png" />
              </div>

              <div>
                <label style={lStyle}>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={iStyle}>
                  <option value="Live">Live (Active in Slider)</option>
                  <option value="Draft">Draft (Hidden from Slider)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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
