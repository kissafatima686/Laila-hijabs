import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api/admin';

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: '8px',
  backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)',
  color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
};
const labelStyle = {
  fontSize: '11px', fontWeight: '700', color: '#B8935B',
  letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '6px'
};
const cardStyle = {
  backgroundColor: '#222C1A', borderRadius: '16px',
  padding: '24px', border: '1px solid rgba(184,147,91,0.3)'
};
const btnPrimary = {
  padding: '10px 20px', borderRadius: '8px', backgroundColor: '#B8935B',
  border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer'
};
const btnGhost = {
  padding: '10px 16px', borderRadius: '8px', backgroundColor: '#3E4930',
  border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '13px', cursor: 'pointer'
};
const btnDanger = {
  padding: '7px 14px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.15)',
  border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', fontSize: '12px', cursor: 'pointer'
};

const StarRating = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: '4px' }}>
    {[1, 2, 3, 4, 5].map(n => (
      <span
        key={n} onClick={() => onChange && onChange(n)}
        style={{ fontSize: '20px', cursor: onChange ? 'pointer' : 'default', color: n <= value ? '#B8935B' : 'rgba(184,147,91,0.25)' }}
      >
        ★
      </span>
    ))}
  </div>
);

const EMPTY = { customer_name: '', customer_location: '', rating: 5, review_text: '', product_bought: '', status: 'Live', display_order: 0, avatar_url: '' };

const TestimonialsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [saving, setSaving] = useState(false);

  const fetch_ = () => {
    setLoading(true);
    fetch(`${API}/module/testimonials`)
      .then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([])).finally(() => setLoading(false));
  };

  useEffect(() => { fetch_(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditItem(null); setShowModal(true); };
  const openEdit = (item) => {
    setForm({ customer_name: item.customer_name || '', customer_location: item.customer_location || '', rating: item.rating || 5, review_text: item.review_text || '', product_bought: item.product_bought || '', status: item.status || 'Live', display_order: item.display_order || 0, avatar_url: item.avatar_url || '' });
    setEditItem(item);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    const id = editItem?.testimonial_id;
    const url = id ? `${API}/module/testimonials/${id}` : `${API}/module/testimonials`;
    const method = id ? 'PUT' : 'POST';
    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      .then(() => { setShowModal(false); fetch_(); })
      .finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    fetch(`${API}/module/testimonials/${id}`, { method: 'DELETE' }).then(fetch_);
  };

  const handleStatusToggle = (item) => {
    const next = item.status === 'Live' ? 'Draft' : 'Live';
    fetch(`${API}/module/testimonials/${item.testimonial_id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) }).then(fetch_);
  };

  const filtered = items.filter(i => {
    const matchSearch = (i.customer_name || '').toLowerCase().includes(search.toLowerCase()) || (i.review_text || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || i.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', border: '1px solid #B8935B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '6px' }}>HOME PAGE</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>Testimonials</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>Manage customer reviews shown on the home page.</p>
        </div>
        <button onClick={openAdd} style={btnPrimary}>+ Add Testimonial</button>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="text" placeholder="Search testimonials..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, width: '280px' }} />
        {['All', 'Live', 'Draft'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', border: filter === s ? '1px solid #B8935B' : '1px solid rgba(184,147,91,0.3)', backgroundColor: filter === s ? '#B8935B' : 'transparent', color: filter === s ? '#1A2010' : '#E7D9C9' }}>{s}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#B8A99A' }}>{filtered.length} testimonials</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#E7D9C9' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#B8A99A' }}>No testimonials found.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filtered.map(item => (
            <div key={item.testimonial_id} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Avatar + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#3E4930', border: '2px solid #B8935B', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.avatar_url ? (
                    <img src={item.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                  ) : (
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>{(item.customer_name || '?')[0]}</span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#F6F1E3' }}>{item.customer_name}</div>
                  <div style={{ fontSize: '12px', color: '#B8A99A' }}>{item.customer_location || '—'}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '11px', padding: '3px 10px', borderRadius: '12px', backgroundColor: item.status === 'Live' ? 'rgba(34,197,94,0.1)' : 'rgba(184,147,91,0.1)', border: `1px solid ${item.status === 'Live' ? 'rgba(34,197,94,0.4)' : 'rgba(184,147,91,0.3)'}`, color: item.status === 'Live' ? '#22c55e' : '#B8935B', fontWeight: '700' }}>
                  {item.status}
                </span>
              </div>
              <StarRating value={item.rating || 5} />
              <p style={{ fontSize: '13px', color: '#E7D9C9', lineHeight: '1.6', margin: 0, borderLeft: '3px solid #B8935B', paddingLeft: '12px' }}>
                "{item.review_text}"
              </p>
              {item.product_bought && (
                <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '600' }}>Bought: {item.product_bought}</div>
              )}
              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(184,147,91,0.15)' }}>
                <button onClick={() => openEdit(item)} style={{ ...btnGhost, fontSize: '12px', padding: '7px 14px', flex: 1 }}>Edit</button>
                <button onClick={() => handleStatusToggle(item)} style={{ ...btnGhost, fontSize: '12px', padding: '7px 14px', flex: 1 }}>
                  {item.status === 'Live' ? 'Set Draft' : 'Publish'}
                </button>
                <button onClick={() => handleDelete(item.testimonial_id)} style={btnDanger}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '28px', width: '90%', maxWidth: '560px', border: '1px solid #B8935B', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#F6F1E3' }}>
                {editItem ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Customer Name *</label>
                  <input required value={form.customer_name} onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))} style={inputStyle} placeholder="e.g. Ayesha Malik" />
                </div>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input value={form.customer_location} onChange={e => setForm(p => ({ ...p, customer_location: e.target.value }))} style={inputStyle} placeholder="e.g. Lahore, Pakistan" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Avatar URL</label>
                <input value={form.avatar_url} onChange={e => setForm(p => ({ ...p, avatar_url: e.target.value }))} style={inputStyle} placeholder="https://... or /avatar.jpg" />
              </div>
              <div>
                <label style={labelStyle}>Star Rating</label>
                <StarRating value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} />
              </div>
              <div>
                <label style={labelStyle}>Review Text *</label>
                <textarea required rows={4} value={form.review_text} onChange={e => setForm(p => ({ ...p, review_text: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} placeholder="What did the customer say?" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Product Bought</label>
                  <input value={form.product_bought} onChange={e => setForm(p => ({ ...p, product_bought: e.target.value }))} style={inputStyle} placeholder="e.g. Lamia Open Kaftan Set" />
                </div>
                <div>
                  <label style={labelStyle}>Display Order</label>
                  <input type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ ...inputStyle }}>
                  <option value="Live">Live</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ ...btnGhost, padding: '10px 18px' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving...' : 'Save Testimonial'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsPage;
