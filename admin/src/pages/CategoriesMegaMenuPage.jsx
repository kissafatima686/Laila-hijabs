import React, { useState, useEffect } from 'react';

/**
 * Dedicated Admin Page for managing the Categories Mega Menu:
 *  - Panel 1: All Categories Links (Column 1)
 *  - Panel 2: Featured Categories Links (Column 2)
 *  - Panel 3: Featured Category Pictures / Cards (Column 3 & 4)
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

const CategoriesMegaMenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalGroup, setModalGroup] = useState('all_categories'); // 'all_categories' | 'featured_categories' | 'featured_cards'
  const [editItem, setEditItem] = useState(null);
  const [dbCategories, setDbCategories] = useState([]);
  const [form, setForm] = useState({
    label: '',
    url: '',
    image_url: '',
    subtitle: 'EXPLORE NOW',
    display_order: 0,
    status: 'Live'
  });

  const fetchItems = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/module/categories-mega-menu`).then(res => res.json()),
      fetch(`${API}/module/categories`).then(res => res.json())
    ])
      .then(([itemsData, catsData]) => {
        if (Array.isArray(itemsData)) setItems(itemsData);
        else setItems([]);
        
        if (Array.isArray(catsData)) setDbCategories(catsData);
      })
      .catch(err => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAdd = (group) => {
    setModalGroup(group);
    setEditItem(null);
    setForm({
      label: '',
      url: '',
      image_url: '',
      subtitle: group === 'featured_cards' ? 'EXPLORE NOW' : '',
      display_order: 0,
      status: 'Live'
    });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setModalGroup(item.group_name);
    setEditItem(item);
    setForm({
      label: item.label || '',
      url: item.url || '',
      image_url: item.image_url || '',
      subtitle: item.subtitle || '',
      display_order: item.display_order || 0,
      status: item.status || 'Live'
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      group_name: modalGroup
    };

    const url = editItem ? `${API}/module/categories-mega-menu/${editItem.id}` : `${API}/module/categories-mega-menu`;
    const method = editItem ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(() => {
        setShowModal(false);
        fetchItems();
      })
      .catch(err => console.error("Failed to save mega menu item:", err));
  };

  const handleToggleStatus = (item) => {
    const nextStatus = item.status === 'Live' ? 'Draft' : 'Live';
    fetch(`${API}/module/categories-mega-menu/${item.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    }).then(fetchItems);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this mega menu item?")) return;
    fetch(`${API}/module/categories-mega-menu/${id}`, { method: 'DELETE' }).then(fetchItems);
  };

  // Group items
  const allCategories = items.filter(i => i.group_name === 'all_categories').sort((a, b) => a.display_order - b.display_order);
  const featuredCategories = items.filter(i => i.group_name === 'featured_categories').sort((a, b) => a.display_order - b.display_order);
  const featuredCards = items.filter(i => i.group_name === 'featured_cards').sort((a, b) => a.display_order - b.display_order);

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
            NAVIGATION & HEADER
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#F6F1E3' }}>
            Categories Mega Menu Manager
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Add, edit, remove categories, featured links, and category picture cards displayed in the navbar dropdown.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#E7D9C9' }}>Loading Mega Menu configuration...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          
          {/* ── Panel 1: All Categories ────────────────────────────────────────── */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>COLUMN 1</div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>All Categories List</h3>
              </div>
              <button onClick={() => openAdd('all_categories')} style={btnP}>+ Add Category</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {allCategories.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#B8A99A', fontSize: '12px' }}>No categories added yet.</div>
              ) : allCategories.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.15)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#F6F1E3' }}>{item.label}</div>
                    <div style={{ fontSize: '11px', color: '#B8A99A' }}>{item.url}</div>
                  </div>
                  <span style={{ 
                    fontSize: '10px', 
                    padding: '2px 8px', 
                    borderRadius: '8px', 
                    fontWeight: '700', 
                    color: item.status === 'Live' ? '#22c55e' : '#B8A99A', 
                    backgroundColor: item.status === 'Live' ? 'rgba(34,197,94,0.1)' : 'rgba(184,147,91,0.08)', 
                    border: `1px solid ${item.status === 'Live' ? 'rgba(34,197,94,0.3)' : 'rgba(184,147,91,0.2)'}` 
                  }}>
                    {item.status || 'Live'}
                  </span>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => handleToggleStatus(item)} style={{ ...btnG, padding: '4px 8px', fontSize: '11px' }}>
                      {item.status === 'Live' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => openEdit(item)} style={{ ...btnG, padding: '4px 8px' }} title="Edit"><EditIcon /></button>
                    <button onClick={() => handleDelete(item.id)} style={{ ...btnD, padding: '4px 8px' }} title="Delete"><TrashIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Panel 2: Featured Categories ───────────────────────────────────── */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>COLUMN 2</div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Featured Categories List</h3>
              </div>
              <button onClick={() => openAdd('featured_categories')} style={btnP}>+ Add Featured Link</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {featuredCategories.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#B8A99A', fontSize: '12px' }}>No featured categories added yet.</div>
              ) : featuredCategories.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.15)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#F6F1E3' }}>{item.label}</div>
                    <div style={{ fontSize: '11px', color: '#B8A99A' }}>{item.url}</div>
                  </div>
                  <span style={{ 
                    fontSize: '10px', 
                    padding: '2px 8px', 
                    borderRadius: '8px', 
                    fontWeight: '700', 
                    color: item.status === 'Live' ? '#22c55e' : '#B8A99A', 
                    backgroundColor: item.status === 'Live' ? 'rgba(34,197,94,0.1)' : 'rgba(184,147,91,0.08)', 
                    border: `1px solid ${item.status === 'Live' ? 'rgba(34,197,94,0.3)' : 'rgba(184,147,91,0.2)'}` 
                  }}>
                    {item.status || 'Live'}
                  </span>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => handleToggleStatus(item)} style={{ ...btnG, padding: '4px 8px', fontSize: '11px' }}>
                      {item.status === 'Live' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => openEdit(item)} style={{ ...btnG, padding: '4px 8px' }} title="Edit"><EditIcon /></button>
                    <button onClick={() => handleDelete(item.id)} style={{ ...btnD, padding: '4px 8px' }} title="Delete"><TrashIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Panel 3: Category Picture Cards ─────────────────────────────── */}
          <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>COLUMN 3 & 4</div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Category Pictures & Feature Cards</h3>
              </div>
              <button onClick={() => openAdd('featured_cards')} style={btnP}>+ Add Picture Card</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {featuredCards.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#B8A99A', fontSize: '12px', gridColumn: '1 / -1' }}>
                  No picture cards added yet. Click "+ Add Picture Card" to add your first category banner card.
                </div>
              ) : featuredCards.map(item => (
                <div key={item.id} style={{ 
                  borderRadius: '12px', 
                  backgroundColor: '#182012', 
                  border: '1px solid rgba(184,147,91,0.25)', 
                  overflow: 'hidden', 
                  display: 'flex', 
                  flexDirection: 'column' 
                }}>
                  {item.image_url ? (
                    <div style={{ height: '140px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                      <img src={item.image_url} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', color: '#fff', fontSize: '11px', fontWeight: '700' }}>
                        {item.subtitle || 'EXPLORE NOW'}
                      </div>
                    </div>
                  ) : (
                    <div style={{ height: '100px', backgroundColor: '#2a3422', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B8A99A', fontSize: '12px' }}>
                      No Image Set
                    </div>
                  )}
                  <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#F6F1E3' }}>{item.label}</div>
                      <div style={{ fontSize: '11px', color: '#B8A99A', marginTop: '2px' }}>Path: {item.url}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(184,147,91,0.15)', paddingTop: '10px' }}>
                      <span style={{ 
                        fontSize: '10px', 
                        padding: '2px 8px', 
                        borderRadius: '8px', 
                        fontWeight: '700', 
                        color: item.status === 'Live' ? '#22c55e' : '#B8A99A', 
                        backgroundColor: item.status === 'Live' ? 'rgba(34,197,94,0.1)' : 'rgba(184,147,91,0.08)' 
                      }}>
                        {item.status || 'Live'}
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleToggleStatus(item)} style={{ ...btnG, padding: '4px 8px', fontSize: '11px' }}>
                          {item.status === 'Live' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => openEdit(item)} style={{ ...btnG, padding: '4px 8px' }} title="Edit"><EditIcon /></button>
                        <button onClick={() => handleDelete(item.id)} style={{ ...btnD, padding: '4px 8px' }} title="Delete"><TrashIcon /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── Add / Edit Modal ─────────────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '26px', width: '90%', maxWidth: '480px', border: '1px solid #B8935B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>
                  {modalGroup === 'all_categories' ? 'ALL CATEGORIES LINK' : modalGroup === 'featured_categories' ? 'FEATURED CATEGORY LINK' : 'CATEGORY PICTURE CARD'}
                </div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#F6F1E3' }}>
                  {editItem ? 'Edit Item' : 'Add New Item'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer' }}>
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={lStyle}>Title / Label *</label>
                <select 
                  required 
                  value={form.label} 
                  onChange={e => {
                    const selectedCat = dbCategories.find(c => c.name === e.target.value);
                    if (selectedCat) {
                      setForm(p => ({ ...p, label: selectedCat.name, url: `/categories/${selectedCat.slug}` }));
                    } else {
                      setForm(p => ({ ...p, label: e.target.value }));
                    }
                  }} 
                  style={iStyle}
                >
                  <option value="" disabled>Select a Category...</option>
                  {dbCategories.map(cat => (
                    <option key={cat.category_id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={lStyle}>Target URL / Path *</label>
                <input required readOnly value={form.url} style={{...iStyle, backgroundColor: '#111', color: '#888'}} placeholder="Auto-generated based on category selection" />
              </div>

              {modalGroup === 'featured_cards' && (
                <>
                  <div>
                    <label style={lStyle}>Picture Image Path / URL *</label>
                    <input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} style={iStyle} placeholder="e.g. /Categories/abaya/abaya1.png" />
                  </div>
                  <div>
                    <label style={lStyle}>Action Button Subtitle</label>
                    <input value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} style={iStyle} placeholder="e.g. EXPLORE NOW" />
                  </div>
                </>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>Display Order</label>
                  <input type="number" min="0" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} style={iStyle} />
                </div>
                <div>
                  <label style={lStyle}>Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={iStyle}>
                    <option value="Live">Live</option>
                    <option value="Draft">Draft (Deactivated)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnG}>Cancel</button>
                <button type="submit" style={btnP}>{editItem ? 'Update Item' : 'Add Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesMegaMenuPage;
