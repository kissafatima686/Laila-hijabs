import React, { useState, useEffect } from 'react';

/**
 * Cart Page Manager (Under Header Utilities -> Cart Page Settings):
 *  - Panels 1, 2, 3: CMS Field Cards with "+ Add More Field" on top, 
 *                   3-button action row [ Deactivate / Activate ] [ Edit Icon ] [ Trash Icon ] on every field right side,
 *                   and "Save Changes" on bottom.
 *  - Panel 4: Active Cart Perks & Rules Table (Full CRUD)
 *  - Panel 5: Active Coupon & Discount Codes Table (Full CRUD)
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

const CartManagerPage = () => {
  // Panel 1 Fields (Header & Steps)
  const [panel1Fields, setPanel1Fields] = useState([
    { key: 'title', label: 'CART PAGE MAIN TITLE', value: 'Cart', status: 'Active' },
    { key: 'step_1_label', label: 'STEP 1 LABEL', value: '1. Cart', status: 'Active' },
    { key: 'step_2_label', label: 'STEP 2 LABEL', value: '2. Checkout', status: 'Active' },
    { key: 'step_3_label', label: 'STEP 3 LABEL', value: '3. Payment', status: 'Active' }
  ]);

  // Panel 2 Fields (Empty Cart State)
  const [panel2Fields, setPanel2Fields] = useState([
    { key: 'empty_cart_title', label: 'EMPTY CART HEADING', value: 'Your shopping cart is empty', status: 'Active' },
    { key: 'empty_cart_message', label: 'EMPTY CART SUBTITLE / MESSAGE', value: 'Add some products to your cart and make them yours!', status: 'Active' },
    { key: 'empty_cart_button', label: 'EXPLORE BUTTON TEXT', value: 'EXPLORE PRODUCTS', status: 'Active' },
    { key: 'empty_cart_link', label: 'EXPLORE BUTTON LINK URL', value: '/products', status: 'Active' }
  ]);

  // Panel 3 Fields (Order Summary & Delivery)
  const [panel3Fields, setPanel3Fields] = useState([
    { key: 'summary_heading', label: 'ORDER SUMMARY HEADING', value: 'Order Summary', status: 'Active' },
    { key: 'subtotal_label', label: 'SUB TOTAL LABEL', value: 'Sub Total', status: 'Active' },
    { key: 'shipping_label', label: 'SHIPPING LABEL', value: 'Shipping', status: 'Active' },
    { key: 'shipping_value', label: 'SHIPPING COST VALUE TEXT', value: 'Free', status: 'Active' },
    { key: 'total_label', label: 'TOTAL LABEL', value: 'Total', status: 'Active' },
    { key: 'checkout_btn_text', label: 'CHECKOUT BUTTON TEXT', value: 'Proceed to Checkout', status: 'Active' },
    { key: 'continue_shopping_btn_text', label: 'CONTINUE SHOPPING BUTTON TEXT', value: '← CONTINUE SHOPPING', status: 'Active' },
    { key: 'estimated_delivery_prefix', label: 'DELIVERY PREFIX TEXT', value: 'Estimated Delivery by', status: 'Active' },
    { key: 'estimated_delivery_days', label: 'DELIVERY DAYS FROM TODAY', value: '2', status: 'Active' },
    { key: 'custom_delivery_date', label: 'FIXED CUSTOM DELIVERY DATE (OPTIONAL)', value: '', status: 'Active' }
  ]);

  const [savingSettings, setSavingSettings] = useState(false);

  // Cart Perks State
  const [perks, setPerks] = useState([]);
  const [loadingPerks, setLoadingPerks] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editPerk, setEditPerk] = useState(null);
  const [perkForm, setPerkForm] = useState({ title: '', code: '', discount_value: '10% OFF', status: 'Active' });

  // Coupons State
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [couponSearch, setCouponSearch] = useState('');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState({ code: '', discount_percentage: 10, discount_amount: 0, discount_type: 'percentage', description: '', status: 'Active' });

  const fetchSettings = () => {
    fetch(`${API}/sections/cart_page_settings`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          let meta = {};
          try { meta = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : (data.metadata || {}); } catch(e) {}
          if (Array.isArray(meta.p1)) setPanel1Fields(meta.p1);
          if (Array.isArray(meta.p2)) setPanel2Fields(meta.p2);
          if (Array.isArray(meta.p3)) setPanel3Fields(meta.p3);
        }
      })
      .catch(err => console.error("Error fetching cart settings:", err));
  };

  const fetchPerks = () => {
    setLoadingPerks(true);
    fetch(`${API}/module/cart-perks`)
      .then(res => res.json())
      .then(data => setPerks(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching cart perks:", err))
      .finally(() => setLoadingPerks(false));
  };

  const fetchCoupons = () => {
    setLoadingCoupons(true);
    fetch(`${API}/module/coupons`)
      .then(res => res.json())
      .then(data => setCoupons(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching coupons:", err))
      .finally(() => setLoadingCoupons(false));
  };

  useEffect(() => {
    fetchSettings();
    fetchPerks();
    fetchCoupons();
  }, []);

  const handleEditLabel = (setFieldsState, key, currentLabel) => {
    const newLabel = window.prompt("Edit field label name:", currentLabel);
    if (!newLabel || !newLabel.trim()) return;
    setFieldsState(prev => prev.map(f => f.key === key ? { ...f, label: newLabel.trim().toUpperCase() } : f));
  };

  const handleAddMoreField = (panelNum) => {
    const name = window.prompt("Enter new field label name:");
    if (!name || !name.trim()) return;
    const key = `custom_${Date.now()}`;
    const newF = { key, label: name.trim().toUpperCase(), value: '', status: 'Active' };

    if (panelNum === 1) setPanel1Fields(p => [...p, newF]);
    if (panelNum === 2) setPanel2Fields(p => [...p, newF]);
    if (panelNum === 3) setPanel3Fields(p => [...p, newF]);
  };

  const handleSaveAllSettings = () => {
    setSavingSettings(true);
    const fieldStatuses = {};
    const metaData = {
      p1: panel1Fields,
      p2: panel2Fields,
      p3: panel3Fields,
      field_statuses: fieldStatuses
    };

    [...panel1Fields, ...panel2Fields, ...panel3Fields].forEach(f => {
      fieldStatuses[f.key] = f.status;
      if (f.status === 'Active') {
        metaData[f.key] = f.value;
      } else {
        metaData[f.key] = '[DISABLED]';
      }
    });

    const titleVal = panel1Fields.find(f => f.key === 'title' && f.status === 'Active')?.value || 'Cart';

    fetch(`${API}/sections/cart_page_settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: titleVal,
        metadata: metaData
      })
    })
      .then(() => alert('Cart Page settings saved successfully!'))
      .catch(err => console.error("Error saving cart settings:", err))
      .finally(() => setSavingSettings(false));
  };

  // Perks Handlers
  const openAddPerk = () => { setEditPerk(null); setPerkForm({ title: '', code: '', discount_value: '10% OFF', status: 'Active' }); setShowModal(true); };
  const openEditPerk = (p) => { setEditPerk(p); setPerkForm({ title: p.title || '', code: p.code || '', discount_value: p.discount_value || '10% OFF', status: p.status || 'Active' }); setShowModal(true); };
  const handleSavePerk = (e) => {
    e.preventDefault();
    const url = editPerk ? `${API}/module/cart-perks/${editPerk.id}` : `${API}/module/cart-perks`;
    const method = editPerk ? 'PUT' : 'POST';
    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(perkForm) }).then(() => { setShowModal(false); fetchPerks(); });
  };
  const handleTogglePerkStatus = (p) => { fetch(`${API}/module/cart-perks/${p.id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: p.status === 'Active' ? 'Draft' : 'Active' }) }).then(fetchPerks); };
  const handleDeletePerk = (id) => { if (window.confirm("Delete perk?")) fetch(`${API}/module/cart-perks/${id}`, { method: 'DELETE' }).then(fetchPerks); };

  // Coupons Handlers
  const openAddCoupon = () => { setEditCoupon(null); setCouponForm({ code: '', discount_percentage: 10, discount_amount: 0, discount_type: 'percentage', description: '10% OFF Discount Code', status: 'Active' }); setShowCouponModal(true); };
  const openEditCoupon = (c) => { setEditCoupon(c); setCouponForm({ code: c.code || '', discount_percentage: c.discount_percentage || 10, discount_amount: c.discount_amount || 0, discount_type: c.discount_type || 'percentage', description: c.description || '', status: c.status || 'Active' }); setShowCouponModal(true); };
  const handleSaveCoupon = (e) => {
    e.preventDefault();
    const url = editCoupon ? `${API}/module/coupons/${editCoupon.id}` : `${API}/module/coupons`;
    const method = editCoupon ? 'PUT' : 'POST';
    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(couponForm) }).then(() => { setShowCouponModal(false); fetchCoupons(); });
  };
  const handleToggleCouponStatus = (c) => { fetch(`${API}/module/coupons/${c.id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: c.status === 'Active' ? 'Draft' : 'Active' }) }).then(fetchCoupons); };
  const handleDeleteCoupon = (id) => { if (window.confirm("Delete coupon?")) fetch(`${API}/module/coupons/${id}`, { method: 'DELETE' }).then(fetchCoupons); };

  const filteredPerks = perks.filter(p => (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCoupons = coupons.filter(c => (c.code || '').toLowerCase().includes(couponSearch.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '50px' }}>
      {/* Page Header */}
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
            Cart Page Settings & Manager
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Configure Cart page fields with 3-button actions [Deactivate] [Edit] [Trash], Add More Field on top, & Save Changes on bottom.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={openAddCoupon} style={btnP}>+ Add Coupon Code</button>
        </div>
      </div>

      {/* ── PANEL 1: CART HEADER & STEP INDICATORS ─────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 1</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Cart Title & Checkout Step Labels</h3>
          </div>
          <button type="button" onClick={() => handleAddMoreField(1)} style={{ ...btnG, border: '1px solid #B8935B', fontWeight: '700' }}>+ Add More Field</button>
        </div>

        {panel1Fields.map(f => (
          <FieldRow 
            key={f.key} 
            label={f.label} 
            value={f.value} 
            status={f.status} 
            onChangeValue={v => setPanel1Fields(p => p.map(item => item.key === f.key ? { ...item, value: v } : item))} 
            onToggleStatus={() => setPanel1Fields(p => p.map(item => item.key === f.key ? { ...item, status: (item.status === 'Active' || item.status === 'Live') ? 'Inactive' : 'Active' } : item))} 
            onEditLabel={() => handleEditLabel(setPanel1Fields, f.key, f.label)} 
            onDelete={() => setPanel1Fields(p => p.filter(item => item.key !== f.key))} 
          />
        ))}

        <div style={{ marginTop: '10px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
          <button type="button" onClick={handleSaveAllSettings} disabled={savingSettings} style={btnP}>
            {savingSettings ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── PANEL 2: EMPTY CART STATE SETTINGS ─────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 2</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Empty Cart State Configuration</h3>
          </div>
          <button type="button" onClick={() => handleAddMoreField(2)} style={{ ...btnG, border: '1px solid #B8935B', fontWeight: '700' }}>+ Add More Field</button>
        </div>

        {panel2Fields.map(f => (
          <FieldRow 
            key={f.key} 
            label={f.label} 
            value={f.value} 
            status={f.status} 
            onChangeValue={v => setPanel2Fields(p => p.map(item => item.key === f.key ? { ...item, value: v } : item))} 
            onToggleStatus={() => setPanel2Fields(p => p.map(item => item.key === f.key ? { ...item, status: (item.status === 'Active' || item.status === 'Live') ? 'Inactive' : 'Active' } : item))} 
            onEditLabel={() => handleEditLabel(setPanel2Fields, f.key, f.label)} 
            onDelete={() => setPanel2Fields(p => p.filter(item => item.key !== f.key))} 
          />
        ))}

        <div style={{ marginTop: '10px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
          <button type="button" onClick={handleSaveAllSettings} disabled={savingSettings} style={btnP}>
            {savingSettings ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── PANEL 3: ORDER SUMMARY & DYNAMIC DELIVERY DATE ────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 3</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Order Summary Card & Delivery Options</h3>
          </div>
          <button type="button" onClick={() => handleAddMoreField(3)} style={{ ...btnG, border: '1px solid #B8935B', fontWeight: '700' }}>+ Add More Field</button>
        </div>

        {panel3Fields.map(f => (
          <FieldRow 
            key={f.key} 
            label={f.label} 
            value={f.value} 
            status={f.status} 
            onChangeValue={v => setPanel3Fields(p => p.map(item => item.key === f.key ? { ...item, value: v } : item))} 
            onToggleStatus={() => setPanel3Fields(p => p.map(item => item.key === f.key ? { ...item, status: (item.status === 'Active' || item.status === 'Live') ? 'Inactive' : 'Active' } : item))} 
            onEditLabel={() => handleEditLabel(setPanel3Fields, f.key, f.label)} 
            onDelete={() => setPanel3Fields(p => p.filter(item => item.key !== f.key))} 
          />
        ))}

        <div style={{ marginTop: '10px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
          <button type="button" onClick={handleSaveAllSettings} disabled={savingSettings} style={btnP}>
            {savingSettings ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── PANEL 4: CART PERKS ─────────────────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 4</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Active Cart Perks ({perks.length})</h3>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input type="text" placeholder="Search perk..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...iStyle, width: '220px' }} />
            <button onClick={openAddPerk} style={btnP}>+ Add Perk</button>
          </div>
        </div>

        {loadingPerks ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#E7D9C9' }}>Loading...</div>
        ) : filteredPerks.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#B8A99A' }}>No perks found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#182012', borderBottom: '1px solid rgba(184,147,91,0.25)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B' }}>PERK NAME</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B' }}>PROMO CODE</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B' }}>VALUE</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B' }}>STATUS</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPerks.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(184,147,91,0.1)' }}>
                    <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: '700', color: '#F6F1E3' }}>{p.title}</td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', fontWeight: '700', color: '#B8935B' }}>{p.code || 'N/A'}</td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', color: '#E7D9C9' }}>{p.discount_value}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '10px', fontWeight: '700', color: p.status === 'Active' ? '#22c55e' : '#EF4444', backgroundColor: p.status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>{p.status || 'Active'}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleTogglePerkStatus(p)} style={{ ...btnG, padding: '5px 10px', fontSize: '11px' }}>{p.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                        <button onClick={() => openEditPerk(p)} style={{ ...btnG, padding: '5px 10px' }}><EditIcon /></button>
                        <button onClick={() => handleDeletePerk(p.id)} style={{ ...btnD, padding: '5px 10px' }}><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── PANEL 5: COUPONS ─────────────────────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 5</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Active Coupon Codes ({coupons.length})</h3>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input type="text" placeholder="Search coupon..." value={couponSearch} onChange={e => setCouponSearch(e.target.value)} style={{ ...iStyle, width: '220px' }} />
            <button onClick={openAddCoupon} style={btnP}>+ Add Coupon Code</button>
          </div>
        </div>

        {loadingCoupons ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#E7D9C9' }}>Loading...</div>
        ) : filteredCoupons.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#B8A99A' }}>No coupons found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#182012', borderBottom: '1px solid rgba(184,147,91,0.25)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B' }}>COUPON CODE</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B' }}>DISCOUNT</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B' }}>DESCRIPTION</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B' }}>STATUS</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(184,147,91,0.1)' }}>
                    <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: '700', color: '#B8935B' }}>{c.code}</td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', fontWeight: '700', color: '#F6F1E3' }}>
                      {c.discount_type === 'fixed' || Number(c.discount_amount) > 0 ? `Rs. ${c.discount_amount} OFF` : `${c.discount_percentage}% OFF`}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', color: '#E7D9C9' }}>{c.description || 'Discount Coupon'}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '10px', fontWeight: '700', color: c.status === 'Active' ? '#22c55e' : '#EF4444', backgroundColor: c.status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>{c.status || 'Active'}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleToggleCouponStatus(c)} style={{ ...btnG, padding: '5px 10px', fontSize: '11px' }}>{c.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                        <button onClick={() => openEditCoupon(c)} style={{ ...btnG, padding: '5px 10px' }}><EditIcon /></button>
                        <button onClick={() => handleDeleteCoupon(c.id)} style={{ ...btnD, padding: '5px 10px' }}><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Perk Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '26px', width: '90%', maxWidth: '480px', border: '1px solid #B8935B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', color: '#F6F1E3' }}>{editPerk ? 'Edit Perk' : 'Add Perk'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9' }}><CloseIcon /></button>
            </div>
            <form onSubmit={handleSavePerk} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><label style={lStyle}>Perk Name</label><input required value={perkForm.title} onChange={e => setPerkForm(p => ({ ...p, title: e.target.value }))} style={iStyle} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={lStyle}>Code</label><input value={perkForm.code} onChange={e => setPerkForm(p => ({ ...p, code: e.target.value }))} style={iStyle} /></div>
                <div><label style={lStyle}>Value</label><input value={perkForm.discount_value} onChange={e => setPerkForm(p => ({ ...p, discount_value: e.target.value }))} style={iStyle} /></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnG}>Cancel</button>
                <button type="submit" style={btnP}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '26px', width: '90%', maxWidth: '480px', border: '1px solid #B8935B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', color: '#F6F1E3' }}>{editCoupon ? 'Edit Coupon' : 'Add Coupon'}</h3>
              <button onClick={() => setShowCouponModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9' }}><CloseIcon /></button>
            </div>
            <form onSubmit={handleSaveCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><label style={lStyle}>Coupon Code</label><input required value={couponForm.code} onChange={e => setCouponForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} style={iStyle} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>Discount Type</label>
                  <select value={couponForm.discount_type} onChange={e => setCouponForm(p => ({ ...p, discount_type: e.target.value }))} style={iStyle}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label style={lStyle}>Value</label>
                  <input type="number" min="0" value={couponForm.discount_type === 'percentage' ? couponForm.discount_percentage : couponForm.discount_amount} onChange={e => setCouponForm(p => ({ ...p, [couponForm.discount_type === 'percentage' ? 'discount_percentage' : 'discount_amount']: e.target.value }))} style={iStyle} />
                </div>
              </div>
              <div><label style={lStyle}>Description</label><input value={couponForm.description} onChange={e => setCouponForm(p => ({ ...p, description: e.target.value }))} style={iStyle} /></div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCouponModal(false)} style={btnG}>Cancel</button>
                <button type="submit" style={btnP}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartManagerPage;
