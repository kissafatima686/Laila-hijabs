import React, { useState, useEffect } from 'react';

/**
 * Customer Testimonials Settings & Manager Page (Under Dynamic Showcase -> Customer Testimonials):
 *  - Panel 1: Section Header Settings (Section Title, Subtitle, Active/Disabled status)
 *  - Panel 2: Customer Testimonials Cards (with "+ Add Testimonial" on top, 3-button action row [ Deactivate / Activate ] [ Edit Icon ] [ Trash Icon ] on every review)
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

const StarRating = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: '4px' }}>
    {[1, 2, 3, 4, 5].map(n => (
      <span
        key={n} 
        onClick={() => onChange && onChange(n)}
        style={{ fontSize: '18px', cursor: onChange ? 'pointer' : 'default', color: n <= value ? '#B8935B' : 'rgba(184,147,91,0.25)' }}
      >
        ★
      </span>
    ))}
  </div>
);

const EMPTY = { customer_name: '', customer_location: '', rating: 5, review_text: '', product_bought: '', status: 'Live', display_order: 0, avatar_url: '' };

const TestimonialsPage = () => {
  // Panel 1 Section Header Settings
  const [sectionSettings, setSectionSettings] = useState({
    title: 'WHAT OUR CUSTOMERS SAY',
    subtitle: 'Real reviews from verified buyers across Pakistan & worldwide',
    is_enabled: 'true'
  });
  const [savingSection, setSavingSection] = useState(false);

  // Panel 2 Testimonials List
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [saving, setSaving] = useState(false);

  const fetchSectionSettings = () => {
    fetch(`${API}/sections/home_testimonials_section`)
      .then(r => r.json())
      .then(data => {
        if (data) {
          let meta = {};
          try { meta = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : (data.metadata || {}); } catch(e) {}
          setSectionSettings({
            title: data.title || 'WHAT OUR CUSTOMERS SAY',
            subtitle: data.subtitle || 'Real reviews from verified buyers across Pakistan & worldwide',
            is_enabled: meta.is_enabled || 'true'
          });
        }
      })
      .catch(err => console.error("Error fetching testimonials section settings:", err));
  };

  const fetchTestimonials = () => {
    setLoading(true);
    fetch(`${API}/module/testimonials`)
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSectionSettings();
    fetchTestimonials();
  }, []);

  const handleSaveSection = () => {
    setSavingSection(true);
    fetch(`${API}/sections/home_testimonials_section`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: sectionSettings.title,
        subtitle: sectionSettings.subtitle,
        metadata: { is_enabled: sectionSettings.is_enabled }
      })
    })
      .then(() => alert('Testimonials section header updated successfully!'))
      .catch(err => console.error("Error updating testimonials header:", err))
      .finally(() => setSavingSection(false));
  };

  const openAdd = () => { setForm(EMPTY); setEditItem(null); setShowModal(true); };
  const openEdit = (item) => {
    setForm({ 
      customer_name: item.customer_name || '', 
      customer_location: item.customer_location || '', 
      rating: item.rating || 5, 
      review_text: item.review_text || '', 
      product_bought: item.product_bought || '', 
      status: item.status || 'Live', 
      display_order: item.display_order || 0, 
      avatar_url: item.avatar_url || '' 
    });
    setEditItem(item);
    setShowModal(true);
  };

  const handleSaveTestimonial = (e) => {
    e.preventDefault();
    setSaving(true);
    const id = editItem?.testimonial_id;
    const url = id ? `${API}/module/testimonials/${id}` : `${API}/module/testimonials`;
    const method = id ? 'PUT' : 'POST';

    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      .then(() => { setShowModal(false); fetchTestimonials(); })
      .catch(err => console.error("Error saving testimonial:", err))
      .finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this customer testimonial?')) return;
    fetch(`${API}/module/testimonials/${id}`, { method: 'DELETE' }).then(fetchTestimonials);
  };

  const handleStatusToggle = (item) => {
    const nextStatus = (item.status === 'Live' || item.status === 'Active') ? 'Draft' : 'Live';
    fetch(`${API}/module/testimonials/${item.testimonial_id}/status`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ status: nextStatus }) 
    }).then(fetchTestimonials);
  };

  const filtered = items.filter(i => {
    const matchSearch = (i.customer_name || '').toLowerCase().includes(search.toLowerCase()) || (i.review_text || '').toLowerCase().includes(search.toLowerCase());
    const isLive = i.status === 'Live' || i.status === 'Active';
    const matchFilter = filter === 'All' || (filter === 'Live' ? isLive : !isLive);
    return matchSearch && matchFilter;
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
            Customer Testimonials Manager
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Manage homepage customer reviews, ratings, verified badges, & active/deactive status.
          </p>
        </div>
        <button onClick={openAdd} style={{ ...btnP, boxShadow: '0 4px 14px rgba(184,147,91,0.4)' }}>
          + Add Testimonial
        </button>
      </div>

      {/* ── PANEL 1: SECTION HEADER & STATUS ──────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px', marginBottom: '4px' }}>PANEL 1</div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
          Testimonials Section Title & Visibility
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '14px' }}>
          <div>
            <label style={lStyle}>SECTION STATUS</label>
            <select value={sectionSettings.is_enabled} onChange={e => setSectionSettings(s => ({ ...s, is_enabled: e.target.value }))} style={iStyle}>
              <option value="true">Active (Show Section)</option>
              <option value="false">Disabled (Hide Section)</option>
            </select>
          </div>
          <div>
            <label style={lStyle}>SECTION MAIN TITLE</label>
            <input value={sectionSettings.title} onChange={e => setSectionSettings(s => ({ ...s, title: e.target.value }))} style={iStyle} placeholder="WHAT OUR CUSTOMERS SAY" />
          </div>
          <div>
            <label style={lStyle}>SECTION SUBTITLE</label>
            <input value={sectionSettings.subtitle} onChange={e => setSectionSettings(s => ({ ...s, subtitle: e.target.value }))} style={iStyle} placeholder="Real reviews from verified buyers..." />
          </div>
        </div>
        <button type="button" onClick={handleSaveSection} disabled={savingSection} style={btnP}>
          {savingSection ? 'Saving Header...' : 'Save Section Header'}
        </button>
      </div>

      {/* ── PANEL 2: CUSTOMER TESTIMONIALS CARDS ──────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 2</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
              Verified Customer Reviews ({items.length})
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Search customer reviews..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              style={{ ...iStyle, width: '220px' }} 
            />
            {['All', 'Live', 'Draft'].map(s => (
              <button 
                key={s} 
                onClick={() => setFilter(s)} 
                style={{ 
                  padding: '7px 14px', 
                  borderRadius: '20px', 
                  fontSize: '12px', 
                  fontWeight: '700', 
                  cursor: 'pointer', 
                  border: filter === s ? '1px solid #B8935B' : '1px solid rgba(184,147,91,0.3)', 
                  backgroundColor: filter === s ? '#B8935B' : 'transparent', 
                  color: filter === s ? '#1A2010' : '#E7D9C9' 
                }}
              >
                {s}
              </button>
            ))}
            <button onClick={openAdd} style={btnP}>+ Add Testimonial</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#E7D9C9' }}>Loading Testimonials...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#B8A99A', fontSize: '13px' }}>
            No customer testimonials found. Click "+ Add Testimonial" above to add one!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
            {filtered.map(item => {
              const isLive = item.status === 'Live' || item.status === 'Active';
              return (
                <div key={item.testimonial_id} style={{ 
                  backgroundColor: '#182012', 
                  borderRadius: '14px', 
                  padding: '20px', 
                  border: '1px solid rgba(184,147,91,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {/* Customer Info Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '50%', 
                      backgroundColor: '#3E4930', 
                      border: '2px solid #B8935B', 
                      flexShrink: 0, 
                      overflow: 'hidden', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justify: 'center' 
                    }}>
                      {item.avatar_url ? (
                        <img src={item.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                      ) : (
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>{(item.customer_name || '?')[0]}</span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#F6F1E3' }}>{item.customer_name}</div>
                      <div style={{ fontSize: '12px', color: '#B8A99A' }}>{item.customer_location || 'Verified Buyer'}</div>
                    </div>
                  </div>

                  <StarRating value={item.rating || 5} />

                  <p style={{ fontSize: '13px', color: '#E7D9C9', lineHeight: '1.6', margin: 0, borderLeft: '3px solid #B8935B', paddingLeft: '12px', fontStyle: 'italic' }}>
                    "{item.review_text}"
                  </p>

                  {item.product_bought && (
                    <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '600' }}>
                      Purchased: {item.product_bought}
                    </div>
                  )}

                  {/* 3-Button Action Row */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(184,147,91,0.2)', alignItems: 'center' }}>
                    <button 
                      type="button" 
                      onClick={() => handleStatusToggle(item)} 
                      style={{ 
                        ...btnG, 
                        height: '36px', 
                        padding: '0 12px', 
                        fontWeight: '600',
                        backgroundColor: isLive ? '#3E4930' : 'rgba(239,68,68,0.15)',
                        color: isLive ? '#F6F1E3' : '#EF4444',
                        borderColor: isLive ? '#B8935B' : 'rgba(239,68,68,0.4)',
                        flex: 1
                      }}
                    >
                      {isLive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => openEdit(item)} 
                      style={{ ...btnG, height: '36px', width: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                      title="Edit Review"
                    >
                      <EditIcon />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleDelete(item.testimonial_id)} 
                      style={{ ...btnD, height: '36px', width: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                      title="Delete Review"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modal Add / Edit Review ────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '26px', width: '90%', maxWidth: '540px', border: '1px solid #B8935B', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>TESTIMONIALS MANAGER</div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#F6F1E3' }}>
                  {editItem ? 'Edit Customer Review' : 'Add New Customer Review'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            <form onSubmit={handleSaveTestimonial} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>Customer Name *</label>
                  <input required value={form.customer_name} onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))} style={iStyle} placeholder="e.g. Ayesha Malik" />
                </div>
                <div>
                  <label style={lStyle}>Location</label>
                  <input value={form.customer_location} onChange={e => setForm(p => ({ ...p, customer_location: e.target.value }))} style={iStyle} placeholder="e.g. Lahore, Pakistan" />
                </div>
              </div>
              <div>
                <label style={lStyle}>Avatar Image URL</label>
                <input value={form.avatar_url} onChange={e => setForm(p => ({ ...p, avatar_url: e.target.value }))} style={iStyle} placeholder="https://... or /avatar.jpg" />
              </div>
              <div>
                <label style={lStyle}>Star Rating Score</label>
                <StarRating value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} />
              </div>
              <div>
                <label style={lStyle}>Review Text *</label>
                <textarea required rows={4} value={form.review_text} onChange={e => setForm(p => ({ ...p, review_text: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="Enter customer review text..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>Product Bought</label>
                  <input value={form.product_bought} onChange={e => setForm(p => ({ ...p, product_bought: e.target.value }))} style={iStyle} placeholder="e.g. Silk Hijab Set" />
                </div>
                <div>
                  <label style={lStyle}>Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={iStyle}>
                    <option value="Live">Live (Active)</option>
                    <option value="Draft">Draft (Inactive)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnG}>Cancel</button>
                <button type="submit" disabled={saving} style={btnP}>{saving ? 'Saving...' : (editItem ? 'Save & Update' : 'Add Testimonial')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsPage;
