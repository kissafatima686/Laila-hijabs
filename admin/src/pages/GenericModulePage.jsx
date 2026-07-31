import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

// ─── Palette Styles (Olive & Gold Quiet Luxury) ──────────────────────────────
const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#F6F1E3', border: '1px solid #B8935B', color: '#3E4930', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#3E4930', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const btnP = { padding: '9px 18px', borderRadius: '6px', backgroundColor: '#3E4930', border: 'none', color: '#F6F1E3', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnG = { padding: '7px 12px', borderRadius: '6px', backgroundColor: '#F6F1E3', border: '1px solid #B8935B', color: '#3E4930', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' };
const btnD = { padding: '7px 10px', borderRadius: '6px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' };

const EditIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const TrashIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>;
const CloseIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

// Returns a human-readable display title from an item object
const getItemTitle = (item) =>
  item.title || item.name || item.full_name || item.author_name || item.customer_name ||
  item.label || item.question || item.slug || item.city || item.size_label || `Record #${Object.values(item)[0]}`;

// Returns a display subtitle/detail
const getItemDetail = (item) =>
  item.subtitle || item.description || item.email || item.role || item.content ||
  item.review_text || item.answer || item.url || item.address || item.phone || '—';

// Returns the primary key value
const getItemId = (item) =>
  item.id || item.product_id || item.category_id || item.blog_id || item.slider_id ||
  item.offer_id || item.location_id || item.application_id || item.custom_order_id ||
  item.message_id || item.subscriber_id || item.user_id || item.testimonial_id ||
  item.faq_id || item.row_id || item.link_id || item.item_id || item.admin_id ||
  Object.values(item)[0];

