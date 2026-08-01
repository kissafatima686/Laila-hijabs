import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#F6F1E3', border: '1px solid #B8935B', color: '#3E4930', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#3E4930', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const cardStyle = { backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '22px', border: '1px solid #E7D9C9', boxShadow: '0 2px 8px rgba(62,73,48,0.04)' };
const btnP = { padding: '9px 20px', borderRadius: '6px', backgroundColor: '#3E4930', border: 'none', color: '#F6F1E3', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnG = { padding: '7px 12px', borderRadius: '6px', backgroundColor: '#F6F1E3', border: '1px solid #B8935B', color: '#3E4930', fontSize: '12px', fontWeight: '600', cursor: 'pointer' };
const btnD = { padding: '6px 10px', borderRadius: '6px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' };

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

const LocationDetailsEditorPage = () => {
  const [locations, setLocations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({});

  const routerLoc = useLocation();
  const targetId = routerLoc.state?.locationId;

  const fetchLocations = (keepIndex) => {
    setLoading(true);
    fetch(`${API}/module/locations`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setLocations(list);
        if (list.length > 0) {
          let idxToSelect = keepIndex !== undefined ? keepIndex : selectedIndex;
          if (keepIndex === undefined && targetId) {
            const foundIdx = list.findIndex(l => String(l.location_id || l.id) === String(targetId));
            if (foundIdx !== -1) idxToSelect = foundIdx;
          }
          const validIdx = idxToSelect < list.length ? idxToSelect : 0;
          setSelectedIndex(validIdx);
          populateForm(list[validIdx]);
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
      city_active: loc.city_active !== false,
      name: loc.name || '',
      name_active: loc.name_active !== false,
      description: loc.description || '',
      desc_active: loc.desc_active !== false,
      address: loc.address || '',
      address_active: loc.address_active !== false,
      hours: loc.hours || '',
      hours_active: loc.hours_active !== false,
      phone: loc.phone || '',
      phone_active: loc.phone_active !== false,
      email: loc.email || '',
      email_active: loc.email_active !== false,
      map_url: loc.map_url || '',
      map_active: loc.map_active !== false,
      image_url: loc.image_url || '',
      image_active: loc.image_active !== false,
      status: loc.status || 'Live'
    });
  };

  const handleSelectLocation = (idx) => {
    setSelectedIndex(idx);
    populateForm(locations[idx]);
  };

  const saveLocationFormState = (updatedForm) => {
    setForm(updatedForm);
    if (!updatedForm.location_id) return;
    setSaving(true);

    fetch(`${API}/module/locations/${updatedForm.location_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedForm)
    })
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchLocations(selectedIndex);
      })
      .finally(() => setSaving(false));
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    saveLocationFormState(form);
  };

  const toggleLocationField = (fieldKey) => {
    const updated = { ...form, [fieldKey]: form[fieldKey] === false ? true : false };
    saveLocationFormState(updated);
  };

  const handleToggleStatus = () => {
    if (!form.location_id) return;
    const isCurrentlyActive = form.status === 'Live' || form.status === 'Active';
    const nextStatus = isCurrentlyActive ? 'Draft' : 'Live';

    setForm(prev => ({ ...prev, status: nextStatus }));

    fetch(`${API}/module/locations/${form.location_id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    }).then(() => {
      fetchLocations(selectedIndex);
    });
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#3E4930', fontWeight: '600' }}>Loading boutique locations...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '60px' }}>
      
      {/* Header Banner */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px 24px', border: '1px solid #E7D9C9', boxShadow: '0 2px 8px rgba(62,73,48,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px' }}>STORE LOCATIONS & MAPS</div>
          <h2 style={{ margin: '2px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#3E4930' }}>Maps, Hours & Location Details Manager</h2>
        </div>
        {saved && <span style={{ fontSize: '12px', color: '#15803D', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>Saved Location Details!</span>}
      </div>

      {locations.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '14px' }}>No boutique locations found.</div>
          <a href="/locations" style={{ ...btnP, textDecoration: 'none', display: 'inline-block' }}>+ Go To Location Manager</a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
          
          {/* Location Selector Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>SELECT LOCATION CARD</div>
            {locations.map((loc, idx) => {
              const isSelected = idx === selectedIndex;
              const isLive = loc.status === 'Live' || loc.status === 'Active';
              return (
                <div
                  key={loc.location_id || idx}
                  onClick={() => handleSelectLocation(idx)}
                  style={{
                    backgroundColor: isSelected ? '#3E4930' : '#FFFFFF',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    border: `1px solid ${isSelected ? '#3E4930' : '#E7D9C9'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: isSelected ? '#B8935B' : '#3E4930' }}>{loc.city || 'Location'}</span>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      color: isLive ? (isSelected ? '#F6F1E3' : '#15803D') : '#DC2626',
                      backgroundColor: isLive ? (isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(34,197,94,0.15)') : '#FEE2E2'
                    }}>
                      {isLive ? 'Live' : 'Hidden'}
                    </span>
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: isSelected ? '#F6F1E3' : '#3E4930' }}>{loc.name}</div>
                  <div style={{ fontSize: '11px', color: isSelected ? '#E7D9C9' : '#6B7280', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.address}</div>
                </div>
              );
            })}
          </div>

          {/* Location Editor Form */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E7D9C9', paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>EDITING LOCATION DETAILS</span>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#3E4930' }}>{form.name || 'Location Details'} ({form.city})</h3>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleToggleStatus}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '6px',
                    backgroundColor: form.status === 'Live' ? '#FEE2E2' : '#E0E7FF',
                    color: form.status === 'Live' ? '#DC2626' : '#3730A3',
                    border: `1px solid ${form.status === 'Live' ? '#FCA5A5' : '#A5B4FC'}`,
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {form.status === 'Live' ? 'Hide Location' : 'Show Location'}
                </button>
                <button type="button" onClick={handleSave} disabled={saving} style={btnP}>
                  {saving ? 'Saving...' : 'Save Location Details'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <FieldBox label="City & Country *" active={form.city_active} onToggle={() => toggleLocationField('city_active')} onClear={() => setForm(p => ({ ...p, city: '' }))}>
                  <input required value={form.city || ''} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} style={iStyle} placeholder="e.g. Islamabad, Pakistan" />
                </FieldBox>

                <FieldBox label="Studio / Boutique Name *" active={form.name_active} onToggle={() => toggleLocationField('name_active')} onClear={() => setForm(p => ({ ...p, name: '' }))}>
                  <input required value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={iStyle} placeholder="e.g. Laila Hijabs Studio" />
                </FieldBox>
              </div>

              <FieldBox label="Boutique Subtitle / Description" active={form.desc_active} onToggle={() => toggleLocationField('desc_active')} onClear={() => setForm(p => ({ ...p, description: '' }))}>
                <textarea rows={2} value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="Our studio welcomes visits by appointment..." />
              </FieldBox>

              <FieldBox label="Full Address *" active={form.address_active} onToggle={() => toggleLocationField('address_active')} onClear={() => setForm(p => ({ ...p, address: '' }))}>
                <textarea rows={2} required value={form.address || ''} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="Office #22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad" />
              </FieldBox>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <FieldBox label="Opening Hours *" active={form.hours_active} onToggle={() => toggleLocationField('hours_active')} onClear={() => setForm(p => ({ ...p, hours: e.target.value }))}>
                  <input required value={form.hours || ''} onChange={e => setForm(p => ({ ...p, hours: e.target.value }))} style={iStyle} placeholder="Mon–Sat: 11:00 AM – 8:00 PM" />
                </FieldBox>

                <FieldBox label="Phone & Support *" active={form.phone_active} onToggle={() => toggleLocationField('phone_active')} onClear={() => setForm(p => ({ ...p, phone: e.target.value }))}>
                  <input required value={form.phone || ''} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={iStyle} placeholder="+92 323 8399480" />
                </FieldBox>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <FieldBox label="Email Address *" active={form.email_active} onToggle={() => toggleLocationField('email_active')} onClear={() => setForm(p => ({ ...p, email: e.target.value }))}>
                  <input required type="email" value={form.email || ''} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={iStyle} placeholder="info@lailahijabs.com" />
                </FieldBox>

                <ImageUploaderBox label="Boutique Location Photo" value={form.image_url} onChange={val => setForm(p => ({ ...p, image_url: val }))} active={form.image_active} onToggle={() => toggleLocationField('image_active')} onClear={() => setForm(p => ({ ...p, image_url: '' }))} />
              </div>

              <FieldBox label="Find Us on Google Maps (Embed URL & Preview)" active={form.map_active} onToggle={() => toggleLocationField('map_active')} onClear={() => setForm(p => ({ ...p, map_url: '' }))}>
                <textarea rows={2} value={form.map_url || ''} onChange={e => setForm(p => ({ ...p, map_url: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="https://www.google.com/maps/embed?pb=..." />
                {(form.map_url || form.address) && (
                  <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E7D9C9', height: '180px', backgroundColor: '#F6F1E3' }}>
                    <iframe
                      title="Google Map Preview"
                      src={form.map_url || `https://maps.google.com/maps?q=${encodeURIComponent(form.address || 'Pakistan')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>
                )}
              </FieldBox>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" disabled={saving} style={{ ...btnP, padding: '12px 26px', fontSize: '14px' }}>
                  {saving ? 'Saving...' : 'Save Location Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDetailsEditorPage;
