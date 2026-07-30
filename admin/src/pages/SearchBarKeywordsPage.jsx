import React, { useState, useEffect } from 'react';

/**
 * Dedicated Admin Page for Search Bar Settings & Category Keywords:
 *  - Section 1: Search Bar Global Config (placeholder, heading, enable/disable)
 *  - Section 2: Category Search Keywords Manager (Full CRUD: Add, Edit, Delete, Activate/Deactivate)
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

const SearchBarKeywordsPage = () => {
  // Search Bar Section Settings State
  const [searchSettings, setSearchSettings] = useState({
    placeholder: 'SEARCH...',
    heading: 'SEARCH RESULTS',
    enable_search: 'true'
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Category Keywords State
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Category Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    keywords: '',
    description: '',
    image_url: '',
    status: 'Live'
  });

  // Fetch search bar section settings
  const fetchSettings = () => {
    fetch(`${API}/sections/search_bar_settings`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          let meta = {};
          try {
            meta = data.metadata ? (typeof data.metadata === 'string' ? JSON.parse(data.metadata) : data.metadata) : {};
          } catch (e) {}
          setSearchSettings({
            placeholder: meta.placeholder || 'SEARCH...',
            heading: meta.heading || 'SEARCH RESULTS',
            enable_search: meta.enable_search !== 'false' ? 'true' : 'false'
          });
        }
      })
      .catch(err => console.error("Error fetching search bar settings:", err));
  };

  // Fetch categories
  const fetchCategories = () => {
    setLoadingCategories(true);
    fetch(`${API}/module/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      })
      .catch(err => console.error("Error fetching categories:", err))
      .finally(() => setLoadingCategories(false));
  };

  useEffect(() => {
    fetchSettings();
    fetchCategories();
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavingSettings(true);
    fetch(`${API}/sections/search_bar_settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metadata: searchSettings })
    })
      .then(() => alert('Search Bar settings saved successfully!'))
      .catch(err => console.error("Failed to save search bar settings:", err))
      .finally(() => setSavingSettings(false));
  };

  const openAddCategory = () => {
    setEditCategory(null);
    setCategoryForm({
      name: '',
      slug: '',
      keywords: '',
      description: '',
      image_url: '',
      status: 'Live'
    });
    setShowModal(true);
  };

  const openEditCategory = (cat) => {
    setEditCategory(cat);
    setCategoryForm({
      name: cat.name || '',
      slug: cat.slug || '',
      keywords: cat.keywords || '',
      description: cat.description || '',
      image_url: cat.image_url || '',
      status: cat.status || 'Live'
    });
    setShowModal(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    const url = editCategory ? `${API}/module/categories/${editCategory.category_id}` : `${API}/module/categories`;
    const method = editCategory ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryForm)
    })
      .then(() => {
        setShowModal(false);
        fetchCategories();
      })
      .catch(err => console.error("Failed to save category keywords:", err));
  };

  const handleToggleCategoryStatus = (cat) => {
    const nextStatus = cat.status === 'Live' ? 'Draft' : 'Live';
    fetch(`${API}/module/categories/${cat.category_id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    }).then(fetchCategories);
  };

  const handleDeleteCategory = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    fetch(`${API}/module/categories/${id}`, { method: 'DELETE' }).then(fetchCategories);
  };

  const filteredCategories = categories.filter(c => {
    const q = searchQuery.toLowerCase();
    return (c.name || '').toLowerCase().includes(q) || (c.slug || '').toLowerCase().includes(q) || (c.keywords || '').toLowerCase().includes(q);
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
            HEADER UTILITIES
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#F6F1E3' }}>
            Search Bar & Category Keywords Manager
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Manage header search bar configuration and assign searchable keywords to every product category.
          </p>
        </div>
      </div>

      {/* ── Section 1: Search Bar Global Header Settings ───────────────────── */}
      <div style={cardStyle}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px', marginBottom: '4px' }}>
          HEADER SEARCH BAR
        </div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
          Search Overlay Configuration
        </h3>

        <form onSubmit={handleSaveSettings} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <label style={lStyle}>Search Input Placeholder</label>
            <input 
              value={searchSettings.placeholder} 
              onChange={e => setSearchSettings(p => ({ ...p, placeholder: e.target.value }))} 
              style={iStyle} 
              placeholder="e.g. SEARCH..." 
            />
          </div>

          <div>
            <label style={lStyle}>Search Overlay Dropdown Heading</label>
            <input 
              value={searchSettings.heading} 
              onChange={e => setSearchSettings(p => ({ ...p, heading: e.target.value }))} 
              style={iStyle} 
              placeholder="e.g. SEARCH RESULTS" 
            />
          </div>

          <div>
            <label style={lStyle}>Search Bar Visibility</label>
            <select 
              value={searchSettings.enable_search} 
              onChange={e => setSearchSettings(p => ({ ...p, enable_search: e.target.value }))} 
              style={iStyle}
            >
              <option value="true">Enabled (Visible in Header)</option>
              <option value="false">Disabled (Hidden)</option>
            </select>
          </div>

          <div>
            <button type="submit" disabled={savingSettings} style={{ ...btnP, width: '100%', padding: '11px' }}>
              {savingSettings ? 'Saving Settings...' : 'Save Search Bar Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Section 2: Category Keywords Manager Table ────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>CATEGORIES & KEYWORDS</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Product Categories & Search Tags</h3>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search category or keywords..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              style={{ ...iStyle, width: '220px' }} 
            />
            <button onClick={openAddCategory} style={btnP}>+ Add Category</button>
          </div>
        </div>

        {loadingCategories ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#E7D9C9' }}>Loading Categories & Keywords...</div>
        ) : filteredCategories.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#B8A99A', fontSize: '13px' }}>
            No categories found matching your search.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#182012', borderBottom: '1px solid rgba(184,147,91,0.25)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>CATEGORY NAME</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>URL SLUG</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>SEARCH KEYWORDS / TAGS</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>STATUS</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map(cat => (
                  <tr key={cat.category_id} style={{ borderBottom: '1px solid rgba(184,147,91,0.1)' }}>
                    <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: '700', color: '#F6F1E3', whiteSpace: 'nowrap' }}>
                      {cat.name}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', color: '#B8A99A', whiteSpace: 'nowrap' }}>
                      /categories/{cat.slug}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', color: '#E7D9C9', maxWidth: '300px' }}>
                      {cat.keywords ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {cat.keywords.split(',').map((kw, i) => (
                            <span key={i} style={{ backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.3)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', color: '#B8935B' }}>
                              {kw.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#B8A99A', italic: 'true' }}>No keywords set</span>
                      )}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ 
                        fontSize: '10px', 
                        padding: '3px 10px', 
                        borderRadius: '10px', 
                        fontWeight: '700', 
                        color: cat.status === 'Live' ? '#22c55e' : '#B8A99A', 
                        backgroundColor: cat.status === 'Live' ? 'rgba(34,197,94,0.1)' : 'rgba(184,147,91,0.08)',
                        border: `1px solid ${cat.status === 'Live' ? 'rgba(34,197,94,0.3)' : 'rgba(184,147,91,0.2)'}`
                      }}>
                        {cat.status || 'Live'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleToggleCategoryStatus(cat)} style={{ ...btnG, padding: '5px 10px', fontSize: '11px' }}>
                          {cat.status === 'Live' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => openEditCategory(cat)} style={{ ...btnG, padding: '5px 10px' }} title="Edit"><EditIcon /></button>
                        <button onClick={() => handleDeleteCategory(cat.category_id)} style={{ ...btnD, padding: '5px 10px' }} title="Delete"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Category Edit / Add Modal ────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '26px', width: '90%', maxWidth: '520px', border: '1px solid #B8935B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>PRODUCT CATEGORY</div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#F6F1E3' }}>
                  {editCategory ? 'Edit Category & Keywords' : 'Add New Category'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer' }}>
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={lStyle}>Category Name *</label>
                <input 
                  required 
                  value={categoryForm.name} 
                  onChange={e => setCategoryForm(p => ({ 
                    ...p, 
                    name: e.target.value,
                    slug: editCategory ? p.slug : e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                  }))} 
                  style={iStyle} 
                  placeholder="e.g. Abaya Collection" 
                />
              </div>

              <div>
                <label style={lStyle}>URL Slug *</label>
                <input 
                  required 
                  value={categoryForm.slug} 
                  onChange={e => setCategoryForm(p => ({ ...p, slug: e.target.value }))} 
                  style={iStyle} 
                  placeholder="e.g. abaya" 
                />
              </div>

              <div>
                <label style={lStyle}>Search Keywords / Tags (comma separated) *</label>
                <textarea 
                  rows={3} 
                  value={categoryForm.keywords} 
                  onChange={e => setCategoryForm(p => ({ ...p, keywords: e.target.value }))} 
                  style={{ ...iStyle, resize: 'vertical' }} 
                  placeholder="e.g. saudi abaya, kaftan, gown, nida, open abaya, closed abaya" 
                />
                <span style={{ fontSize: '11px', color: '#B8A99A', marginTop: '4px', display: 'block' }}>
                  Typing any of these keywords in the website search bar will show all products in this category!
                </span>
              </div>

              <div>
                <label style={lStyle}>Description</label>
                <textarea 
                  rows={2} 
                  value={categoryForm.description} 
                  onChange={e => setCategoryForm(p => ({ ...p, description: e.target.value }))} 
                  style={{ ...iStyle, resize: 'vertical' }} 
                  placeholder="Category description..." 
                />
              </div>

              <div>
                <label style={lStyle}>Status</label>
                <select 
                  value={categoryForm.status} 
                  onChange={e => setCategoryForm(p => ({ ...p, status: e.target.value }))} 
                  style={iStyle}
                >
                  <option value="Live">Live</option>
                  <option value="Draft">Draft (Deactivated)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnG}>Cancel</button>
                <button type="submit" style={btnP}>{editCategory ? 'Save & Update' : 'Add Category'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBarKeywordsPage;