// ─── All editable fields for every module ─────────────────────────────────────
const MODULE_FIELDS = {
  sliders: [
    { key: 'title', label: 'Slide Title', type: 'text', required: true },
    { key: 'subtitle', label: 'Subtitle / Tagline', type: 'text' },
    { key: 'image_url', label: 'Image URL', type: 'text', required: true },
    { key: 'button_text', label: 'Button Text', type: 'text' },
    { key: 'button_link', label: 'Button Link', type: 'text' },
    { key: 'badge_text', label: 'Badge Text', type: 'text' },
    { key: 'display_order', label: 'Display Order', type: 'number' },
    { key: 'status', label: 'Status', type: 'select', options: ['Live', 'Draft'] },
  ],
  categories: [
    { key: 'name', label: 'Category Name', type: 'text', required: true },
    { key: 'slug', label: 'Slug (URL path)', type: 'text', required: true },
    { key: 'keywords', label: 'Search Keywords / Tags (comma separated)', type: 'textarea', placeholder: 'e.g. saudi abaya, kaftan, gown, nida, open abaya' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'image_url', label: 'Cover Image URL', type: 'text' },
    { key: 'display_order', label: 'Display Order', type: 'number' },
    { key: 'status', label: 'Status', type: 'select', options: ['Live', 'Draft'] },
  ],
  blogs: [
    { key: 'title', label: 'Post Title', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text' },
    { key: 'author_name', label: 'Author Name', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'excerpt', label: 'Excerpt / Summary', type: 'textarea' },
    { key: 'content', label: 'Full Content', type: 'textarea' },
    { key: 'image_url', label: 'Cover Image URL', type: 'text' },
    { key: 'read_time', label: 'Read Time', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Live', 'Draft'] },
  ],
  offers: [
    { key: 'title', label: 'Offer Title', type: 'text', required: true },
    { key: 'code', label: 'Promo Code', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'discount_type', label: 'Discount Type', type: 'select', options: ['percentage', 'flat'] },
    { key: 'discount_value', label: 'Discount Value', type: 'number' },
    { key: 'min_order_value', label: 'Min Order Value (Rs.)', type: 'number' },
    { key: 'expires_at', label: 'Expiry Date', type: 'text', placeholder: 'YYYY-MM-DD' },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Expired'] },
  ],
  locations: [
    { key: 'name', label: 'Studio Name', type: 'text', required: true },
    { key: 'city', label: 'City, Country', type: 'text', required: true },
    { key: 'address', label: 'Full Address', type: 'textarea' },
    { key: 'phone', label: 'Phone Number', type: 'text' },
    { key: 'whatsapp', label: 'WhatsApp Number (no + or spaces)', type: 'text' },
    { key: 'email', label: 'Email Address', type: 'email' },
    { key: 'hours', label: 'Opening Hours', type: 'text' },
    { key: 'image_url', label: 'Studio Image URL', type: 'text' },
    { key: 'map_url', label: 'Google Maps Embed URL', type: 'textarea' },
    { key: 'directions_url', label: 'Directions Link', type: 'text' },
    { key: 'description', label: 'Studio Description', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
  ],
  affiliates: [
    { key: 'full_name', label: 'Applicant Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'instagram_handle', label: 'Instagram / TikTok Handle', type: 'text' },
    { key: 'followers', label: 'Followers Count', type: 'text' },
    { key: 'promo_strategy', label: 'Application Message', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Rejected'] },
  ],
  'approved-affiliates': [
    { key: 'full_name', label: 'Affiliate Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'promo_code', label: 'Assigned Coupon Code', type: 'text' },
    { key: 'commission_rate', label: 'Commission Rate (%)', type: 'number' },
    { key: 'total_earnings', label: 'Total Earnings (Rs.)', type: 'number' },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
  ],
  testimonials: [
    { key: 'customer_name', label: 'Customer Name', type: 'text', required: true },
    { key: 'role', label: 'Role / City', type: 'text' },
    { key: 'review_text', label: 'Review Text', type: 'textarea', required: true },
    { key: 'rating', label: 'Rating (1-5)', type: 'number' },
    { key: 'product_name', label: 'Product Purchased', type: 'text' },
    { key: 'avatar_url', label: 'Avatar Image URL', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Live', 'Draft'] },
  ],
  faqs: [
    { key: 'question', label: 'Question', type: 'text', required: true },
    { key: 'answer', label: 'Answer', type: 'textarea', required: true },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'display_order', label: 'Display Order', type: 'number' },
    { key: 'status', label: 'Status', type: 'select', options: ['Live', 'Draft'] },
  ],
  'navbar-links': [
    { key: 'label', label: 'Link Title', type: 'text', required: true },
    { key: 'url', label: 'Target URL / Path', type: 'text', required: true },
    { key: 'display_order', label: 'Display Order', type: 'number' },
    { key: 'is_highlighted', label: 'Is Highlighted (0 or 1)', type: 'number' },
    { key: 'badge_text', label: 'Badge Text (e.g. SALE)', type: 'text' },
    { key: 'badge_color', label: 'Badge Color (Hex)', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Live', 'Draft'] },
  ],
  'footer-links': [
    { key: 'group_name', label: 'Column / Group Name', type: 'text', required: true },
    { key: 'label', label: 'Link Label', type: 'text', required: true },
    { key: 'url', label: 'URL / Path', type: 'text', required: true },
    { key: 'display_order', label: 'Display Order', type: 'number' },
    { key: 'status', label: 'Status', type: 'select', options: ['Live', 'Draft'] },
  ],
};

const DEFAULT_FIELDS = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'status', label: 'Status', type: 'select', options: ['Live', 'Draft'] },
];

// ─── Field Renderer ───────────────────────────────────────────────────────────
const Field = ({ field, value, onChange }) => {
  const isMedia = ['image', 'avatar', 'cover', 'video', 'file'].some(k => field.key.toLowerCase().includes(k) || (field.label && field.label.toLowerCase().includes('image')));

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(field.key, reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (isMedia) {
    return (
      <div>
        <label style={lStyle}>{field.label}{field.required && ' *'}</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ ...btnG, backgroundColor: '#3E4930', color: '#F6F1E3', borderColor: '#3E4930', padding: '8px 14px', cursor: 'pointer', flexShrink: 0, fontWeight: '700' }}>
            📁 Upload File
            <input type="file" accept="image/*,video/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
          <input
            type="text"
            required={field.required}
            value={value || ''}
            onChange={e => onChange(field.key, e.target.value)}
            style={iStyle}
            placeholder="Upload file or enter URL..."
          />
        </div>
        {value && (value.startsWith('data:image') || value.startsWith('http')) && (
          <div style={{ marginTop: '6px' }}>
            <img src={value} alt="Preview" style={{ height: '48px', borderRadius: '4px', border: '1px solid #E7D9C9', objectFit: 'cover' }} />
          </div>
        )}
      </div>
    );
  }

  if (field.type === 'textarea') return (
    <div><label style={lStyle}>{field.label}{field.required && ' *'}</label>
      <textarea rows={3} required={field.required} value={value || ''} onChange={e => onChange(field.key, e.target.value)}
        style={{ ...iStyle, resize: 'vertical', minHeight: '80px' }} placeholder={field.placeholder} /></div>
  );
  if (field.type === 'select') return (
    <div><label style={lStyle}>{field.label}</label>
      <select value={value || ''} onChange={e => onChange(field.key, e.target.value)} style={iStyle}>
        <option value="">— Select —</option>
        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select></div>
  );
  return (
    <div><label style={lStyle}>{field.label}{field.required && ' *'}</label>
      <input type={field.type || 'text'} required={field.required} value={value || ''}
        onChange={e => onChange(field.key, e.target.value)} style={iStyle} placeholder={field.placeholder} 
        min={field.type === 'number' ? "0" : undefined} /></div>
  );
};

// ─── Item Row Status Badge ────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const isOk = ['Live', 'Active', 'Approved'].includes(status);
  return (
    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', fontWeight: '700', color: isOk ? '#15803D' : '#3E4930', backgroundColor: isOk ? 'rgba(34,197,94,0.15)' : '#E7D9C9', border: `1px solid ${isOk ? 'rgba(34,197,94,0.3)' : '#B8935B'}`, whiteSpace: 'nowrap' }}>
      {status || 'Live'}
    </span>
  );
};

// ─── Main GenericModulePage ───────────────────────────────────────────────────
const GenericModulePage = ({ moduleKey, title, description }) => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const fields = MODULE_FIELDS[moduleKey] || DEFAULT_FIELDS;

  const fetchItems = () => {
    setLoading(true);
    fetch(`${API}/module/${moduleKey}`)
      .then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([])).finally(() => setLoading(false));
  };
  useEffect(() => { fetchItems(); }, [moduleKey]);

  const openAdd = () => {
    const empty = {};
    fields.forEach(f => { empty[f.key] = f.type === 'number' ? '' : ''; });
    setFormData(empty); setEditItem(null); setShowModal(true);
  };

  const openEdit = (item) => {
    const filled = {};
    fields.forEach(f => { filled[f.key] = item[f.key] !== undefined ? String(item[f.key]) : ''; });
    setFormData(filled); setEditItem(item); setShowModal(true);
  };

  const handleFieldChange = (key, val) => setFormData(p => ({ ...p, [key]: val }));

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    const id = editItem ? getItemId(editItem) : null;
    const url = id ? `${API}/module/${moduleKey}/${id}` : `${API}/module/${moduleKey}`;
    fetch(url, { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      .then(() => { 
        setShowModal(false); 
        fetchItems(); 
        triggerSavedNotice();
      })
      .catch(() => {}).finally(() => setSaving(false));
  };

  const triggerSavedNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  // Immediate Auto-Save Toggle
  const handleToggleStatus = (item) => {
    const id = getItemId(item);
    const current = item.status || 'Live';
    
    let next;
    let targetModule = moduleKey;

    const statusField = fields.find(f => f.key === 'status');
    if (statusField && statusField.options && statusField.options.length >= 2) {
      if (moduleKey === 'affiliates') {
        next = current === 'Approved' ? 'Rejected' : 'Approved';
      } else {
        next = current === statusField.options[0] ? statusField.options[1] : statusField.options[0];
      }
    } else {
      const statuses = ['Live', 'Active', 'Approved'];
      next = statuses.includes(current) ? 'Draft' : 'Live';
    }

    // Immediately save to DB
    fetch(`${API}/module/${targetModule}/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          alert(`Error updating status: ${err.error || err.message}`);
        } else {
          triggerSavedNotice();
        }
        fetchItems();
      });
  };

  const handleDelete = (item) => {
    if (!window.confirm('Delete this record permanently?')) return;
    const id = getItemId(item);
    fetch(`${API}/module/${moduleKey}/${id}`, { method: 'DELETE' }).then(() => {
      triggerSavedNotice();
      fetchItems();
    });
  };

  const filteredItems = items.filter(item => {
    const t = getItemTitle(item).toLowerCase();
    const d = getItemDetail(item).toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = t.includes(q) || d.includes(q);
    const matchStatus = filterStatus === 'All' || item.status === filterStatus || (!item.status && filterStatus === 'Live');
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>

      {/* ── Top Bar Header: Title, Counts, Top Save Button & Add ─────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', backgroundColor: '#FFFFFF', padding: '18px 24px', borderRadius: '12px', border: '1px solid #E7D9C9', boxShadow: '0 2px 8px rgba(62,73,48,0.04)' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>MANAGEMENT</div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#3E4930' }}>{title}</h2>
          <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#6B7280' }}>{description || `Manage all ${title} entries.`}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {savedNotice && (
            <span style={{ fontSize: '12px', color: '#15803D', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
              Saved Changes ✓
            </span>
          )}
          <button onClick={() => triggerSavedNotice()} style={{ ...btnG, backgroundColor: '#3E4930', color: '#F6F1E3', borderColor: '#3E4930', padding: '9px 16px', fontWeight: '700' }}>
            💾 Save Changes
          </button>
          <button onClick={openAdd} style={btnP}>
            + Add New
          </button>
        </div>
      </div>

      {/* ── Search & Filter Controls ───────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${title.toLowerCase()}...`}
          style={{ ...iStyle, maxWidth: '280px', backgroundColor: '#FFFFFF' }}
        />
        <div style={{ display: 'flex', gap: '4px' }}>
          {['All', 'Live', 'Active', 'Draft', 'Inactive', 'Approved', 'Pending'].map(st => {
            const hasAny = items.some(i => i.status === st || (!i.status && st === 'Live'));
            if (st !== 'All' && !hasAny) return null;
            return (
              <button key={st} onClick={() => setFilterStatus(st)}
                style={{ padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', border: filterStatus === st ? '1px solid #B8935B' : '1px solid #E7D9C9', backgroundColor: filterStatus === st ? '#3E4930' : '#FFFFFF', color: filterStatus === st ? '#F6F1E3' : '#3E4930' }}>
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table Card ───────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E7D9C9', overflow: 'hidden', boxShadow: '0 2px 8px rgba(62,73,48,0.04)' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#3E4930', fontWeight: '600' }}>Loading entries...</div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
            No records found. Click <strong>+ Add New</strong> above to create your first entry.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#3E4930', color: '#F6F1E3' }}>
                  <th style={{ padding: '12px 18px', fontWeight: '700', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Item Title</th>
                  <th style={{ padding: '12px 18px', fontWeight: '700', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Details / Subtitle</th>
                  <th style={{ padding: '12px 18px', fontWeight: '700', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                  <th style={{ padding: '12px 18px', fontWeight: '700', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => {
                  const itemTitle = getItemTitle(item);
                  const itemDetail = getItemDetail(item);
                  const itemId = getItemId(item);

                  return (
                    <tr key={itemId} style={{ borderBottom: '1px solid #E7D9C9' }}>
                      <td style={{ padding: '13px 18px', fontWeight: '600', color: '#3E4930' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {item.image_url && (
                            <img src={item.image_url} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #E7D9C9' }} />
                          )}
                          <span>{itemTitle}</span>
                          {moduleKey === 'navbar-links' && Number(item.is_highlighted) === 1 && item.badge_text && (
                            <span style={{
                              backgroundColor: item.badge_color || '#ef4444', 
                              color: '#fff', 
                              fontSize: '10px', 
                              fontWeight: 'bold', 
                              padding: '2px 8px', 
                              borderRadius: '12px',
                              letterSpacing: '0.5px'
                            }}>{item.badge_text}</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '13px 18px', fontSize: '12px', color: '#6B7280', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{itemDetail}</td>
                      <td style={{ padding: '13px 18px' }}>
                        <StatusBadge status={item.status} />
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          {/* Active Toggle (Auto-Saves Instantly) */}
                          <button onClick={() => handleToggleStatus(item)} style={{ ...btnG, fontSize: '11px', whiteSpace: 'nowrap' }}>
                            {['Live', 'Active', 'Approved'].includes(item.status) ? 'Deactivate' : 'Activate'}
                          </button>
                          {/* View Affiliate Activity */}
                          {moduleKey === 'approved-affiliates' && (
                            <Link to={`/affiliate-details/${item.affiliate_id}`} style={{ ...btnG, textDecoration: 'none', backgroundColor: '#B8935B', color: '#FFFFFF', borderColor: '#B8935B' }} title="View Activity">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Activity
                            </Link>
                          )}
                          {/* Edit */}
                          <button onClick={() => openEdit(item)} style={{ ...btnG, backgroundColor: '#B8935B', color: '#FFFFFF', borderColor: '#B8935B' }} title="Edit">
                            <EditIcon />
                          </button>
                          {/* Delete */}
                          <button onClick={() => handleDelete(item)} style={btnD} title="Delete">
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ───────────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(62,73,48,0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '28px', width: '90%', maxWidth: '580px', border: '1px solid #E7D9C9', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px', marginBottom: '3px' }}>{editItem ? 'EDITING RECORD' : 'NEW ENTRY'}</div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#3E4930' }}>{editItem ? `Edit ${title.replace(/s$/, '')}` : `Add ${title.replace(/s$/, '')}`}</h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#3E4930', cursor: 'pointer', padding: '4px' }}><CloseIcon /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              {fields.map(field => (
                <Field key={field.key} field={field} value={formData[field.key]} onChange={handleFieldChange} />
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid #E7D9C9' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ ...btnG, padding: '9px 18px' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ ...btnP, opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving...' : editItem ? 'Update Entry' : 'Add Entry'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericModulePage;
