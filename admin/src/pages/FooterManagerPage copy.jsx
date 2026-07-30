import React, { useState, useEffect } from 'react';

/**
 * Full CRUD page for managing the Footer — sourced directly from Footer.jsx:
 *  Col 1: Delivery & Returns links
 *  Col 2: Customer Care links
 *  Col 3: Get In Touch (WhatsApp, Email, label text)
 *  Col 4: About Us links
 *  Col 5: Join Our Community (newsletter text, button, social media links)
 *  Bottom: Copyright line
 */

const API = 'http://localhost:5000/api/admin';

const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const card = { backgroundColor: '#222C1A', borderRadius: '14px', padding: '22px', border: '1px solid rgba(184,147,91,0.25)' };
const btnP = { padding: '9px 18px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnG = { padding: '7px 14px', borderRadius: '6px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer' };
const btnD = { padding: '7px 12px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#EF4444', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' };

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
  </svg>
);
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Reusable Link List Manager ────────────────────────────────────────────────
const LinkListManager = ({ groupName, items, onSave, onDelete, onToggle }) => {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ label: '', url: '', status: 'Live' });

  const openAdd = () => { setForm({ label: '', url: '', status: 'Live' }); setEditItem(null); setShowModal(true); };
  const openEdit = (item) => { setForm({ label: item.label, url: item.url, status: item.status || 'Live' }); setEditItem(item); setShowModal(true); };
  const handleSave = (e) => {
    e.preventDefault();
    onSave({ ...form, group_name: groupName }, editItem?.link_id);
    setShowModal(false);
  };

  return (
    <div style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px', marginBottom: '3px' }}>FOOTER COLUMN</div>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#F6F1E3' }}>{groupName}</h3>
        </div>
        <button onClick={openAdd} style={btnP}>+ Add Link</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {items.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#B8A99A', fontSize: '12px' }}>No links yet. Add your first link.</div>
        ) : items.map(item => (
          <div key={item.link_id || item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.1)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#F6F1E3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</div>
              <div style={{ fontSize: '11px', color: '#B8A99A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.url}</div>
            </div>
            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '8px', fontWeight: '700', color: item.status === 'Live' ? '#22c55e' : '#B8A99A', backgroundColor: item.status === 'Live' ? 'rgba(34,197,94,0.1)' : 'rgba(184,147,91,0.08)', border: `1px solid ${item.status === 'Live' ? 'rgba(34,197,94,0.3)' : 'rgba(184,147,91,0.2)'}`, whiteSpace: 'nowrap', flexShrink: 0 }}>
              {item.status || 'Live'}
            </span>
            <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
              <button onClick={() => onToggle(item)} style={{ ...btnG, padding: '5px 10px', fontSize: '11px' }}>
                {item.status === 'Live' ? 'Hide' : 'Show'}
              </button>
              {item.url && item.url.startsWith('/') && (
                <a
                  href={`/admin#${item.url}`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = item.url === '/about' ? '/sections/about_who_we_are' :
                                          item.url === '/contact' ? '/sections/contact_main_section' :
                                          item.url === '/faqs' ? '/faqs' :
                                          item.url === '/size-guide' ? '/size-guide' :
                                          item.url === '/locations' ? '/locations' :
                                          item.url === '/blogs' ? '/blogs' : '/sections/footer_settings';
                  }}
                  style={{ ...btnG, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                  title="Edit Page Content"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Edit Page
                </a>
              )}
              <button onClick={() => openEdit(item)} style={{ ...btnG, padding: '5px 10px' }} title="Edit Link Details"><EditIcon /></button>
              <button onClick={() => onDelete(item.link_id)} style={{ ...btnD, padding: '5px 10px' }} title="Delete Link"><TrashIcon /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '14px', padding: '26px', width: '90%', maxWidth: '440px', border: '1px solid #B8935B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>{editItem ? 'Edit' : 'Add'} Link — {groupName}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer' }}><CloseIcon /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              <div><label style={lStyle}>Link Label *</label><input required value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} style={iStyle} placeholder="e.g. Free Shipping Info" /></div>
              <div><label style={lStyle}>URL / Path *</label><input required value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} style={iStyle} placeholder="e.g. /shipping-info or https://..." /></div>
              <div><label style={lStyle}>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={iStyle}>
                  <option value="Live">Live</option><option value="Draft">Draft (Hidden)</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnG}>Cancel</button>
                <button type="submit" style={btnP}>Save Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const DEFAULT_SEED_LINKS = [
  { link_id: 1, group_name: 'Delivery & Returns', label: 'Free shipping for orders over £120', url: '/shipping', status: 'Live' },
  { link_id: 2, group_name: 'Delivery & Returns', label: 'Shipping information', url: '/shipping-info', status: 'Live' },
  { link_id: 3, group_name: 'Delivery & Returns', label: 'Delivery', url: '/delivery', status: 'Live' },
  { link_id: 4, group_name: 'Delivery & Returns', label: 'Returns & Exchanges', url: '/returns', status: 'Live' },
  { link_id: 5, group_name: 'Customer Care', label: 'Gift Card', url: '/gift-cards', status: 'Live' },
  { link_id: 6, group_name: 'Customer Care', label: 'Size guide', url: '/size-guide', status: 'Live' },
  { link_id: 7, group_name: 'Customer Care', label: 'Care & Repair', url: '/care-repair', status: 'Live' },
  { link_id: 8, group_name: 'Customer Care', label: 'Frequently asked questions', url: '/faqs', status: 'Live' },
  { link_id: 9, group_name: 'Customer Care', label: 'Contact us', url: '/contact', status: 'Live' },
  { link_id: 10, group_name: 'Customer Care', label: 'Privacy policy', url: '/privacy', status: 'Live' },
  { link_id: 11, group_name: 'Customer Care', label: 'Terms & conditions', url: '/terms', status: 'Live' },
  { link_id: 12, group_name: 'Get In Touch', label: 'Message us on WhatsApp', url: 'https://wa.me/923238399480', status: 'Live' },
  { link_id: 13, group_name: 'Get In Touch', label: '+92 323 8399480', url: 'tel:+923238399480', status: 'Live' },
  { link_id: 14, group_name: 'Get In Touch', label: 'Email us:', url: 'mailto:info@lailahijabs.com', status: 'Live' },
  { link_id: 15, group_name: 'Get In Touch', label: 'info@lailahijabs.com', url: 'mailto:info@lailahijabs.com', status: 'Live' },
  { link_id: 16, group_name: 'About Us', label: 'Our Story', url: '/about', status: 'Live' },
  { link_id: 17, group_name: 'About Us', label: 'Loyalty', url: '/loyalty', status: 'Live' },
  { link_id: 18, group_name: 'About Us', label: 'Visit Us', url: '/locations', status: 'Live' },
  { link_id: 19, group_name: 'About Us', label: 'Careers', url: '/careers', status: 'Live' },
  { link_id: 20, group_name: 'About Us', label: 'Journal', url: '/blogs', status: 'Live' },
  { link_id: 21, group_name: 'About Us', label: 'Affiliates', url: '/affiliates', status: 'Live' },
];

