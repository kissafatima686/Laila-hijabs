import React, { useState, useEffect } from 'react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const cardStyle = { backgroundColor: '#222C1A', borderRadius: '14px', padding: '22px', border: '1px solid rgba(184,147,91,0.25)' };
const btnP = { padding: '9px 18px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnG = { padding: '7px 12px', borderRadius: '6px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer' };
const btnD = { padding: '7px 10px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#EF4444', fontSize: '12px', cursor: 'pointer' };

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

const BlogsPageManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({
    // Section 1: Hero Header
    sec1_tag: 'THE EDIT',
    sec1_title: 'Style Notes & Modesty Stories',
    sec1_subtitle: 'Your go-to source for modest fashion inspiration, care tips, and styling guides.',
    sec1_body: 'Styling ideas, fabric guides, and quiet reflections from our studio — written for the woman who wears her modesty with confidence.',
    sec1_active: true,

    // Section 2: Filters & Search Bar Keywords
    search_placeholder: 'Search articles, fabrics, styling tips...',
    filter_categories: 'All, Styling Guides, Fabric Care, Brand Stories, Modest Fashion',
    global_keywords: 'chiffon, silk, jersey, hijab styling, abaya care, lahore studio, modest wear',
    sec2_active: true,

    // Section 3: Blog Posts Arrangement
    featured_blog_id: '',
    blogs_per_page: '9',
    sort_order: 'Newest First',
    sec3_active: true,

    // Section 4 & 5: Stay in the Loop Newsletter
    sec5_title: 'Stay in the Loop',
    sec5_subtitle: 'New stories, sent straight to you',
    sec5_body: 'Styling ideas and fabric guides once or twice a month — no spam, just soft launches and quiet reads.',
    email_placeholder: 'Your email address',
    subscribe_btn_text: 'Subscribe',
    sec5_active: true
  });

  const fetchData = () => {
    setLoading(true);
    fetch(`${API}/sections/blogs_page_header`)
      .then(r => r.json())
      .then(d => {
        if (d && d.title) {
          const meta = d.metadata || {};
          setForm(prev => ({
            ...prev,
            sec1_title: d.title || prev.sec1_title,
            sec1_subtitle: d.subtitle || prev.sec1_subtitle,
            sec1_body: d.body_content || prev.sec1_body,
            sec1_tag: meta.sec1_tag || prev.sec1_tag,
            sec1_active: meta.sec1_active !== false,
            search_placeholder: meta.search_placeholder || prev.search_placeholder,
            filter_categories: meta.filter_categories || prev.filter_categories,
            global_keywords: meta.global_keywords || prev.global_keywords,
            sec2_active: meta.sec2_active !== false,
            featured_blog_id: meta.featured_blog_id || prev.featured_blog_id,
            blogs_per_page: meta.blogs_per_page || prev.blogs_per_page,
            sort_order: meta.sort_order || prev.sort_order,
            sec3_active: meta.sec3_active !== false,
            sec5_title: meta.sec5_title || prev.sec5_title,
            sec5_subtitle: meta.sec5_subtitle || prev.sec5_subtitle,
            sec5_body: meta.sec5_body || prev.sec5_body,
            email_placeholder: meta.email_placeholder || prev.email_placeholder,
            subscribe_btn_text: meta.subscribe_btn_text || prev.subscribe_btn_text,
            sec5_active: meta.sec5_active !== false
          }));
        }
      })
      .catch(() => {});

    fetch(`${API}/module/blogs`)
      .then(r => r.json())
      .then(b => setArticles(Array.isArray(b) ? b : []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);

    fetch(`${API}/sections/blogs_page_header`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.sec1_title,
        subtitle: form.sec1_subtitle,
        body_content: form.sec1_body,
        metadata: {
          sec1_tag: form.sec1_tag,
          sec1_active: form.sec1_active,
          search_placeholder: form.search_placeholder,
          filter_categories: form.filter_categories,
          global_keywords: form.global_keywords,
          sec2_active: form.sec2_active,
          featured_blog_id: form.featured_blog_id,
          blogs_per_page: form.blogs_per_page,
          sort_order: form.sort_order,
          sec3_active: form.sec3_active,
          sec5_title: form.sec5_title,
          sec5_subtitle: form.sec5_subtitle,
          sec5_body: form.sec5_body,
          email_placeholder: form.email_placeholder,
          subscribe_btn_text: form.subscribe_btn_text,
          sec5_active: form.sec5_active
        }
      })
    })
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      })
      .finally(() => setSaving(false));
  };

  const handleArticleKeywordChange = (artId, newKeywords) => {
    fetch(`${API}/module/blogs/${artId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywords: newKeywords })
    }).then(fetchData);
  };

  const handleToggleArticleStatus = (art) => {
    const artId = art.blog_id || art.id;
    const nextStatus = art.status === 'Live' ? 'Draft' : 'Live';
    fetch(`${API}/module/blogs/${artId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    }).then(fetchData);
  };

  const handleCreateBlog = () => {
    const title = prompt('Enter New Blog Title:');
    if (!title) return;
    fetch(`${API}/module/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        category: 'Styling Guides',
        excerpt: 'Short summary of the new article...',
        content: 'Full body text of the new blog post.',
        status: 'Draft',
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      })
    }).then(fetchData);
  };

  const handleDeleteBlog = (art) => {
    const artId = art.blog_id || art.id;
    if (!window.confirm(`Delete article "${art.title}" permanently?`)) return;
    fetch(`${API}/module/blogs/${artId}`, { method: 'DELETE' }).then(fetchData);
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#E7D9C9' }}>Loading Blogs Page Manager...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '60px' }}>
      
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', borderRadius: '16px', padding: '26px 30px', border: '1px solid #B8935B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '5px' }}>BLOGS & EDITORIAL</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>Blogs Page Manager</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Control Header Banner, Filters & Keywords, Article Arrangement, and Newsletter Loop Banner.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button type="button" onClick={handleCreateBlog} style={btnG}>+ Add New Blog Article</button>
          {saved && <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600', padding: '7px 14px', borderRadius: '8px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>Saved All Sections!</span>}
          <button onClick={handleSave} disabled={saving} style={btnP}>
            {saving ? 'Saving...' : 'Save Blogs Page'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

        {/* ── SECTION 1: Hero Banner ────────────────────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec1_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 1 OF 4</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>THE EDIT — Hero Header Banner</h3>
            </div>
            <button type="button" onClick={() => setForm(p => ({ ...p, sec1_active: !p.sec1_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec1_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec1_active ? '#F6F1E3' : '#EF4444', border: form.sec1_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              {form.sec1_active ? 'Deactivate Section' : 'Activate Section'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Section Tag Badge</label>
                <input value={form.sec1_tag} onChange={e => setForm(p => ({ ...p, sec1_tag: e.target.value }))} style={iStyle} placeholder="THE EDIT" />
              </div>
              <div>
                <label style={lStyle}>Main Title *</label>
                <input required value={form.sec1_title} onChange={e => setForm(p => ({ ...p, sec1_title: e.target.value }))} style={iStyle} placeholder="Style Notes & Modesty Stories" />
              </div>
            </div>

            <div>
              <label style={lStyle}>Subtitle Tagline *</label>
              <input required value={form.sec1_subtitle} onChange={e => setForm(p => ({ ...p, sec1_subtitle: e.target.value }))} style={iStyle} placeholder="Your go-to source for modest fashion inspiration..." />
            </div>

            <div>
              <label style={lStyle}>Body Content Paragraph</label>
              <textarea rows={3} value={form.sec1_body} onChange={e => setForm(p => ({ ...p, sec1_body: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="Styling ideas, fabric guides, and quiet reflections..." />
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Categories & Keywords Table ───────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec2_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>CATEGORIES & KEYWORDS</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Blog Categories & Search Tags</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button type="button" onClick={() => setForm(p => ({ ...p, sec2_active: !p.sec2_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec2_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec2_active ? '#F6F1E3' : '#EF4444', border: form.sec2_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                {form.sec2_active ? 'Deactivate Section' : 'Activate Section'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Search Bar Input Placeholder</label>
                <input value={form.search_placeholder} onChange={e => setForm(p => ({ ...p, search_placeholder: e.target.value }))} style={iStyle} placeholder="Search category or keywords..." />
              </div>
              <div>
                <label style={lStyle}>Filter Category Tabs (comma separated)</label>
                <input value={form.filter_categories} onChange={e => setForm(p => ({ ...p, filter_categories: e.target.value }))} style={iStyle} placeholder="All, Styling Guides, Fabric Care..." />
              </div>
            </div>

            {/* Keyword Pills Table matching exact screenshot 1 */}
            <div style={{ backgroundColor: '#182012', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(184,147,91,0.25)', marginTop: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#11170D', borderBottom: '1px solid rgba(184,147,91,0.2)' }}>
                    <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>BLOG ARTICLE NAME</th>
                    <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>CATEGORY</th>
                    <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>SEARCH KEYWORDS / TAGS</th>
                    <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>STATUS</th>
                    <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(art => {
                    const kwList = (art.keywords || 'chiffon, jersey, silk, hijab styling, abaya care').split(',').map(k => k.trim()).filter(Boolean);
                    const isLive = art.status === 'Live' || art.status === 'Active';
                    return (
                      <tr key={art.blog_id || art.id} style={{ borderBottom: '1px solid rgba(184,147,91,0.1)' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '700', color: '#F6F1E3' }}>{art.title}</td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: '#B8A99A' }}>{art.category || 'Fabric & Care'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {kwList.map((kw, i) => (
                              <span key={i} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '14px', backgroundColor: 'rgba(184,147,91,0.12)', border: '1px solid rgba(184,147,91,0.3)', color: '#B8935B', fontWeight: '600' }}>
                                {kw}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '8px', fontWeight: '700', color: isLive ? '#22c55e' : '#EF4444', backgroundColor: isLive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${isLive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                            {isLive ? 'Live' : 'Draft'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <button type="button" onClick={() => handleToggleArticleStatus(art)} style={{ ...btnG, fontSize: '11px', padding: '5px 10px' }}>
                              {isLive ? 'Deactivate' : 'Activate'}
                            </button>
                            <a href="/blogs" style={{ ...btnG, padding: '5px 8px', textDecoration: 'none' }} title="Edit Article Content"><EditIcon /></a>
                            <button type="button" onClick={() => handleDeleteBlog(art)} style={{ ...btnD, padding: '5px 8px' }} title="Delete Article"><TrashIcon /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: Blog Posts Cards Layout with Direct Edit Page Shortcuts ───── */}
        <div style={{ ...cardStyle, border: form.sec3_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>BLOG POSTS ARRANGEMENT & CARDS</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Blog Cards & Link Shortcuts to Blogs Detail Page</h3>
            </div>
            <button type="button" onClick={() => setForm(p => ({ ...p, sec3_active: !p.sec3_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec3_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec3_active ? '#F6F1E3' : '#EF4444', border: form.sec3_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              {form.sec3_active ? 'Deactivate Section' : 'Activate Section'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '18px', backgroundColor: '#182012', padding: '16px', borderRadius: '12px', border: '1px solid rgba(184,147,91,0.25)' }}>
            <div>
              <label style={lStyle}>How Many Blogs Per Page *</label>
              <input value={form.blogs_per_page || '9'} onChange={e => setForm(p => ({ ...p, blogs_per_page: e.target.value }))} style={iStyle} placeholder="e.g. 6 or 9 or 12" />
            </div>
            <div>
              <label style={lStyle}>Featured Top Blog Article</label>
              <select value={form.featured_blog_id} onChange={e => setForm(p => ({ ...p, featured_blog_id: e.target.value }))} style={iStyle}>
                <option value="">— Auto (Latest Blog) —</option>
                {articles.map(a => <option key={a.blog_id || a.id} value={a.blog_id || a.id}>{a.title}</option>)}
              </select>
            </div>
            <div>
              <label style={lStyle}>Default Sorting Order</label>
              <select value={form.sort_order || 'Newest First'} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))} style={iStyle}>
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
                <option value="Most Popular">Most Popular</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {articles.map((art, idx) => {
              const isLive = art.status === 'Live' || art.status === 'Active';
              return (
                <div
                  key={art.blog_id || art.id || idx}
                  style={{
                    backgroundColor: '#182012',
                    borderRadius: '12px',
                    padding: '18px',
                    border: isLive ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#B8935B', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        //{art.category || 'FABRIC & CARE'}
                      </span>
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

                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '800', color: '#F6F1E3' }}>{art.title}</h4>
                    <div style={{ fontSize: '12px', color: '#B8A99A', marginBottom: '8px' }}>{art.published_date || 'June 24, 2026'} · {art.read_time || '3 min read'}</div>
                    <div style={{ fontSize: '12px', color: '#E7D9C9', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{art.excerpt || art.content}</div>
                  </div>

                  {/* Connected Button link shortcut */}
                  <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(184,147,91,0.15)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '600' }}>
                      🔗 Button link connects to: <span style={{ color: '#F6F1E3' }}>/blogs</span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button type="button" onClick={() => handleToggleArticleStatus(art)} style={{ ...btnG, padding: '6px 12px', fontSize: '11px' }}>
                        {isLive ? 'Deactivate' : 'Activate'}
                      </button>
                      <a href="/blogs" style={{ ...btnG, padding: '6px 10px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }} title="Edit Full Article Detail">
                        <EditIcon /> ↗ Edit Page
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 4 & 5: Stay in the Loop Newsletter Banner ──────────────── */}
        <div style={{ ...cardStyle, border: form.sec5_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 4 OF 4</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Stay in the Loop — Newsletter Banner</h3>
            </div>
            <button type="button" onClick={() => setForm(p => ({ ...p, sec5_active: !p.sec5_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec5_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec5_active ? '#F6F1E3' : '#EF4444', border: form.sec5_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              {form.sec5_active ? 'Deactivate Section' : 'Activate Section'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Banner Heading *</label>
                <input required value={form.sec5_title} onChange={e => setForm(p => ({ ...p, sec5_title: e.target.value }))} style={iStyle} placeholder="Stay in the Loop" />
              </div>
              <div>
                <label style={lStyle}>Subtitle Tagline *</label>
                <input required value={form.sec5_subtitle} onChange={e => setForm(p => ({ ...p, sec5_subtitle: e.target.value }))} style={iStyle} placeholder="New stories, sent straight to you" />
              </div>
            </div>

            <div>
              <label style={lStyle}>Body Description</label>
              <textarea rows={2} value={form.sec5_body} onChange={e => setForm(p => ({ ...p, sec5_body: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="Styling ideas and fabric guides once or twice a month..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Email Input Placeholder *</label>
                <input required value={form.email_placeholder} onChange={e => setForm(p => ({ ...p, email_placeholder: e.target.value }))} style={iStyle} placeholder="Your email address" />
              </div>
              <div>
                <label style={lStyle}>Subscribe Button Text *</label>
                <input required value={form.subscribe_btn_text} onChange={e => setForm(p => ({ ...p, subscribe_btn_text: e.target.value }))} style={iStyle} placeholder="Subscribe" />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button type="submit" disabled={saving} style={{ ...btnP, padding: '12px 26px', fontSize: '14px' }}>
            {saving ? 'Saving...' : 'Save Blogs Page Settings'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default BlogsPageManager;
