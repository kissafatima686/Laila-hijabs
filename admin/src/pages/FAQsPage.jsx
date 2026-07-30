import React, { useState, useEffect } from 'react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' };
const cardStyle = { backgroundColor: '#222C1A', borderRadius: '16px', padding: '24px', border: '1px solid rgba(184,147,91,0.3)' };
const btnPrimary = { padding: '10px 20px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnGhost = { padding: '8px 14px', borderRadius: '6px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer' };
const btnDanger = { padding: '7px 12px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', fontSize: '12px', cursor: 'pointer' };

const PAGE_CONTEXTS = ['home', 'product', 'product-details', 'contact', 'affiliate', 'custom-orders', 'about', 'blogs', 'offers', 'size-guide', 'account', 'cart', 'wishlist'];
const EMPTY = { question: '', answer: '', page_context: 'product-details', display_order: 0, status: 'Live' };

const FAQsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');
  const [filterPage, setFilterPage] = useState('all');
  const [filterStatus, setFilterStatus] = useState('All');
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const fetch_ = () => {
    setLoading(true);
    fetch(`${API}/module/faqs`).then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])).catch(() => setItems([])).finally(() => setLoading(false));
  };
  useEffect(() => { fetch_(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditItem(null); setShowModal(true); };
  const openEdit = (item) => {
    setForm({ question: item.question || '', answer: item.answer || '', page_context: item.page_context || 'home', display_order: item.display_order || 0, status: item.status || 'Live' });
    setEditItem(item); setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault(); setSaving(true);
    const id = editItem?.faq_id;
    fetch(id ? `${API}/module/faqs/${id}` : `${API}/module/faqs`, {
      method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    }).then(() => { setShowModal(false); fetch_(); }).finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    fetch(`${API}/module/faqs/${id}`, { method: 'DELETE' }).then(fetch_);
  };

  const toggleStatus = (item) => {
    const next = item.status === 'Live' ? 'Draft' : 'Live';
    fetch(`${API}/module/faqs/${item.faq_id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) }).then(fetch_);
  };

  const filtered = items.filter(i => {
    const matchSearch = (i.question || '').toLowerCase().includes(search.toLowerCase()) || (i.answer || '').toLowerCase().includes(search.toLowerCase());
    const matchPage = filterPage === 'all' || i.page_context === filterPage;
    const matchStatus = filterStatus === 'All' || i.status === filterStatus;
    return matchSearch && matchPage && matchStatus;
  });

  const groupedByPage = {};
  filtered.forEach(i => {
    const p = i.page_context || 'home';
    if (!groupedByPage[p]) groupedByPage[p] = [];
    groupedByPage[p].push(i);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', border: '1px solid #B8935B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '6px' }}>GLOBAL</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>FAQs Manager</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>Manage FAQ questions for every page — home, product, contact, affiliate, and more.</p>
        </div>
        <button onClick={openAdd} style={btnPrimary}>+ Add FAQ</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="text" placeholder="Search FAQs..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: '260px' }} />
        <select value={filterPage} onChange={e => setFilterPage(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
          <option value="all">All Pages</option>
          {PAGE_CONTEXTS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>
        {['All', 'Live', 'Draft'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '8px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', border: filterStatus === s ? '1px solid #B8935B' : '1px solid rgba(184,147,91,0.3)', backgroundColor: filterStatus === s ? '#B8935B' : 'transparent', color: filterStatus === s ? '#1A2010' : '#E7D9C9' }}>{s}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#B8A99A' }}>{filtered.length} FAQs</span>
      </div>

      {/* FAQ List (grouped by page) */}
      {loading ? <div style={{ textAlign: 'center', padding: '60px', color: '#E7D9C9' }}>Loading...</div> : (
        filterPage === 'all' ? (
          Object.entries(groupedByPage).map(([page, faqs]) => (
            <div key={page} style={cardStyle}>
              <h3 style={{ margin: '0 0 14px 0', fontSize: '13px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                {page.toUpperCase()} ({faqs.length})
              </h3>
              <FAQList faqs={faqs} expanded={expanded} setExpanded={setExpanded} openEdit={openEdit} handleDelete={handleDelete} toggleStatus={toggleStatus} btnGhost={btnGhost} btnDanger={btnDanger} />
            </div>
          ))
        ) : (
          <div style={cardStyle}>
            <FAQList faqs={filtered} expanded={expanded} setExpanded={setExpanded} openEdit={openEdit} handleDelete={handleDelete} toggleStatus={toggleStatus} btnGhost={btnGhost} btnDanger={btnDanger} />
          </div>
        )
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '28px', width: '90%', maxWidth: '560px', border: '1px solid #B8935B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#F6F1E3' }}>{editItem ? 'Edit FAQ' : 'Add FAQ'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Question *</label>
                <input required value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} style={inputStyle} placeholder="Enter the FAQ question..." />
              </div>
              <div>
                <label style={labelStyle}>Answer *</label>
                <textarea required rows={5} value={form.answer} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Enter the detailed answer..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Page</label>
                  <select value={form.page_context} onChange={e => setForm(p => ({ ...p, page_context: e.target.value }))} style={inputStyle}>
                    {PAGE_CONTEXTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Display Order</label>
                  <input type="number" min="0" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={inputStyle}>
                  <option value="Live">Live</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnGhost}>Cancel</button>
                <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving...' : 'Save FAQ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const FAQList = ({ faqs, expanded, setExpanded, openEdit, handleDelete, toggleStatus, btnGhost, btnDanger }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {faqs.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '30px', color: '#B8A99A', fontSize: '13px' }}>No FAQs found.</div>
    ) : faqs.map(item => (
      <div key={item.faq_id} style={{ borderRadius: '10px', border: '1px solid rgba(184,147,91,0.2)', overflow: 'hidden' }}>
        <div
          onClick={() => setExpanded(expanded === item.faq_id ? null : item.faq_id)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', cursor: 'pointer', backgroundColor: expanded === item.faq_id ? '#3E4930' : '#182012', gap: '12px' }}
        >
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#F6F1E3' }}>{item.question}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '8px', backgroundColor: item.status === 'Live' ? 'rgba(34,197,94,0.15)' : 'rgba(184,147,91,0.15)', color: item.status === 'Live' ? '#22c55e' : '#B8935B', fontWeight: '700' }}>{item.status}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8935B" strokeWidth="2.5" strokeLinecap="round" style={{ transform: expanded === item.faq_id ? 'rotate(180deg)' : 'none', transition: '0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        {expanded === item.faq_id && (
          <div style={{ padding: '14px 18px', backgroundColor: '#222C1A', borderTop: '1px solid rgba(184,147,91,0.15)' }}>
            <p style={{ fontSize: '13px', color: '#E7D9C9', lineHeight: '1.7', margin: '0 0 14px 0' }}>{item.answer}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => openEdit(item)} style={btnGhost}>Edit</button>
              <button onClick={() => toggleStatus(item)} style={btnGhost}>{item.status === 'Live' ? 'Set Draft' : 'Publish'}</button>
              <button onClick={() => handleDelete(item.faq_id)} style={btnDanger}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default FAQsPage;