const FooterManagerPage = ({ initialTab = 'links' }) => {
  const [links, setLinks] = useState(DEFAULT_SEED_LINKS);
  const [customColumns, setCustomColumns] = useState(['Delivery & Returns', 'Customer Care', 'Get In Touch', 'About Us']);
  const [newColumnName, setNewColumnName] = useState('');
  const [showAddColModal, setShowAddColModal] = useState(false);
  const [settings, setSettings] = useState(null);
  const [settingsForm, setSettingsForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const SOCIAL_PLATFORMS = [
    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
    { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
    { key: 'whatsapp', label: 'WhatsApp Channel', placeholder: 'https://wa.me/...' },
    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
  ];

  const fetchLinks = () => {
    fetch(`${API}/module/footer-links`)
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d) && d.length > 0) {
          const existingKeys = new Set(d.map(item => `${(item.group_name||'').toLowerCase()}::${(item.label||'').toLowerCase()}`));
          const missingSeeds = DEFAULT_SEED_LINKS.filter(s => !existingKeys.has(`${s.group_name.toLowerCase()}::${s.label.toLowerCase()}`));
          setLinks([...d, ...missingSeeds]);
        } else {
          setLinks(DEFAULT_SEED_LINKS);
        }
      })
      .catch(() => setLinks(DEFAULT_SEED_LINKS));
  };

  const fetchSettings = () => {
    fetch(`${API}/sections/footer_settings`)
      .then(r => r.json())
      .then(d => {
        setSettings(d);
        const meta = d.metadata || {};
        setSettingsForm({
          title: d.title || 'Laila Hijabs',
          subtitle: d.subtitle || 'Where modesty meets luxury',
          body_content: d.body_content || '',
          copyright: meta.copyright || '© 2026 Laila Hijabs. All rights reserved.',
          newsletter_placeholder: meta.newsletter_placeholder || 'ENTER YOUR EMAIL *',
          newsletter_button: meta.newsletter_button || 'SIGN UP',
          newsletter_text: meta.newsletter_text || 'Exclusive offers & sneak peeks are reserved for those on our mailing list, plus enjoy 10% OFF your first order.',
          follow_title: meta.follow_title || 'FOLLOW US',
          get_in_touch_title: meta.get_in_touch_title || 'Get In Touch',
          whatsapp_label: meta.whatsapp_label || 'Message us on WhatsApp',
          whatsapp_number: meta.whatsapp_number || '+92 323 8399480',
          whatsapp_link: meta.whatsapp_link || 'https://wa.me/923238399480',
          email_label: meta.email_label || 'Email us:',
          email_address: meta.email_address || 'info@lailahijabs.com',
          join_community_title: meta.join_community_title || 'Join Our Community',
          facebook: (meta.social || {}).facebook || 'https://www.facebook.com/thelailahijab/',
          instagram: (meta.social || {}).instagram || 'https://www.instagram.com/the_lailahijabs/',
          tiktok: (meta.social || {}).tiktok || 'https://www.tiktok.com/@the_lailahijabs',
          whatsapp_social: (meta.social || {}).whatsapp || 'https://wa.me/923238399480',
          youtube: (meta.social || {}).youtube || '',
          show_payment_badges: meta.show_payment_badges !== false,
          payment_badges: meta.payment_badges || ['Visa', 'Mastercard', 'PayPak', 'EasyPaisa', 'JazzCash', 'Cash on Delivery']
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLinks();
    fetchSettings();
  }, []);

  const handleSaveLink = (formData, linkId) => {
    const url = linkId ? `${API}/module/footer-links/${linkId}` : `${API}/module/footer-links`;
    fetch(url, {
      method: linkId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(() => fetchLinks())
      .catch(() => {});
  };

  const handleDeleteLink = (linkId) => {
    if (!window.confirm('Delete this footer link?')) return;
    fetch(`${API}/module/footer-links/${linkId}`, { method: 'DELETE' })
      .then(() => fetchLinks())
      .catch(() => {});
  };

  const handleToggleLink = (item) => {
    const linkId = item.link_id;
    const nextStatus = item.status === 'Live' ? 'Draft' : 'Live';
    fetch(`${API}/module/footer-links/${linkId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    })
      .then(() => fetchLinks())
      .catch(() => {});
  };

  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    fetch(`${API}/sections/footer_settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: settingsForm.title,
        subtitle: settingsForm.subtitle,
        body_content: settingsForm.body_content,
        metadata: {
          copyright: settingsForm.copyright,
          newsletter_placeholder: settingsForm.newsletter_placeholder,
          newsletter_button: settingsForm.newsletter_button,
          newsletter_text: settingsForm.newsletter_text,
          follow_title: settingsForm.follow_title,
          get_in_touch_title: settingsForm.get_in_touch_title,
          whatsapp_label: settingsForm.whatsapp_label,
          whatsapp_number: settingsForm.whatsapp_number,
          whatsapp_link: settingsForm.whatsapp_link,
          email_label: settingsForm.email_label,
          email_address: settingsForm.email_address,
          join_community_title: settingsForm.join_community_title,
          social: {
            facebook: settingsForm.facebook,
            instagram: settingsForm.instagram,
            tiktok: settingsForm.tiktok,
            whatsapp: settingsForm.whatsapp_social,
            youtube: settingsForm.youtube
          },
          show_payment_badges: settingsForm.show_payment_badges,
          payment_badges: settingsForm.payment_badges
        }
      })
    })
      .then(() => {
        setSavedSettings(true);
        setTimeout(() => setSavedSettings(false), 3000);
      })
      .finally(() => setSavingSettings(false));
  };

  const groupLinks = (groupName) => {
    if (!groupName) return [];
    const cleanTarget = groupName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return links.filter(l => {
      if (!l.group_name) return false;
      const cleanGroup = l.group_name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleanGroup === cleanTarget || l.group_name.toLowerCase() === groupName.toLowerCase();
    });
  };

  const TABS = [
    { id: 'links', label: 'Footer Link Columns' },
    { id: 'delivery', label: 'Delivery & Returns' },
    { id: 'customercare', label: 'Customer Care' },
    { id: 'aboutus', label: 'About Us' },
    { id: 'copyright', label: 'Copyright' },
    { id: 'contact', label: 'Get In Touch' },
    { id: 'community', label: 'Join Our Community' },
    { id: 'social', label: 'Social Links' }
  ];

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#E7D9C9' }}>Loading footer manager...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', borderRadius: '16px', padding: '26px 30px', border: '1px solid #B8935B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '5px' }}>GLOBAL</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>Footer Manager</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Control every link, text, contact detail, social account, and newsletter setting in the footer.
          </p>
        </div>
        {activeTab !== 'links' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {savedSettings && <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600', padding: '7px 14px', borderRadius: '8px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>Saved</span>}
            <button onClick={handleSaveSettings} disabled={savingSettings} style={{ ...btnP, opacity: savingSettings ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '7px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              {savingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '9px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', border: activeTab === tab.id ? '1px solid #B8935B' : '1px solid rgba(184,147,91,0.25)', backgroundColor: activeTab === tab.id ? '#B8935B' : '#222C1A', color: activeTab === tab.id ? '#1A2010' : '#E7D9C9', transition: 'all 0.15s' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Footer Link Columns ─────────────────────────────────────────── */}
      {activeTab === 'links' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#222C1A', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(184,147,91,0.3)' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>FOOTER STRUCTURE</div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#F6F1E3' }}>Footer Link Columns & Delivery/Returns</h3>
            </div>
            <button onClick={() => setShowAddColModal(true)} style={btnP}>+ Add New Column</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {Array.from(new Set([...customColumns, ...links.map(l => l.group_name).filter(Boolean)])).map(group => (
              <LinkListManager
                key={group}
                groupName={group}
                items={groupLinks(group)}
                onSave={handleSaveLink}
                onDelete={handleDeleteLink}
                onToggle={handleToggleLink}
              />
            ))}
          </div>

          {/* Modal to create new custom footer column */}
          {showAddColModal && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: '#222C1A', borderRadius: '14px', padding: '26px', width: '90%', maxWidth: '420px', border: '1px solid #B8935B' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Add New Footer Column</h3>
                  <button onClick={() => setShowAddColModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer' }}><CloseIcon /></button>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (newColumnName.trim()) {
                    setCustomColumns(prev => [...prev, newColumnName.trim()]);
                    setNewColumnName('');
                    setShowAddColModal(false);
                  }
                }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={lStyle}>Column Title Name *</label>
                    <input required value={newColumnName} onChange={e => setNewColumnName(e.target.value)} style={iStyle} placeholder="e.g. Delivery & Returns, Help & Support" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" onClick={() => setShowAddColModal(false)} style={btnG}>Cancel</button>
                    <button type="submit" style={btnP}>Create Column</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Delivery & Returns ─────────────────────────────────────────── */}
      {activeTab === 'delivery' && (
        <div style={{ maxWidth: '580px' }}>
          <LinkListManager
            groupName="Delivery & Returns"
            items={groupLinks("Delivery & Returns")}
            onSave={handleSaveLink}
            onDelete={handleDeleteLink}
            onToggle={handleToggleLink}
          />
        </div>
      )}

      {/* ── Tab: Customer Care ─────────────────────────────────────────────── */}
      {activeTab === 'customercare' && (
        <div style={{ maxWidth: '580px' }}>
          <LinkListManager
            groupName="Customer Care"
            items={groupLinks("Customer Care")}
            onSave={handleSaveLink}
            onDelete={handleDeleteLink}
            onToggle={handleToggleLink}
          />
        </div>
      )}

      {/* ── Tab: About Us ─────────────────────────────────────────────────── */}
      {activeTab === 'aboutus' && (
        <div style={{ maxWidth: '580px' }}>
          <LinkListManager
            groupName="About Us"
            items={groupLinks("About Us")}
            onSave={handleSaveLink}
            onDelete={handleDeleteLink}
            onToggle={handleToggleLink}
          />
        </div>
      )}

      {/* ── Tab: Copyright ───────────────────────────────────────────────────── */}
      {activeTab === 'copyright' && (
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8935B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#F6F1E3' }}>
              Dynamic Data (Lists, FAQs, Links)
            </h3>
          </div>

          <div style={{
            backgroundColor: '#182012',
            borderRadius: '12px',
            padding: '20px',
            border: settingsForm.copyright_active !== false ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.5px' }}>
                Copyright Text
              </label>
              
              {/* 3-Button Action Controls matching screenshot */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  type="button" 
                  onClick={() => setSettingsForm(p => ({ ...p, copyright_active: p.copyright_active === false ? true : false }))} 
                  style={{
                    height: '34px',
                    padding: '0 14px',
                    borderRadius: '8px',
                    backgroundColor: settingsForm.copyright_active !== false ? '#182012' : 'rgba(239,68,68,0.15)',
                    color: settingsForm.copyright_active !== false ? '#F6F1E3' : '#EF4444',
                    border: settingsForm.copyright_active !== false ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {settingsForm.copyright_active !== false ? 'Deactivate' : 'Activate'}
                </button>

                <button 
                  type="button" 
                  onClick={handleSaveSettings} 
                  style={{
                    height: '34px',
                    width: '34px',
                    borderRadius: '8px',
                    backgroundColor: '#182012',
                    border: '1px solid #B8935B',
                    color: '#F6F1E3',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    cursor: 'pointer'
                  }} 
                  title="Save Copyright"
                >
                  <EditIcon />
                </button>

                <button 
                  type="button" 
                  onClick={() => setSettingsForm(p => ({ ...p, copyright: '' }))} 
                  style={{
                    height: '34px',
                    width: '34px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.4)',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    cursor: 'pointer'
                  }} 
                  title="Clear Text"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>

            <input 
              value={settingsForm.copyright || ''} 
              onChange={e => setSettingsForm(p => ({ ...p, copyright: e.target.value }))} 
              style={{ ...iStyle, fontWeight: '500', color: settingsForm.copyright_active !== false ? '#F6F1E3' : '#888' }} 
              placeholder="2026 Laila Hijabs. All rights reserved." 
            />
          </div>
        </div>
      )}

      {/* ── Tab: Get In Touch ───────────────────────────────────────────────── */}
      {activeTab === 'contact' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 18px 0', fontSize: '15px', fontWeight: '700', color: '#F6F1E3', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            Get In Touch — Footer Column 3
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '560px' }}>
            <div><label style={lStyle}>Column Title</label><input value={settingsForm.get_in_touch_title} onChange={e => setSettingsForm(p => ({ ...p, get_in_touch_title: e.target.value }))} style={iStyle} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div><label style={lStyle}>WhatsApp Label Text</label><input value={settingsForm.whatsapp_label} onChange={e => setSettingsForm(p => ({ ...p, whatsapp_label: e.target.value }))} style={iStyle} placeholder="Message us on WhatsApp" /></div>
              <div><label style={lStyle}>WhatsApp Display Number</label><input value={settingsForm.whatsapp_number} onChange={e => setSettingsForm(p => ({ ...p, whatsapp_number: e.target.value }))} style={iStyle} placeholder="+92 323 8399480" /></div>
              <div><label style={lStyle}>WhatsApp Link (wa.me/...)</label><input value={settingsForm.whatsapp_link} onChange={e => setSettingsForm(p => ({ ...p, whatsapp_link: e.target.value }))} style={iStyle} placeholder="https://wa.me/923238399480" /></div>
              <div><label style={lStyle}>Email Label Text</label><input value={settingsForm.email_label} onChange={e => setSettingsForm(p => ({ ...p, email_label: e.target.value }))} style={iStyle} placeholder="Email us:" /></div>
            </div>
            <div><label style={lStyle}>Email Address</label><input type="email" value={settingsForm.email_address} onChange={e => setSettingsForm(p => ({ ...p, email_address: e.target.value }))} style={iStyle} placeholder="info@lailahijabs.com" /></div>
          </div>
          {/* Live Preview */}
          <div style={{ marginTop: '20px', padding: '18px', borderRadius: '10px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.2)' }}>
            <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px', marginBottom: '10px' }}>LIVE PREVIEW</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#F6F1E3', marginBottom: '8px' }}>{settingsForm.get_in_touch_title}</div>
            <div style={{ fontSize: '13px', color: '#E7D9C9', lineHeight: '1.7' }}>
              <div>{settingsForm.whatsapp_label}</div>
              <div style={{ color: '#B8935B' }}>{settingsForm.whatsapp_number}</div>
              <div style={{ marginTop: '6px' }}>{settingsForm.email_label}</div>
              <div style={{ color: '#B8935B' }}>{settingsForm.email_address}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Join Our Community ─────────────────────────────────────────── */}
      {activeTab === 'community' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 18px 0', fontSize: '15px', fontWeight: '700', color: '#F6F1E3', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            Join Our Community — Newsletter Column (Col 5)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '560px' }}>
            <div><label style={lStyle}>Column Title</label><input value={settingsForm.join_community_title} onChange={e => setSettingsForm(p => ({ ...p, join_community_title: e.target.value }))} style={iStyle} /></div>
            <div><label style={lStyle}>Newsletter Description Text</label><textarea rows={3} value={settingsForm.newsletter_text} onChange={e => setSettingsForm(p => ({ ...p, newsletter_text: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div><label style={lStyle}>Email Input Placeholder</label><input value={settingsForm.newsletter_placeholder} onChange={e => setSettingsForm(p => ({ ...p, newsletter_placeholder: e.target.value }))} style={iStyle} placeholder="ENTER YOUR EMAIL *" /></div>
              <div><label style={lStyle}>Sign Up Button Text</label><input value={settingsForm.newsletter_button} onChange={e => setSettingsForm(p => ({ ...p, newsletter_button: e.target.value }))} style={iStyle} placeholder="SIGN UP" /></div>
            </div>
            <div><label style={lStyle}>"Follow Us" Section Title</label><input value={settingsForm.follow_title} onChange={e => setSettingsForm(p => ({ ...p, follow_title: e.target.value }))} style={iStyle} placeholder="FOLLOW US" /></div>
          </div>
          {/* Preview */}
          <div style={{ marginTop: '20px', padding: '18px', borderRadius: '10px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.2)', maxWidth: '400px' }}>
            <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px', marginBottom: '10px' }}>LIVE PREVIEW</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#F6F1E3', marginBottom: '8px' }}>{settingsForm.join_community_title}</div>
            <div style={{ fontSize: '12px', color: '#E7D9C9', lineHeight: '1.6', marginBottom: '12px' }}>{settingsForm.newsletter_text}</div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              <div style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', backgroundColor: '#222C1A', border: '1px solid rgba(184,147,91,0.3)', fontSize: '11px', color: '#B8A99A' }}>{settingsForm.newsletter_placeholder}</div>
              <div style={{ padding: '8px 14px', borderRadius: '4px', backgroundColor: '#B8935B', fontSize: '11px', fontWeight: '700', color: '#1A2010' }}>{settingsForm.newsletter_button}</div>
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#F6F1E3' }}>{settingsForm.follow_title}</div>
          </div>
        </div>
      )}

      {/* ── Tab: Social Media ───────────────────────────────────────────────── */}
      {activeTab === 'social' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 18px 0', fontSize: '15px', fontWeight: '700', color: '#F6F1E3', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            Social Media Links — Footer Icons
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '540px' }}>
            {SOCIAL_PLATFORMS.map(({ key, label, placeholder }) => {
              const fieldKey = key === 'whatsapp' ? 'whatsapp_social' : key;
              const val = settingsForm[fieldKey] || '';
              const isSet = val.trim().length > 0;
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <label style={lStyle}>{label}</label>
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '8px', fontWeight: '700', color: isSet ? '#22c55e' : '#B8A99A', backgroundColor: isSet ? 'rgba(34,197,94,0.1)' : 'rgba(184,147,91,0.08)', border: `1px solid ${isSet ? 'rgba(34,197,94,0.3)' : 'rgba(184,147,91,0.2)'}` }}>
                      {isSet ? 'Active' : 'Not Set'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input value={val} onChange={e => setSettingsForm(p => ({ ...p, [fieldKey]: e.target.value }))} style={iStyle} placeholder={placeholder} />
                    {isSet && (
                      <button onClick={() => setSettingsForm(p => ({ ...p, [fieldKey]: '' }))} style={{ ...btnD, flexShrink: 0, padding: '8px 12px' }} title="Remove"><TrashIcon /></button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tab: General Settings ───────────────────────────────────────────── */}
      {activeTab === 'general' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 18px 0', fontSize: '15px', fontWeight: '700', color: '#F6F1E3', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            Footer General Settings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '560px' }}>
            <div><label style={lStyle}>Brand / Logo Text</label><input value={settingsForm.title} onChange={e => setSettingsForm(p => ({ ...p, title: e.target.value }))} style={iStyle} /></div>
            <div><label style={lStyle}>Tagline Below Logo</label><input value={settingsForm.subtitle} onChange={e => setSettingsForm(p => ({ ...p, subtitle: e.target.value }))} style={iStyle} /></div>
            <div><label style={lStyle}>Brand Description</label><textarea rows={3} value={settingsForm.body_content} onChange={e => setSettingsForm(p => ({ ...p, body_content: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} /></div>
            <div><label style={lStyle}>Copyright Line</label><input value={settingsForm.copyright} onChange={e => setSettingsForm(p => ({ ...p, copyright: e.target.value }))} style={iStyle} /></div>
          </div>
          {/* Live Preview */}
          <div style={{ marginTop: '20px', padding: '18px', borderRadius: '10px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.2)' }}>
            <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px', marginBottom: '10px' }}>LIVE PREVIEW</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#F6F1E3' }}>{settingsForm.title}</div>
            <div style={{ fontSize: '13px', color: '#B8935B', marginTop: '4px' }}>{settingsForm.subtitle}</div>
            {settingsForm.body_content && <div style={{ fontSize: '12px', color: '#E7D9C9', marginTop: '8px', lineHeight: '1.6' }}>{settingsForm.body_content}</div>}
            <div style={{ fontSize: '11px', color: '#B8A99A', marginTop: '14px', borderTop: '1px solid rgba(184,147,91,0.15)', paddingTop: '10px' }}>{settingsForm.copyright}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterManagerPage;
