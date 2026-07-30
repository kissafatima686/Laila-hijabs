import React, { useState, useEffect } from 'react';

/**
 * Wishlist Settings & Manager Page (Under Header Utilities -> Wishlist Settings)
 *  - Panel 1: Wishlist CMS Header & Empty State Settings with "+ Add More Field" on top, 
 *             3-button action row [ Deactivate / Activate ] [ Edit Icon ] [ Trash Icon ] on every field right side,
 *             and "Save Changes" on bottom.
 *  - Panel 2: Customer Wishlist Items CRUD
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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FieldRow = ({ label, value, status, onChangeValue, onToggleStatus, onEditLabel, onDelete }) => (
  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', width: '100%', marginBottom: '14px' }}>
    <div style={{ flex: 1 }}>
      <label style={lStyle}>{label}</label>
      <input 
        value={value} 
        onChange={e => onChangeValue(e.target.value)} 
        style={iStyle} 
        placeholder={`Enter ${label.toLowerCase()}...`} 
      />
    </div>
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button 
        type="button" 
        onClick={onToggleStatus} 
        style={{ 
          ...btnG, 
          height: '39px', 
          padding: '0 16px', 
          fontWeight: '600',
          backgroundColor: status === 'Active' ? '#3E4930' : 'rgba(239,68,68,0.15)',
          color: status === 'Active' ? '#F6F1E3' : '#EF4444',
          borderColor: status === 'Active' ? '#B8935B' : 'rgba(239,68,68,0.4)'
        }}
      >
        {status === 'Active' ? 'Deactivate' : 'Activate'}
      </button>
      <button 
        type="button" 
        onClick={onEditLabel} 
        style={{ ...btnG, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
        title="Edit Field Label"
      >
        <EditIcon />
      </button>
      <button 
        type="button" 
        onClick={onDelete} 
        style={{ ...btnD, height: '39px', width: '39px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
        title="Delete Field"
      >
        <TrashIcon />
      </button>
    </div>
  </div>
);

const WishlistManagerPage = () => {
  // Field List State
  const [fields, setFields] = useState([
    { key: 'title', label: 'WISHLIST PAGE TITLE', value: 'My Wishlist', status: 'Active' },
    { key: 'subtitle', label: 'EMPTY WISHLIST HEADING', value: 'Your wishlist is currently empty', status: 'Active' },
    { key: 'body_content', label: 'EMPTY WISHLIST DESCRIPTION', value: 'Save your favorite items here while you shop to easily find them later.', status: 'Active' },
    { key: 'button_text', label: 'EXPLORE BUTTON LABEL', value: 'EXPLORE PRODUCTS', status: 'Active' },
    { key: 'button_link', label: 'EXPLORE BUTTON URL LINK', value: '/products', status: 'Active' }
  ]);
  const [savingSettings, setSavingSettings] = useState(false);

  // Wishlist Items CRUD State
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    user_name: 'Guest / Customer',
    user_email: 'customer@example.com',
    product_name: '',
    product_image: '',
    price: 'Rs. 0',
    status: 'Active'
  });

  // Fetch Wishlist Page Settings
  const fetchSettings = () => {
    fetch(`${API}/sections/wishlist_page_settings`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          let meta = {};
          try { meta = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : (data.metadata || {}); } catch(e) {}
          const customF = Array.isArray(meta.custom_fields) ? meta.custom_fields : [];
          
          setFields([
            { key: 'title', label: meta.title_label || 'WISHLIST PAGE TITLE', value: data.title || 'My Wishlist', status: meta.title_status || 'Active' },
            { key: 'subtitle', label: meta.subtitle_label || 'EMPTY WISHLIST HEADING', value: data.subtitle || 'Your wishlist is currently empty', status: meta.subtitle_status || 'Active' },
            { key: 'body_content', label: meta.body_label || 'EMPTY WISHLIST DESCRIPTION', value: data.body_content || 'Save your favorite items here...', status: meta.body_status || 'Active' },
            { key: 'button_text', label: meta.btn_text_label || 'EXPLORE BUTTON LABEL', value: data.button_text || 'EXPLORE PRODUCTS', status: meta.btn_text_status || 'Active' },
            { key: 'button_link', label: meta.btn_link_label || 'EXPLORE BUTTON URL LINK', value: data.button_link || '/products', status: meta.btn_link_status || 'Active' },
            ...customF
          ]);
        }
      })
      .catch(err => console.error("Error fetching wishlist settings:", err));
  };

  // Fetch Wishlist Items
  const fetchItems = () => {
    setLoadingItems(true);
    fetch(`${API}/module/wishlists`)
      .then(res => res.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching wishlist items:", err))
      .finally(() => setLoadingItems(false));
  };

  useEffect(() => {
    fetchSettings();
    fetchItems();
  }, []);

  // Field Handlers
  const handleFieldValueChange = (key, newValue) => {
    setFields(prev => prev.map(f => f.key === key ? { ...f, value: newValue } : f));
  };

  const handleToggleFieldStatus = (key) => {
    setFields(prev => prev.map(f => f.key === key ? { ...f, status: (f.status === 'Active' || f.status === 'Live') ? 'Inactive' : 'Active' } : f));
  };

  const handleEditFieldLabel = (key, currentLabel) => {
    const newLabel = window.prompt("Edit field label name:", currentLabel);
    if (!newLabel || !newLabel.trim()) return;
    setFields(prev => prev.map(f => f.key === key ? { ...f, label: newLabel.trim().toUpperCase() } : f));
  };

  const handleDeleteField = (key) => {
    if (!window.confirm("Are you sure you want to delete this field?")) return;
    setFields(prev => prev.filter(f => f.key !== key));
  };

  const handleAddMoreField = () => {
    const fieldName = window.prompt("Enter new field label name:");
    if (!fieldName || !fieldName.trim()) return;
    const key = `custom_${Date.now()}`;
    setFields(prev => [
      ...prev,
      { key, label: fieldName.trim().toUpperCase(), value: '', status: 'Active' }
    ]);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavingSettings(true);

    const titleF = fields.find(f => f.key === 'title');
    const subF = fields.find(f => f.key === 'subtitle');
    const bodyF = fields.find(f => f.key === 'body_content');
    const btnTextF = fields.find(f => f.key === 'button_text');
    const btnLinkF = fields.find(f => f.key === 'button_link');

    const customFields = fields.filter(f => !['title', 'subtitle', 'body_content', 'button_text', 'button_link'].includes(f.key));

    const meta = {
      title_label: titleF?.label,
      title_status: titleF?.status || 'Active',
      subtitle_label: subF?.label,
      subtitle_status: subF?.status || 'Active',
      body_label: bodyF?.label,
      body_status: bodyF?.status || 'Active',
      btn_text_label: btnTextF?.label,
      btn_text_status: btnTextF?.status || 'Active',
      btn_link_label: btnLinkF?.label,
      btn_link_status: btnLinkF?.status || 'Active',
      custom_fields: customFields
    };

    fetch(`${API}/sections/wishlist_page_settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: titleF?.value || 'My Wishlist',
        subtitle: subF?.value || 'Your wishlist is currently empty',
        body_content: bodyF?.value || 'Save your favorite items...',
        button_text: btnTextF?.value || 'EXPLORE PRODUCTS',
        button_link: btnLinkF?.value || '/products',
        metadata: meta
      })
    })
      .then(() => alert('Wishlist Page settings saved successfully!'))
      .catch(err => console.error("Error saving wishlist settings:", err))
      .finally(() => setSavingSettings(false));
  };

  // Item Handlers
  const openAddItem = () => {
    setEditItem(null);
    setItemForm({ user_name: 'Guest / Customer', user_email: 'customer@example.com', product_name: '', product_image: '', price: 'Rs. 0', status: 'Active' });
    setShowModal(true);
  };
  const openEditItem = (item) => {
    setEditItem(item);
    setItemForm({ user_name: item.user_name || '', user_email: item.user_email || '', product_name: item.product_name || '', product_image: item.product_image || '', price: item.price || 'Rs. 0', status: item.status || 'Active' });
    setShowModal(true);
  };
  const handleSaveItem = (e) => {
    e.preventDefault();
    const url = editItem ? `${API}/module/wishlists/${editItem.wishlist_id}` : `${API}/module/wishlists`;
    const method = editItem ? 'PUT' : 'POST';
    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(itemForm) })
      .then(() => { setShowModal(false); fetchItems(); });
  };
  const handleToggleItemStatus = (item) => {
    const nextStatus = item.status === 'Active' ? 'Draft' : 'Active';
    fetch(`${API}/module/wishlists/${item.wishlist_id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: nextStatus }) }).then(fetchItems);
  };
  const handleDeleteItem = (id) => {
    if (!window.confirm("Are you sure you want to delete this wishlist item?")) return;
    fetch(`${API}/module/wishlists/${id}`, { method: 'DELETE' }).then(fetchItems);
  };

  const filteredItems = items.filter(i => {
    const q = searchQuery.toLowerCase();
    return (i.product_name || '').toLowerCase().includes(q) || (i.user_name || '').toLowerCase().includes(q) || (i.user_email || '').toLowerCase().includes(q);
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
            Wishlist Settings & Saved Items Manager
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Configure Wishlist header fields and manage customer wishlist items with full CRUD.
          </p>
        </div>
        <button onClick={openAddItem} style={{ ...btnP, boxShadow: '0 4px 14px rgba(184,147,91,0.4)' }}>
          + Add Wishlist Item
        </button>
      </div>

      {/* ── PANEL 1: WISHLIST CMS HEADER SETTINGS ─── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 1</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
              Wishlist Page Header & Empty State CMS Fields
            </h3>
          </div>
          <button type="button" onClick={handleAddMoreField} style={{ ...btnG, border: '1px solid #B8935B', fontWeight: '700' }}>
            + Add More Field
          </button>
        </div>

        <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {fields.map((f) => (
            <FieldRow 
              key={f.key} 
              label={f.label} 
              value={f.value} 
              status={f.status} 
              onChangeValue={v => handleFieldValueChange(f.key, v)} 
              onToggleStatus={() => handleToggleFieldStatus(f.key)} 
              onEditLabel={() => handleEditFieldLabel(f.key, f.label)} 
              onDelete={() => handleDeleteField(f.key)} 
            />
          ))}

          <div style={{ marginTop: '10px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
            <button type="submit" disabled={savingSettings} style={btnP}>
              {savingSettings ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* ── PANEL 2: SAVED WISHLIST ITEMS TABLE ───────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 2</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
              Saved Customer Wishlist Items ({items.length})
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search product, customer..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              style={{ ...iStyle, width: '220px' }} 
            />
            <button onClick={openAddItem} style={btnP}>+ Add Wishlist Item</button>
          </div>
        </div>

        {loadingItems ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#E7D9C9' }}>Loading Wishlist Items...</div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#B8A99A', fontSize: '13px' }}>
            No wishlist items found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#182012', borderBottom: '1px solid rgba(184,147,91,0.25)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>PRODUCT ITEM</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>PRICE</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>SAVED BY</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>STATUS</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.wishlist_id} style={{ borderBottom: '1px solid rgba(184,147,91,0.1)' }}>
                    <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: '700', color: '#F6F1E3' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={item.product_image || "/hero2.png"} alt="" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                        <span>{item.product_name || 'Wishlist Product'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', fontWeight: '700', color: '#B8935B' }}>
                      {item.price}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', color: '#E7D9C9' }}>
                      {item.user_name || 'Customer'} <span style={{ color: '#B8A99A' }}>({item.user_email})</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ 
                        fontSize: '10px', 
                        padding: '3px 10px', 
                        borderRadius: '10px', 
                        fontWeight: '700', 
                        color: item.status === 'Active' ? '#22c55e' : '#EF4444', 
                        backgroundColor: item.status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        border: `1px solid ${item.status === 'Active' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                      }}>
                        {item.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleToggleItemStatus(item)} style={{ ...btnG, padding: '5px 10px', fontSize: '11px' }}>
                          {item.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => openEditItem(item)} style={{ ...btnG, padding: '5px 10px' }} title="Edit"><EditIcon /></button>
                        <button onClick={() => handleDeleteItem(item.wishlist_id)} style={{ ...btnD, padding: '5px 10px' }} title="Delete"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Item Add / Edit Modal ───────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '26px', width: '90%', maxWidth: '480px', border: '1px solid #B8935B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>WISHLIST ITEM</div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#F6F1E3' }}>
                  {editItem ? 'Edit Wishlist Item' : 'Add New Wishlist Item'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer' }}><CloseIcon /></button>
            </div>

            <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={lStyle}>Product Name *</label>
                <input required value={itemForm.product_name} onChange={e => setItemForm(p => ({ ...p, product_name: e.target.value }))} style={iStyle} placeholder="e.g. Silk Hijab" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>Price</label>
                  <input value={itemForm.price} onChange={e => setItemForm(p => ({ ...p, price: e.target.value }))} style={iStyle} placeholder="e.g. Rs. 2,400" />
                </div>
                <div>
                  <label style={lStyle}>Status</label>
                  <select value={itemForm.status} onChange={e => setItemForm(p => ({ ...p, status: e.target.value }))} style={iStyle}>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={lStyle}>Customer Name</label>
                <input value={itemForm.user_name} onChange={e => setItemForm(p => ({ ...p, user_name: e.target.value }))} style={iStyle} placeholder="e.g. Customer Name" />
              </div>
              <div>
                <label style={lStyle}>Customer Email</label>
                <input type="email" value={itemForm.user_email} onChange={e => setItemForm(p => ({ ...p, user_email: e.target.value }))} style={iStyle} placeholder="e.g. customer@example.com" />
              </div>
              <div>
                <label style={lStyle}>Product Image URL</label>
                <input value={itemForm.product_image} onChange={e => setItemForm(p => ({ ...p, product_image: e.target.value }))} style={iStyle} placeholder="e.g. /hero2.png" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnG}>Cancel</button>
                <button type="submit" style={btnP}>{editItem ? 'Save & Update' : 'Add Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistManagerPage;
