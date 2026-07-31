import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Full CRUD page for managing the Footer — sourced directly from Footer.jsx:
 *  Col 1: Delivery & Returns links
 *  Col 2: Customer Care links
 *  Col 3: Get In Touch (WhatsApp, Email, label text)
 *  Col 4: About Us links
 *  Col 5: Join Our Community (newsletter text, button, social media links)
 *  Bottom: Copyright line
 */

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

// Palette: Olive deep (#3E4930), Cream (#F6F1E3), Gold (#B8935B), Blush (#E7D9C9)
const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#F6F1E3', border: '1px solid #B8935B', color: '#3E4930', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#3E4930', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const card = { backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1px solid #E7D9C9', boxShadow: '0 2px 8px rgba(62, 73, 48, 0.04)' };
const btnP = { padding: '9px 18px', borderRadius: '6px', backgroundColor: '#3E4930', border: 'none', color: '#F6F1E3', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnG = { padding: '7px 14px', borderRadius: '6px', backgroundColor: '#F6F1E3', border: '1px solid #B8935B', color: '#3E4930', fontSize: '12px', cursor: 'pointer' };
const btnD = { padding: '7px 12px', borderRadius: '6px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' };

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
  const [disabledCol, setDisabledCol] = useState(false);
  const navigate = useNavigate();

  const openAdd = () => { setForm({ label: '', url: '', status: 'Live' }); setEditItem(null); setShowModal(true); };
  const openEdit = (item) => { setForm({ label: item.label, url: item.url, status: item.status || 'Live' }); setEditItem(item); setShowModal(true); };
  const handleSave = (e) => {
    e.preventDefault();
    onSave({ ...form, group_name: groupName }, editItem?.link_id);
    setShowModal(false);
  };

  const handleToggleAll = () => {
    const nextDisabled = !disabledCol;
    setDisabledCol(nextDisabled);
    items.forEach(item => {
      if ((nextDisabled && item.status === 'Live') || (!nextDisabled && item.status === 'Hidden')) {
        onToggle(item);
      }
    });
  };

  return (
    <div style={{ ...card, opacity: disabledCol ? 0.6 : 1, transition: 'opacity 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px', marginBottom: '3px' }}>FOOTER COLUMN</div>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#3E4930' }}>{groupName}</h3>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={handleToggleAll} style={{ ...btnG, backgroundColor: disabledCol ? '#3E4930' : '#FEE2E2', color: disabledCol ? '#F6F1E3' : '#DC2626', borderColor: disabledCol ? '#3E4930' : '#FCA5A5', fontWeight: '700' }}>
            {disabledCol ? 'Enable Column' : 'Disable Column'}
          </button>
          <button onClick={openAdd} style={btnP}>+ Add Link</button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280', fontSize: '12px' }}>No links yet. Add your first link.</div>
        ) : items.map(item => (
          <div key={item.link_id || item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '6px', backgroundColor: '#F6F1E3', border: '1px solid #E7D9C9' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#3E4930', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</div>
              <div style={{ fontSize: '11px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.url}</div>
            </div>
            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '8px', fontWeight: '700', color: item.status === 'Live' ? '#15803D' : '#6B7280', backgroundColor: item.status === 'Live' ? 'rgba(34,197,94,0.15)' : '#E7D9C9', border: `1px solid ${item.status === 'Live' ? 'rgba(34,197,94,0.3)' : '#B8935B'}`, whiteSpace: 'nowrap', flexShrink: 0 }}>
              {item.status || 'Live'}
            </span>
            <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
              <button onClick={() => onToggle(item)} style={{ ...btnG, padding: '5px 10px', fontSize: '11px', fontWeight: '700', backgroundColor: item.status === 'Live' ? '#FEE2E2' : '#E0E7FF', color: item.status === 'Live' ? '#DC2626' : '#3730A3', borderColor: item.status === 'Live' ? '#FCA5A5' : '#A5B4FC' }}>
                {item.status === 'Live' ? 'Hide' : 'Show'}
              </button>
              {item.url && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const cleanUrl = (item.url || '').trim().toLowerCase();
                    let targetRoute = '';
                    
                    if (['/about', '/our-story', 'about', 'our-story'].includes(cleanUrl)) targetRoute = '/sections/about_who_we_are';
                    else if (['/contact-us', '/contact', 'contact-us', 'contact'].includes(cleanUrl)) targetRoute = '/sections/contact_main_section';
                    else if (['/faqs', '/faq', 'faqs', 'faq'].includes(cleanUrl)) targetRoute = '/faqs';
                    else if (['/size-guide', 'size-guide'].includes(cleanUrl)) targetRoute = '/size-guide';
                    else if (['/locations', '/visit-us', 'locations', 'visit-us'].includes(cleanUrl)) targetRoute = '/locations';
                    else if (['/blogs', '/journal', 'blogs', 'journal'].includes(cleanUrl)) targetRoute = '/sections/blogs_page_header';
                    else if (['/affiliate', '/affiliate-program', '/affiliates'].includes(cleanUrl)) targetRoute = '/sections/affiliate_program_settings';
                    else if (['/gift-card', '/gift-cards', 'gift-card', 'gift-cards'].includes(cleanUrl)) targetRoute = '/sections/gift_card';
                    else if (['/custom-orders', 'custom-orders'].includes(cleanUrl)) targetRoute = '/sections/custom_orders_settings';
                    else if (cleanUrl.includes('category') || cleanUrl.includes('categories')) targetRoute = '/categories-mega-menu';
                    else if (cleanUrl.includes('product')) targetRoute = '/products';
                    else {
                      const pageKey = cleanUrl.replace(/^\//, '').replace(/[^a-z0-9_]/g, '_') || 'footer_settings';
                      targetRoute = `/sections/${pageKey}`;
                    }

                    navigate(targetRoute);
                  }}
                  style={{ ...btnG, padding: '5px 8px', backgroundColor: '#3E4930', color: '#F6F1E3', borderColor: '#3E4930' }}
                  title={`Edit Linked Page (${item.url})`}
                >
                  <EditIcon />
                </button>
              )}
              <button onClick={() => openEdit(item)} style={{ ...btnG, padding: '5px 8px' }} title="Edit Link Text & URL">
                ✏️
              </button>
              <button onClick={() => onDelete(item.link_id)} style={btnD} title="Delete Link">
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to add / edit link */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(62,73,48,0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '26px', width: '90%', maxWidth: '440px', border: '1px solid #E7D9C9', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#3E4930' }}>
                {editItem ? 'Edit Footer Link' : `Add Link to ${groupName}`}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#3E4930', cursor: 'pointer' }}><CloseIcon /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={lStyle}>Link Display Text *</label>
                <input required value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} style={iStyle} placeholder="e.g. Delivery & Returns" />
              </div>
              <div>
                <label style={lStyle}>Target URL / Page Route *</label>
                <input required value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} style={iStyle} placeholder="e.g. /about, /contact, /size-guide, https://..." />
              </div>
              <div>
                <label style={lStyle}>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={iStyle}>
                  <option value="Live">Live (Visible)</option>
                  <option value="Hidden">Hidden (Draft)</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnG}>Cancel</button>
                <button type="submit" style={btnP}>{editItem ? 'Update Link' : 'Add Link'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Page Component ───────────────────────────────────────────────────────
const FooterManagerPage = ({ initialTab = 'links' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [links, setLinks] = useState([]);
  const [customColumns, setCustomColumns] = useState([]);
  const [showAddColModal, setShowAddColModal] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);

  const [settingsForm, setSettingsForm] = useState({
    title: 'LAILA',
    subtitle: 'HIJABS',
    body_content: 'Premium Islamic fashion crafted for modern elegance and daily comfort.',
    copyright: '2026 Laila Hijabs. All rights reserved.',
    get_in_touch_title: 'GET IN TOUCH',
    whatsapp_label: 'Message us on WhatsApp',
    whatsapp_number: '+92 323 8399480',
    whatsapp_link: 'https://wa.me/923238399480',
    email_label: 'Email us:',
    email_address: 'info@lailahijabs.com',
    join_community_title: 'JOIN OUR COMMUNITY',
    newsletter_text: 'Subscribe for exclusive offers and modest fashion drops.',
    newsletter_placeholder: 'ENTER YOUR EMAIL *',
    newsletter_button: 'SIGN UP',
    follow_title: 'FOLLOW US',
    facebook: '',
    instagram: '',
    tiktok: '',
    pinterest: '',
    whatsapp_social: '',
    youtube: ''
  });

  const SOCIAL_PLATFORMS = [
    { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/lailahijabs' },
    { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/lailahijabs' },
    { key: 'tiktok', label: 'TikTok URL', placeholder: 'https://tiktok.com/@lailahijabs' },
    { key: 'pinterest', label: 'Pinterest URL', placeholder: 'https://pinterest.com/lailahijabs' },
    { key: 'youtube', label: 'YouTube Channel URL', placeholder: 'https://youtube.com/@lailahijabs' },
    { key: 'whatsapp', label: 'WhatsApp direct link', placeholder: 'https://wa.me/923238399480' }
  ];

  const fetchLinks = () => {
    fetch(`${API}/module/footer-links`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setLinks(data); })
      .catch(console.error);
  };

  const fetchSettings = () => {
    fetch(`${API}/sections/footer_settings`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const map = {};
          data.forEach(item => { map[item.content_key] = item.content_value; });
          setSettingsForm(prev => ({ ...prev, ...map }));
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    Promise.all([fetchLinks(), fetchSettings()])
      .finally(() => setLoading(false));
  }, []);

  const handleSaveLink = (formData, linkId) => {
    const url = linkId ? `${API}/module/footer-links/${linkId}` : `${API}/module/footer-links`;
    const method = linkId ? 'PUT' : 'POST';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(() => fetchLinks())
      .catch(console.error);
  };

  const handleDeleteLink = (linkId) => {
    if (!window.confirm('Delete this footer link?')) return;
    fetch(`${API}/module/footer-links/${linkId}`, { method: 'DELETE' })
      .then(() => fetchLinks())
      .catch(console.error);
  };

  const handleToggleLink = (item) => {
    const newStatus = item.status === 'Live' ? 'Hidden' : 'Live';
    // Instant UI update
    setLinks(prev => prev.map(l => l.link_id === item.link_id ? { ...l, status: newStatus } : l));

    fetch(`${API}/module/footer-links/${item.link_id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(() => fetchLinks())
      .catch(console.error);
  };

  const handleSaveSettings = () => {
    setSavingSettings(true);
    fetch(`${API}/sections/footer_settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsForm)
    })
      .then(res => res.json())
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

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#3E4930', fontWeight: '600' }}>Loading footer manager...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>

      {/* Top Bar: Tabs & Save Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', border: activeTab === tab.id ? '1px solid #B8935B' : '1px solid #E7D9C9', backgroundColor: activeTab === tab.id ? '#3E4930' : '#FFFFFF', color: activeTab === tab.id ? '#F6F1E3' : '#3E4930', transition: 'all 0.15s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== 'links' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {savedSettings && <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>Saved</span>}
            <button onClick={handleSaveSettings} disabled={savingSettings} style={{ ...btnP, backgroundColor: '#3E4930', color: '#F6F1E3', opacity: savingSettings ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '7px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              {savingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </div>

      {/* ── Tab: Footer Link Columns ─────────────────────────────────────────── */}
      {activeTab === 'links' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '18px 24px', borderRadius: '12px', border: '1px solid #E7D9C9', boxShadow: '0 2px 8px rgba(62,73,48,0.04)' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>FOOTER STRUCTURE</div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#3E4930' }}>Footer Link Columns & Delivery/Returns</h3>
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
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(62,73,48,0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '26px', width: '90%', maxWidth: '420px', border: '1px solid #E7D9C9', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#3E4930' }}>Add New Footer Column</h3>
                  <button onClick={() => setShowAddColModal(false)} style={{ background: 'none', border: 'none', color: '#3E4930', cursor: 'pointer' }}><CloseIcon /></button>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #E7D9C9', paddingBottom: '12px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8935B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#3E4930' }}>
              Copyright Notice & Settings
            </h3>
          </div>

          <div style={{
            backgroundColor: '#F6F1E3',
            borderRadius: '8px',
            padding: '20px',
            border: '1px solid #E7D9C9',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#3E4930', letterSpacing: '0.5px' }}>
                Copyright Line
              </label>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  type="button" 
                  onClick={() => setSettingsForm(p => ({ ...p, copyright_active: p.copyright_active === false ? true : false }))} 
                  style={{
                    height: '34px',
                    padding: '0 14px',
                    borderRadius: '6px',
                    backgroundColor: settingsForm.copyright_active !== false ? '#3E4930' : '#FEE2E2',
                    color: settingsForm.copyright_active !== false ? '#F6F1E3' : '#DC2626',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {settingsForm.copyright_active !== false ? 'Active' : 'Disabled'}
                </button>
              </div>
            </div>

            <input 
              value={settingsForm.copyright || ''} 
              onChange={e => setSettingsForm(p => ({ ...p, copyright: e.target.value }))} 
              style={{ ...iStyle, fontWeight: '500' }} 
              placeholder="2026 Laila Hijabs. All rights reserved." 
            />
          </div>
        </div>
      )}

      {/* ── Tab: Get In Touch ───────────────────────────────────────────────── */}
      {activeTab === 'contact' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 18px 0', fontSize: '15px', fontWeight: '700', color: '#3E4930', borderBottom: '1px solid #E7D9C9', paddingBottom: '12px' }}>
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
          <div style={{ marginTop: '20px', padding: '18px', borderRadius: '8px', backgroundColor: '#F6F1E3', border: '1px solid #E7D9C9' }}>
            <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px', marginBottom: '10px' }}>LIVE PREVIEW</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#3E4930', marginBottom: '8px' }}>{settingsForm.get_in_touch_title}</div>
            <div style={{ fontSize: '13px', color: '#3E4930', lineHeight: '1.7' }}>
              <div>{settingsForm.whatsapp_label}</div>
              <div style={{ color: '#B8935B', fontWeight: '600' }}>{settingsForm.whatsapp_number}</div>
              <div style={{ marginTop: '6px' }}>{settingsForm.email_label}</div>
              <div style={{ color: '#B8935B', fontWeight: '600' }}>{settingsForm.email_address}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Join Our Community ─────────────────────────────────────────── */}
      {activeTab === 'community' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 18px 0', fontSize: '15px', fontWeight: '700', color: '#3E4930', borderBottom: '1px solid #E7D9C9', paddingBottom: '12px' }}>
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
          <div style={{ marginTop: '20px', padding: '18px', borderRadius: '8px', backgroundColor: '#F6F1E3', border: '1px solid #E7D9C9', maxWidth: '400px' }}>
            <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px', marginBottom: '10px' }}>LIVE PREVIEW</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#3E4930', marginBottom: '8px' }}>{settingsForm.join_community_title}</div>
            <div style={{ fontSize: '12px', color: '#3E4930', lineHeight: '1.6', marginBottom: '12px' }}>{settingsForm.newsletter_text}</div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              <div style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', backgroundColor: '#FFFFFF', border: '1px solid #B8935B', fontSize: '11px', color: '#6B7280' }}>{settingsForm.newsletter_placeholder}</div>
              <div style={{ padding: '8px 14px', borderRadius: '4px', backgroundColor: '#3E4930', fontSize: '11px', fontWeight: '700', color: '#F6F1E3' }}>{settingsForm.newsletter_button}</div>
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#3E4930' }}>{settingsForm.follow_title}</div>
          </div>
        </div>
      )}

      {/* ── Tab: Social Media ───────────────────────────────────────────────── */}
      {activeTab === 'social' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 18px 0', fontSize: '15px', fontWeight: '700', color: '#3E4930', borderBottom: '1px solid #E7D9C9', paddingBottom: '12px' }}>
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
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '8px', fontWeight: '700', color: isSet ? '#22c55e' : '#6B7280', backgroundColor: isSet ? 'rgba(34,197,94,0.15)' : '#E7D9C9', border: `1px solid ${isSet ? 'rgba(34,197,94,0.3)' : '#B8935B'}` }}>
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
    </div>
  );
};

export default FooterManagerPage;
