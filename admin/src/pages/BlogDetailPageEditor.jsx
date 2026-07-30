import React, { useState, useEffect } from 'react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const cardStyle = { backgroundColor: '#222C1A', borderRadius: '14px', padding: '22px', border: '1px solid rgba(184,147,91,0.25)' };
const btnP = { padding: '9px 18px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnG = { padding: '7px 12px', borderRadius: '6px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' };
const btnD = { padding: '7px 10px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#EF4444', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' };

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

const BlogDetailPageEditor = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    blog_id: '',
    category: 'Fabric & Care',
    title: 'Chiffon vs. Jersey vs. Silk: Which Fabric Fits Your Day?',
    published_date: 'June 24, 2026',
    read_time: '3 min read',
    image_url: '/hero1.png',
    excerpt: 'Choosing the right fabric is essential for comfort and style. Chiffon offers a lightweight, airy feel...',
    content: 'Choosing the right fabric is essential for comfort and style. Chiffon offers a lightweight, airy feel, perfect for formal occasions or warm days. Jersey, on the other hand, is the ultimate everyday companion—stretchy, breathable, and requiring no pins. Mulberry silk delivers unmatched elegance and luxury with hand-rolled edges, making it ideal for Eid or special celebrations. Learn how to pair your abayas with these materials for the perfect drape every time.',
    conclusion: 'At Laila Hijabs, we believe that modest wear should never compromise on comfort or aesthetics. Every pattern we draft is focused on providing full coverage while maintaining fluid movements and a tailored finish. Stay tuned for more fabric care tips and styling inspirations from our designers.',
    back_btn_text: 'Back to All Posts',
    back_btn_url: '/blogs',
    chat_btn_text: 'Chat With Us',
    chat_whatsapp: '+923238399480',
    status: 'Live'
  });

  const fetchBlogs = () => {
    setLoading(true);
    fetch(`${API}/module/blogs`)
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d) ? d : [];
        setBlogs(list);
        if (list.length > 0) {
          populateForm(list[0]);
        }
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const populateForm = (b) => {
    if (!b) return;
    setForm({
      blog_id: b.blog_id || b.id,
      category: b.category || 'Fabric & Care',
      title: b.title || '',
      published_date: b.published_date || b.created_at || 'June 24, 2026',
      read_time: b.read_time || '3 min read',
      image_url: b.image_url || '/hero1.png',
      excerpt: b.excerpt || '',
      content: b.content || '',
      conclusion: b.conclusion || 'At Laila Hijabs, we believe that modest wear should never compromise on comfort or aesthetics. Every pattern we draft is focused on providing full coverage while maintaining fluid movements and a tailored finish.',
      back_btn_text: b.back_btn_text || 'Back to All Posts',
      back_btn_url: b.back_btn_url || '/blogs',
      chat_btn_text: b.chat_btn_text || 'Chat With Us',
      chat_whatsapp: b.chat_whatsapp || '+923238399480',
      status: b.status || 'Live'
    });
  };

  const handleSelectBlog = (idx) => {
    setSelectedIndex(idx);
    populateForm(blogs[idx]);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    const id = form.blog_id;
    const url = id ? `${API}/module/blogs/${id}` : `${API}/module/blogs`;

    fetch(url, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchBlogs();
      })
      .finally(() => setSaving(false));
  };

  const handleToggleStatus = () => {
    if (!form.blog_id) return;
    const nextStatus = form.status === 'Live' ? 'Draft' : 'Live';
    fetch(`${API}/module/blogs/${form.blog_id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    }).then(() => {
      setForm(prev => ({ ...prev, status: nextStatus }));
      fetchBlogs();
    });
  };

  const handleDeleteBlog = () => {
    if (!form.blog_id || !window.confirm(`Delete article "${form.title}"?`)) return;
    fetch(`${API}/module/blogs/${form.blog_id}`, { method: 'DELETE' }).then(fetchBlogs);
  };

  const openAddNewBlog = () => {
    setForm({
      blog_id: '',
      category: 'Fabric & Care',
      title: 'New Article Title',
      published_date: 'June 24, 2026',
      read_time: '3 min read',
      image_url: '/hero1.png',
      excerpt: '',
      content: '',
      conclusion: 'At Laila Hijabs, we believe that modest wear should never compromise on comfort or aesthetics.',
      back_btn_text: 'Back to All Posts',
      back_btn_url: '/blogs',
      chat_btn_text: 'Chat With Us',
      chat_whatsapp: '+923238399480',
      status: 'Live'
    });
    setSelectedIndex(-1);
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#E7D9C9' }}>Loading Blogs Detail Page Editor...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', borderRadius: '16px', padding: '24px 28px', border: '1px solid #B8935B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '5px' }}>EDITORIAL DETAIL PAGES</div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#F6F1E3' }}>Blogs Detail Page Manager</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Select any blog article to edit its Category, Title, Photo, Read Time, Full Content, Conclusion, Back Button, and Chat With Us button.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saved && <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600', padding: '7px 14px', borderRadius: '8px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>Saved Blog Detail!</span>}
          <button onClick={openAddNewBlog} style={btnP}>+ Add New Article</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
        
        {/* Blog Selector Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>SELECT ARTICLE TO EDIT ({blogs.length})</div>
          {blogs.map((b, idx) => {
            const isSelected = idx === selectedIndex;
            const isLive = b.status === 'Live' || b.status === 'Active';
            return (
              <div
                key={b.blog_id || b.id || idx}
                onClick={() => handleSelectBlog(idx)}
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
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B' }}>{b.category || 'Fabric & Care'}</span>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    color: isLive ? '#22c55e' : '#EF4444',
                    backgroundColor: isLive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${isLive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                  }}>
                    {isLive ? 'Live' : 'Draft'}
                  </span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#F6F1E3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                <div style={{ fontSize: '11px', color: '#B8A99A', marginTop: '4px' }}>{b.published_date || 'June 24, 2026'} · {b.read_time || '3 min read'}</div>
              </div>
            );
          })}
        </div>

        {/* Blog Detail Editor Form & Live Preview */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>EDITING BLOG DETAIL CONTENT</span>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#F6F1E3' }}>{form.title || 'Blog Detail Content'}</h3>
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
                {form.status === 'Live' ? 'Deactivate Article' : 'Activate Article'}
              </button>
              <button type="button" onClick={handleDeleteBlog} style={btnD} title="Delete Article"><TrashIcon /></button>
              <button type="button" onClick={handleSave} disabled={saving} style={btnP}>
                {saving ? 'Saving...' : 'Save Blog Article'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Category Badge *</label>
                <input required value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={iStyle} placeholder="Fabric & Care" />
              </div>
              <div>
                <label style={lStyle}>Published Date *</label>
                <input required value={form.published_date} onChange={e => setForm(p => ({ ...p, published_date: e.target.value }))} style={iStyle} placeholder="June 24, 2026" />
              </div>
              <div>
                <label style={lStyle}>Read Time *</label>
                <input required value={form.read_time} onChange={e => setForm(p => ({ ...p, read_time: e.target.value }))} style={iStyle} placeholder="3 min read" />
              </div>
            </div>

            <div>
              <label style={lStyle}>Article Title *</label>
              <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={iStyle} placeholder="Chiffon vs. Jersey vs. Silk: Which Fabric Fits Your Day?" />
            </div>

            <div>
              <label style={lStyle}>Featured Article Cover Image URL *</label>
              <input required value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} style={iStyle} placeholder="/hero1.png or https://..." />
            </div>

            <div>
              <label style={lStyle}>Main Body Content (Paragraph 1) *</label>
              <textarea rows={4} required value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="Choosing the right fabric is essential for comfort and style..." />
            </div>

            <div>
              <label style={lStyle}>Conclusion Content (Paragraph 2 / Studio Promise) *</label>
              <textarea rows={3} required value={form.conclusion} onChange={e => setForm(p => ({ ...p, conclusion: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="At Laila Hijabs, we believe that modest wear should never compromise..." />
            </div>

            {/* Action Buttons Customizer */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '6px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
              <div>
                <label style={lStyle}>"Back to All Posts" Button Label & URL</label>
                <input value={form.back_btn_text} onChange={e => setForm(p => ({ ...p, back_btn_text: e.target.value }))} style={{ ...iStyle, marginBottom: '6px' }} placeholder="Back to All Posts" />
                <input value={form.back_btn_url} onChange={e => setForm(p => ({ ...p, back_btn_url: e.target.value }))} style={iStyle} placeholder="/blogs" />
              </div>
              <div>
                <label style={lStyle}>"Chat With Us" Button Label & WhatsApp Number</label>
                <input value={form.chat_btn_text} onChange={e => setForm(p => ({ ...p, chat_btn_text: e.target.value }))} style={{ ...iStyle, marginBottom: '6px' }} placeholder="Chat With Us" />
                <input value={form.chat_whatsapp} onChange={e => setForm(p => ({ ...p, chat_whatsapp: e.target.value }))} style={iStyle} placeholder="+923238399480" />
              </div>
            </div>

            {/* Live Article Detail Preview */}
            <div style={{ marginTop: '10px', padding: '24px', borderRadius: '14px', backgroundColor: '#FDFBF7', border: '1px solid #B8935B' }}>
              <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1px', marginBottom: '12px' }}>LIVE BLOG DETAIL PAGE PREVIEW</div>
              
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', textTransform: 'uppercase' }}>{form.category}</div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1A2010', margin: '6px 0 8px 0' }}>{form.title}</h2>
              <div style={{ fontSize: '12px', color: '#777', marginBottom: '16px' }}>{form.published_date} · {form.read_time}</div>

              {/* Picture Placeholder */}
              <div style={{ backgroundColor: '#EFEBE4', borderRadius: '10px', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#888', marginBottom: '16px', border: '1px dashed #B8935B' }}>
                📸 Cover Photo Preview: {form.image_url}
              </div>

              <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.6', marginBottom: '14px' }}>{form.content}</div>
              <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.6', marginBottom: '20px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>{form.conclusion}</div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button type="button" style={{ padding: '10px 18px', borderRadius: '8px', backgroundColor: '#3E4930', color: '#F6F1E3', border: 'none', fontSize: '12px', fontWeight: '700' }}>
                  ← {form.back_btn_text}
                </button>
                <button type="button" style={{ padding: '10px 18px', borderRadius: '8px', backgroundColor: '#B8935B', color: '#1A2010', border: 'none', fontSize: '12px', fontWeight: '700' }}>
                  💬 {form.chat_btn_text} ({form.chat_whatsapp})
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPageEditor;
