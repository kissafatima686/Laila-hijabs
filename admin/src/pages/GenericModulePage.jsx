import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:5000/api/admin';

// ─── Shared Styles ────────────────────────────────────────────────────────────
const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const btnP = { padding: '9px 18px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnG = { padding: '7px 12px', borderRadius: '6px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' };
const btnD = { padding: '7px 10px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#EF4444', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' };

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
    { key: 'status', label: 'Status', type: 'select', options: ['Live', 'Draft'] },
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
    { key: 'status', label: 'Status', type: 'select', options: ['Live', 'Draft'] },
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
    { key: 'user_id', label: 'User ID', type: 'number', required: true },
    { key: 'affiliate_code', label: 'Affiliate Code', type: 'text', required: true },
    { key: 'affiliate_link', label: 'Referral Link', type: 'text' },
    { key: 'commission_rate', label: 'Commission Rate (%)', type: 'number' },
    { key: 'status', label: 'Status', type: 'select', options: ['Approved', 'Suspended'] },
  ],
  commissions: [
    { key: 'affiliate_id', label: 'Affiliate ID', type: 'number', required: true },
    { key: 'order_id', label: 'Order ID', type: 'number', required: true },
    { key: 'sale_amount', label: 'Sale Amount', type: 'number' },
    { key: 'commission_rate', label: 'Commission Rate (%)', type: 'number' },
    { key: 'commission_amount', label: 'Commission Amount', type: 'number' },
    { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Rejected', 'Paid'] },
  ],
  payouts: [
    { key: 'affiliate_id', label: 'Affiliate ID', type: 'number', required: true },
    { key: 'amount', label: 'Payout Amount', type: 'number' },
    { key: 'payment_method', label: 'Payment Method', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Paid', 'Pending'] },
  ],
  messages: [
    { key: 'name', label: 'Sender Name', type: 'text' },
    { key: 'email', label: 'Sender Email', type: 'email' },
    { key: 'subject', label: 'Subject', type: 'text' },
    { key: 'message', label: 'Message Body', type: 'textarea' },
    { key: 'is_read', label: 'Read? (1 = yes)', type: 'number' },
  ],
  subscribers: [
    { key: 'email', label: 'Email Address', type: 'email', required: true },
    { key: 'source', label: 'Signup Source', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Unsubscribed'] },
  ],
  users: [
    { key: 'full_name', label: 'Full Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'Banned'] },
  ],
  orders: [
    { key: 'order_status', label: 'Order Status', type: 'select', options: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] },
    { key: 'payment_status', label: 'Payment Status', type: 'select', options: ['Unpaid', 'Paid', 'Refunded'] },
    { key: 'notes', label: 'Admin Notes', type: 'textarea' },
  ],
  custom_orders: [
    { key: 'customer_name', label: 'Customer Full Name', type: 'text', required: true },
    { key: 'phone', label: 'WhatsApp / Phone Number', type: 'text' },
    { key: 'email', label: 'Customer Email', type: 'email' },
    { key: 'garment_type', label: 'Garment Type (e.g. Abaya, Hijab Set)', type: 'text' },
    { key: 'size_label', label: 'Standard Size (XS-XXL / Custom)', type: 'text' },
    { key: 'fabric_type', label: 'Fabric Choice', type: 'text' },
    { key: 'color_choice', label: 'Color Choice', type: 'text' },
    { key: 'chest', label: 'Chest Measurement (inches)', type: 'text' },
    { key: 'hips', label: 'Hips Measurement (inches)', type: 'text' },
    { key: 'shoulders', label: 'Shoulders Measurement (inches)', type: 'text' },
    { key: 'waist', label: 'Waist Measurement (inches)', type: 'text' },
    { key: 'length', label: 'Length Measurement (inches)', type: 'text' },
    { key: 'width', label: 'Width Measurement (inches)', type: 'text' },
    { key: 'description', label: 'Vision & Design Description', type: 'textarea' },
    { key: 'reference_image', label: 'Reference Image Photo URL', type: 'text' },
    { key: 'status', label: 'Custom Order Status', type: 'select', options: ['Pending', 'Confirmed', 'In Progress', 'Ready to Ship', 'Delivered', 'Cancelled'] },
  ],
  'custom-orders': [
    { key: 'customer_name', label: 'Customer Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'garment_type', label: 'Garment Type', type: 'text' },
    { key: 'description', label: 'Order Details', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'In Progress', 'Completed', 'Cancelled'] },
  ],
  'navbar-links': [
    { key: 'label', label: 'Link Label', type: 'text', required: true },
    { key: 'url', label: 'URL / Path', type: 'text', required: true },
    { key: 'display_order', label: 'Display Order', type: 'number' },
    { key: 'is_highlighted', label: 'Enable Badge?', type: 'select', options: ['1', '0'] },
    { key: 'badge_text', label: 'Badge Text (e.g., New)', type: 'text' },
    { key: 'badge_color', label: 'Badge Color (e.g., #ef4444)', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Live', 'Draft'] },
  ],
  'footer-links': [
    { key: 'group_name', label: 'Column Group Name', type: 'text', required: true },
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
  const cfg = {
    Live: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
    Active: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
    Approved: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
    Pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
    Draft: { color: '#B8A99A', bg: 'rgba(184,147,91,0.08)', border: 'rgba(184,147,91,0.2)' },
    Inactive: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
  }[status] || { color: '#B8A99A', bg: 'transparent', border: 'rgba(184,147,91,0.2)' };
  return (
    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', fontWeight: '700', color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`, whiteSpace: 'nowrap' }}>
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
    e.preventDefault(); setSaving(true);
    const id = editItem ? getItemId(editItem) : null;
    const url = id ? `${API}/module/${moduleKey}/${id}` : `${API}/module/${moduleKey}`;
    fetch(url, { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      .then(() => { setShowModal(false); fetchItems(); })
      .catch(() => {}).finally(() => setSaving(false));
  };

  const handleToggleStatus = (item) => {
    const id = getItemId(item);
    const current = item.status || 'Live';
    
    let next;
    let targetModule = moduleKey;

    if (moduleKey === 'approved-affiliates') {
        // Actual affiliates (table: affiliates)
        next = current === 'Approved' ? 'Suspended' : 'Approved';
        // Wait, the API table_map has 'approved-affiliates' mapped to 'affiliates'.
        // So we DO NOT need to override targetModule in frontend, the backend handles it!
    } else if (moduleKey === 'affiliates') {
        // Affiliate applications (table: affiliate_applications)
        // If it's Pending or Rejected, clicking toggles it to Approved. If Approved, toggles to Rejected (or Pending).
        next = current === 'Approved' ? 'Rejected' : 'Approved';
    } else {
        const statuses = ['Live', 'Active', 'Approved'];
        next = statuses.includes(current) ? 'Draft' : 'Live';
    }

    fetch(`${API}/module/${targetModule}/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) }).then(fetchItems);
  };

  const handleDelete = (item) => {
    if (!window.confirm('Delete this record permanently?')) return;
    const id = getItemId(item);
    fetch(`${API}/module/${moduleKey}/${id}`, { method: 'DELETE' }).then(fetchItems);
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

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', borderRadius: '16px', padding: '24px 28px', border: '1px solid #B8935B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '5px' }}>CONTENT MODULE</div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#F6F1E3' }}>{title}</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>{description || `Manage all ${title} entries.`}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#B8A99A' }}>{filteredItems.length} records</span>
          <button onClick={openAdd} style={btnP}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add {title.replace(/s$/, '')}
          </button>
        </div>
      </div>

      {/* ── Filter Bar ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="text" placeholder={`Search ${title.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...iStyle, width: '260px' }} />
        {['All', 'Live', 'Draft', 'Pending', 'Active', 'Approved', 'Rejected', 'Paid'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '7px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', border: filterStatus === s ? '1px solid #B8935B' : '1px solid rgba(184,147,91,0.25)', backgroundColor: filterStatus === s ? '#B8935B' : 'transparent', color: filterStatus === s ? '#1A2010' : '#E7D9C9', transition: 'all 0.15s' }}>
            {s}
          </button>
        ))}
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#222C1A', borderRadius: '14px', border: '1px solid rgba(184,147,91,0.25)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '50px', textAlign: 'center', color: '#E7D9C9' }}>Loading {title}...</div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#B8A99A', marginBottom: '12px' }}>No {title} found.</div>
            <button onClick={openAdd} style={btnP}>+ Add First Entry</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#182012', borderBottom: '1px solid rgba(184,147,91,0.25)' }}>
                  <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', whiteSpace: 'nowrap' }}>RECORD</th>
                  <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', whiteSpace: 'nowrap' }}>DETAILS</th>
                  <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>STATUS</th>
                  <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', textAlign: 'right', whiteSpace: 'nowrap' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, idx) => {
                  const itemTitle = getItemTitle(item);
                  const itemDetail = getItemDetail(item);
                  return (
                    <tr key={getItemId(item) || idx} style={{ borderBottom: '1px solid rgba(184,147,91,0.1)', transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(184,147,91,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '13px 18px', fontSize: '13px', fontWeight: '600', color: '#F6F1E3', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
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
                      <td style={{ padding: '13px 18px', fontSize: '12px', color: '#B8A99A', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{itemDetail}</td>
                      <td style={{ padding: '13px 18px' }}>
                        <StatusBadge status={item.status} />
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          {/* Active Toggle */}
                          <button onClick={() => handleToggleStatus(item)} style={{ ...btnG, fontSize: '11px', whiteSpace: 'nowrap' }}>
                            {['Live', 'Active', 'Approved'].includes(item.status) ? 'Deactivate' : 'Activate'}
                          </button>
                          {/* View Affiliate Activity */}
                          {moduleKey === 'approved-affiliates' && (
                            <Link to={`/affiliate-details/${item.affiliate_id}`} style={{ ...btnG, textDecoration: 'none', backgroundColor: '#B8935B', color: '#1A2010', borderColor: '#B8935B' }} title="View Activity">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Activity
                            </Link>
                          )}
                          {/* Edit */}
                          <button onClick={() => openEdit(item)} style={btnG} title="Edit">
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '28px', width: '90%', maxWidth: '580px', border: '1px solid #B8935B', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px', marginBottom: '3px' }}>{editItem ? 'EDITING' : 'NEW ENTRY'}</div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#F6F1E3' }}>{editItem ? `Edit ${title.replace(/s$/, '')}` : `Add ${title.replace(/s$/, '')}`}</h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer', padding: '4px' }}><CloseIcon /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              {fields.map(field => (
                <Field key={field.key} field={field} value={formData[field.key]} onChange={handleFieldChange} />
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ ...btnG, padding: '9px 18px' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ ...btnP, opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving...' : editItem ? 'Update' : 'Add Entry'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericModulePage;
