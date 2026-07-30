import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api/admin';

const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const cardStyle = { backgroundColor: '#222C1A', borderRadius: '14px', padding: '22px', border: '1px solid rgba(184,147,91,0.25)' };
const btnP = { padding: '9px 18px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };

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

const LocationDetailsEditorPage = () => {
  const [locations, setLocations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({});

  const fetchLocations = () => {
    setLoading(true);
    fetch(`${API}/module/locations`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setLocations(list);
        if (list.length > 0) {
          populateForm(list[0]);
        }
      })
      .catch(() => setLocations([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const populateForm = (loc) => {
    if (!loc) return;
    setForm({
      location_id: loc.location_id || loc.id,
      city: loc.city || '',
      name: loc.name || '',
      description: loc.description || '',
      address: loc.address || '',
      hours: loc.hours || '',
      phone: loc.phone || '',
      email: loc.email || '',
      map_url: loc.map_url || '',
      status: loc.status || 'Live'
    });
  };

  const handleSelectLocation = (idx) => {
    setSelectedIndex(idx);
    populateForm(locations[idx]);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.location_id) return;
    setSaving(true);

    fetch(`${API}/module/locations/${form.location_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchLocations();
      })
      .finally(() => setSaving(false));
  };

  const handleToggleStatus = () => {
    if (!form.location_id) return;
    const nextStatus = form.status === 'Live' ? 'Draft' : 'Live';
    fetch(`${API}/module/locations/${form.location_id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    }).then(() => {
      setForm(prev => ({ ...prev, status: nextStatus }));
      fetchLocations();
    });
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#E7D9C9' }}>Loading boutique locations...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', borderRadius: '16px', padding: '24px 28px', border: '1px solid #B8935B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '5px' }}>STORE LOCATIONS SLIDER</div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#F6F1E3' }}>Maps, Hours & Contact Details Editor</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Select any location slider card to edit its address, hours, phone, email, and Google Maps embed.
          </p>
        </div>
        {saved && <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600', padding: '7px 14px', borderRadius: '8px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>Saved Location Details!</span>}
      </div>

      {locations.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '14px', color: '#E7D9C9', marginBottom: '14px' }}>No boutique locations found.</div>
          <a href="/locations" style={{ ...btnP, textDecoration: 'none', display: 'inline-block' }}>+ Go To Location Manager</a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
          
          {/* Location Selector Sidebar / Slider Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>SELECT LOCATION SLIDER CARD</div>
            {locations.map((loc, idx) => {
              const isSelected = idx === selectedIndex;
              const isLive = loc.status === 'Live' || loc.status === 'Active';
              return (
                <div
                  key={loc.location_id || idx}
                  onClick={() => handleSelectLocation(idx)}
                  style={{
                    backgroundColor: isSelected ? '#3E4930' : '#222C1A',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    border: isSelected ? '1px solid #B8935B' : '1px solid rgba(184,147,91,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#B8935B' }}>{loc.city || 'Location'}</span>
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
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#F6F1E3' }}>{loc.name}</div>
                  <div style={{ fontSize: '11px', color: '#B8A99A', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.address}</div>
                </div>
              );
            })}
          </div>

          {/* Location Editor Form & Map Preview */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>EDITING LOCATION SLIDER DETAILS</span>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#F6F1E3' }}>{form.name || 'Location Details'} ({form.city})</h3>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleToggleStatus}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    backgroundColor: form.status === 'Live' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
                    color: form.status === 'Live' ? '#EF4444' : '#22c55e',
                    border: `1px solid ${form.status === 'Live' ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {form.status === 'Live' ? 'Deactivate Location' : 'Activate Location'}
                </button>
                <button type="button" onClick={handleSave} disabled={saving} style={btnP}>
                  {saving ? 'Saving...' : 'Save Location Details'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Section Titles Customizer */}
              <div style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: '1px solid #B8935B' }}>
                <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px', marginBottom: '10px' }}>DYNAMIC SECTION HEADINGS & FIELD LABELS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={lStyle}>"Location & Contact Details" Heading</label>
                    <input value={form.section_contact_label || 'Location & Contact Details'} onChange={e => setForm(p => ({ ...p, section_contact_label: e.target.value }))} style={iStyle} />
                  </div>
                  <div>
                    <label style={lStyle}>"Find Us on Google Maps" Heading</label>
                    <input value={form.map_section_label || 'Find Us on Google Maps'} onChange={e => setForm(p => ({ ...p, map_section_label: e.target.value }))} style={iStyle} />
                  </div>
                  <div>
                    <label style={lStyle}>"FULL ADDRESS" Label</label>
                    <input value={form.full_address_label || 'FULL ADDRESS'} onChange={e => setForm(p => ({ ...p, full_address_label: e.target.value }))} style={iStyle} />
                  </div>
                  <div>
                    <label style={lStyle}>"OPENING HOURS" Label</label>
                    <input value={form.opening_hours_label || 'OPENING HOURS'} onChange={e => setForm(p => ({ ...p, opening_hours_label: e.target.value }))} style={iStyle} />
                  </div>
                  <div>
                    <label style={lStyle}>"PHONE & SUPPORT" Label</label>
                    <input value={form.phone_label || 'PHONE & SUPPORT'} onChange={e => setForm(p => ({ ...p, phone_label: e.target.value }))} style={iStyle} />
                  </div>
                  <div>
                    <label style={lStyle}>"EMAIL ADDRESS" Label</label>
                    <input value={form.email_label || 'EMAIL ADDRESS'} onChange={e => setForm(p => ({ ...p, email_label: e.target.value }))} style={iStyle} />
                  </div>
                </div>
              </div>

              {/* Field 1: City & Country */}
              <div style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: form.city_active !== false ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={lStyle}>City & Country *</label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button type="button" onClick={() => setForm(p => ({ ...p, city_active: p.city_active === false ? true : false }))} style={{ height: '32px', padding: '0 12px', borderRadius: '8px', backgroundColor: form.city_active !== false ? '#182012' : 'rgba(239,68,68,0.15)', color: form.city_active !== false ? '#F6F1E3' : '#EF4444', border: form.city_active !== false ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                      {form.city_active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button type="button" onClick={handleSave} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid #B8935B', color: '#F6F1E3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><EditIcon /></button>
                    <button type="button" onClick={() => setForm(p => ({ ...p, city: '' }))} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><TrashIcon /></button>
                  </div>
                </div>
                <input required value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} style={{ ...iStyle, color: form.city_active !== false ? '#F6F1E3' : '#888' }} placeholder="e.g. Dubai, UAE" />
              </div>

              {/* Field 2: Studio / Boutique Name */}
              <div style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: form.name_active !== false ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={lStyle}>Studio / Boutique Name *</label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button type="button" onClick={() => setForm(p => ({ ...p, name_active: p.name_active === false ? true : false }))} style={{ height: '32px', padding: '0 12px', borderRadius: '8px', backgroundColor: form.name_active !== false ? '#182012' : 'rgba(239,68,68,0.15)', color: form.name_active !== false ? '#F6F1E3' : '#EF4444', border: form.name_active !== false ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                      {form.name_active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button type="button" onClick={handleSave} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid #B8935B', color: '#F6F1E3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><EditIcon /></button>
                    <button type="button" onClick={() => setForm(p => ({ ...p, name: '' }))} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><TrashIcon /></button>
                  </div>
                </div>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={{ ...iStyle, color: form.name_active !== false ? '#F6F1E3' : '#888' }} placeholder="e.g. Laila Hijabs Boutique & Experience Center" />
              </div>

              {/* Field 3: Boutique Subtitle / Description */}
              <div style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: form.desc_active !== false ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={lStyle}>Boutique Subtitle / Description</label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button type="button" onClick={() => setForm(p => ({ ...p, desc_active: p.desc_active === false ? true : false }))} style={{ height: '32px', padding: '0 12px', borderRadius: '8px', backgroundColor: form.desc_active !== false ? '#182012' : 'rgba(239,68,68,0.15)', color: form.desc_active !== false ? '#F6F1E3' : '#EF4444', border: form.desc_active !== false ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                      {form.desc_active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button type="button" onClick={handleSave} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid #B8935B', color: '#F6F1E3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><EditIcon /></button>
                    <button type="button" onClick={() => setForm(p => ({ ...p, description: '' }))} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><TrashIcon /></button>
                  </div>
                </div>
                <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ ...iStyle, resize: 'vertical', color: form.desc_active !== false ? '#F6F1E3' : '#888' }} placeholder="Our Dubai boutique offers an exclusive selection of luxury modest wear..." />
              </div>

              {/* Field 4: Full Address */}
              <div style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: form.address_active !== false ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={lStyle}>Full Address *</label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button type="button" onClick={() => setForm(p => ({ ...p, address_active: p.address_active === false ? true : false }))} style={{ height: '32px', padding: '0 12px', borderRadius: '8px', backgroundColor: form.address_active !== false ? '#182012' : 'rgba(239,68,68,0.15)', color: form.address_active !== false ? '#F6F1E3' : '#EF4444', border: form.address_active !== false ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                      {form.address_active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button type="button" onClick={handleSave} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid #B8935B', color: '#F6F1E3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><EditIcon /></button>
                    <button type="button" onClick={() => setForm(p => ({ ...p, address: '' }))} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><TrashIcon /></button>
                  </div>
                </div>
                <textarea rows={2} required value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} style={{ ...iStyle, resize: 'vertical', color: form.address_active !== false ? '#F6F1E3' : '#888' }} placeholder="Business Village Block-B, 3rd Floor, Office 301, Deira, Dubai, UAE" />
              </div>

              {/* Field 5: Opening Hours */}
              <div style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: form.hours_active !== false ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={lStyle}>Opening Hours *</label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button type="button" onClick={() => setForm(p => ({ ...p, hours_active: p.hours_active === false ? true : false }))} style={{ height: '32px', padding: '0 12px', borderRadius: '8px', backgroundColor: form.hours_active !== false ? '#182012' : 'rgba(239,68,68,0.15)', color: form.hours_active !== false ? '#F6F1E3' : '#EF4444', border: form.hours_active !== false ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                      {form.hours_active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button type="button" onClick={handleSave} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid #B8935B', color: '#F6F1E3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><EditIcon /></button>
                    <button type="button" onClick={() => setForm(p => ({ ...p, hours: '' }))} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><TrashIcon /></button>
                  </div>
                </div>
                <input required value={form.hours} onChange={e => setForm(p => ({ ...p, hours: e.target.value }))} style={{ ...iStyle, color: form.hours_active !== false ? '#F6F1E3' : '#888' }} placeholder="Sunday – Friday: 10:00 AM – 9:00 PM" />
              </div>

              {/* Field 6: Phone & Support */}
              <div style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: form.phone_active !== false ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={lStyle}>Phone & Support *</label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button type="button" onClick={() => setForm(p => ({ ...p, phone_active: p.phone_active === false ? true : false }))} style={{ height: '32px', padding: '0 12px', borderRadius: '8px', backgroundColor: form.phone_active !== false ? '#182012' : 'rgba(239,68,68,0.15)', color: form.phone_active !== false ? '#F6F1E3' : '#EF4444', border: form.phone_active !== false ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                      {form.phone_active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button type="button" onClick={handleSave} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid #B8935B', color: '#F6F1E3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><EditIcon /></button>
                    <button type="button" onClick={() => setForm(p => ({ ...p, phone: '' }))} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><TrashIcon /></button>
                  </div>
                </div>
                <input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={{ ...iStyle, color: form.phone_active !== false ? '#F6F1E3' : '#888' }} placeholder="+971 4 234 5678" />
              </div>

              {/* Field 7: Email Address */}
              <div style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: form.email_active !== false ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={lStyle}>Email Address *</label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button type="button" onClick={() => setForm(p => ({ ...p, email_active: p.email_active === false ? true : false }))} style={{ height: '32px', padding: '0 12px', borderRadius: '8px', backgroundColor: form.email_active !== false ? '#182012' : 'rgba(239,68,68,0.15)', color: form.email_active !== false ? '#F6F1E3' : '#EF4444', border: form.email_active !== false ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                      {form.email_active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button type="button" onClick={handleSave} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid #B8935B', color: '#F6F1E3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><EditIcon /></button>
                    <button type="button" onClick={() => setForm(p => ({ ...p, email: '' }))} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><TrashIcon /></button>
                  </div>
                </div>
                <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={{ ...iStyle, color: form.email_active !== false ? '#F6F1E3' : '#888' }} placeholder="dubai@lailahijabs.com" />
              </div>

              {/* Field 8: Google Maps Embed URL */}
              <div style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: form.map_active !== false ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={lStyle}>Google Maps Embed URL / Embed Code</label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button type="button" onClick={() => setForm(p => ({ ...p, map_active: p.map_active === false ? true : false }))} style={{ height: '32px', padding: '0 12px', borderRadius: '8px', backgroundColor: form.map_active !== false ? '#182012' : 'rgba(239,68,68,0.15)', color: form.map_active !== false ? '#F6F1E3' : '#EF4444', border: form.map_active !== false ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                      {form.map_active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button type="button" onClick={handleSave} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid #B8935B', color: '#F6F1E3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><EditIcon /></button>
                    <button type="button" onClick={() => setForm(p => ({ ...p, map_url: '' }))} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><TrashIcon /></button>
                  </div>
                </div>
                <textarea rows={2} value={form.map_url} onChange={e => setForm(p => ({ ...p, map_url: e.target.value }))} style={{ ...iStyle, resize: 'vertical', color: form.map_active !== false ? '#F6F1E3' : '#888' }} placeholder="https://www.google.com/maps/embed?pb=..." />
              </div>

              {/* Field 9: Book Visit on WhatsApp Button */}
              <div style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: form.whatsapp_btn_active !== false ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={lStyle}>WhatsApp Button Text & WhatsApp Number</label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button type="button" onClick={() => setForm(p => ({ ...p, whatsapp_btn_active: p.whatsapp_btn_active === false ? true : false }))} style={{ height: '32px', padding: '0 12px', borderRadius: '8px', backgroundColor: form.whatsapp_btn_active !== false ? '#182012' : 'rgba(239,68,68,0.15)', color: form.whatsapp_btn_active !== false ? '#F6F1E3' : '#EF4444', border: form.whatsapp_btn_active !== false ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                      {form.whatsapp_btn_active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button type="button" onClick={handleSave} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid #B8935B', color: '#F6F1E3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><EditIcon /></button>
                    <button type="button" onClick={() => setForm(p => ({ ...p, whatsapp_btn_text: '' }))} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><TrashIcon /></button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input value={form.whatsapp_btn_text || 'BOOK VISIT ON WHATSAPP'} onChange={e => setForm(p => ({ ...p, whatsapp_btn_text: e.target.value }))} style={iStyle} placeholder="BOOK VISIT ON WHATSAPP" />
                  <input value={form.whatsapp || ''} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))} style={iStyle} placeholder="WhatsApp Number (e.g. 97142345678)" />
                </div>
              </div>

              {/* Field 10: Get Directions Button */}
              <div style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: form.directions_btn_active !== false ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={lStyle}>Get Directions Button Text & Map Directions Link</label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button type="button" onClick={() => setForm(p => ({ ...p, directions_btn_active: p.directions_btn_active === false ? true : false }))} style={{ height: '32px', padding: '0 12px', borderRadius: '8px', backgroundColor: form.directions_btn_active !== false ? '#182012' : 'rgba(239,68,68,0.15)', color: form.directions_btn_active !== false ? '#F6F1E3' : '#EF4444', border: form.directions_btn_active !== false ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                      {form.directions_btn_active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button type="button" onClick={handleSave} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid #B8935B', color: '#F6F1E3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><EditIcon /></button>
                    <button type="button" onClick={() => setForm(p => ({ ...p, directions_url: '' }))} style={{ height: '32px', width: '32px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><TrashIcon /></button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input value={form.directions_btn_text || 'GET DIRECTIONS'} onChange={e => setForm(p => ({ ...p, directions_btn_text: e.target.value }))} style={iStyle} placeholder="GET DIRECTIONS" />
                  <input value={form.directions_url || ''} onChange={e => setForm(p => ({ ...p, directions_url: e.target.value }))} style={iStyle} placeholder="Google Maps Link URL" />
                </div>
              </div>

              {/* Live Card Preview matching exact screenshot */}
              <div style={{ marginTop: '10px', padding: '20px', borderRadius: '12px', backgroundColor: '#FDFBF7', border: '1px solid #B8935B' }}>
                <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1px', marginBottom: '10px' }}>LIVE LOCATION PAGE PREVIEW</div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', textTransform: 'uppercase' }}>//{form.city}</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#1A2010', margin: '4px 0 6px 0' }}>{form.name}</div>
                <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.5', marginBottom: '14px' }}>{form.description}</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>Full Address</div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#222', marginTop: '2px' }}>{form.address}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>Opening Hours</div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#222', marginTop: '2px' }}>{form.hours}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>Phone & Support</div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#B8935B', marginTop: '2px' }}>{form.phone}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>Email Address</div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#B8935B', marginTop: '2px' }}>{form.email}</div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDetailsEditorPage;
