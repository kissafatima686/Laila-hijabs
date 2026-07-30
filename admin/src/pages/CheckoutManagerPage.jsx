import React, { useState, useEffect } from 'react';

/**
 * Checkout Page Manager (Under Header Utilities -> Checkout Page Settings):
 *  - Panels 1, 2, 3, 4: CMS Field Cards with "+ Add More Field" on top,
 *                      3-button action row [ Deactivate / Activate ] [ Edit Icon ] [ Trash Icon ] on every field right side,
 *                      and "Save Changes" on bottom.
 *  - Panel 5: Active Shipping Rules & Regions Table (Full CRUD)
 */

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

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

const CheckoutManagerPage = () => {
  // Panel 1 Fields (Header & Steps)
  const [panel1Fields, setPanel1Fields] = useState([
    { key: 'title', label: 'CHECKOUT PAGE MAIN TITLE', value: 'Checkout', status: 'Active' },
    { key: 'step_1_label', label: 'STEP 1 LABEL', value: '1. Cart', status: 'Active' },
    { key: 'step_2_label', label: 'STEP 2 LABEL', value: '2. Checkout', status: 'Active' },
    { key: 'step_3_label', label: 'STEP 3 LABEL', value: '3. Payment', status: 'Active' }
  ]);

  // Panel 2 Fields (Contact Info)
  const [panel2Fields, setPanel2Fields] = useState([
    { key: 'contact_title', label: 'CONTACT SECTION HEADING', value: 'Contact Information', status: 'Active' },
    { key: 'email_label', label: 'EMAIL ADDRESS FIELD LABEL', value: 'Email Address', status: 'Active' },
    { key: 'email_placeholder', label: 'EMAIL FIELD PLACEHOLDER', value: 'you@example.com', status: 'Active' },
    { key: 'phone_label', label: 'PHONE NUMBER FIELD LABEL', value: 'Phone Number', status: 'Active' },
    { key: 'phone_placeholder', label: 'PHONE FIELD PLACEHOLDER', value: '+92 323 8399480', status: 'Active' }
  ]);

  // Panel 3 Fields (Shipping Address)
  const [panel3Fields, setPanel3Fields] = useState([
    { key: 'shipping_title', label: 'SHIPPING SECTION HEADING', value: 'Shipping Address', status: 'Active' },
    { key: 'first_name_label', label: 'FIRST NAME FIELD LABEL', value: 'First Name', status: 'Active' },
    { key: 'last_name_label', label: 'LAST NAME FIELD LABEL', value: 'Last Name', status: 'Active' },
    { key: 'street_label', label: 'STREET ADDRESS FIELD LABEL', value: 'Street Address', status: 'Active' },
    { key: 'street_placeholder', label: 'STREET FIELD PLACEHOLDER', value: 'House number and street name', status: 'Active' },
    { key: 'city_label', label: 'TOWN / CITY LABEL', value: 'Town / City', status: 'Active' },
    { key: 'postcode_label', label: 'POSTCODE LABEL', value: 'Postcode', status: 'Active' },
    { key: 'country_label', label: 'COUNTRY / REGION LABEL', value: 'Country / Region', status: 'Active' }
  ]);

  // Panel 4 Fields (Order Summary Card)
  const [panel4Fields, setPanel4Fields] = useState([
    { key: 'summary_heading', label: 'ORDER SUMMARY HEADING', value: 'Order Summary', status: 'Active' },
    { key: 'subtotal_label', label: 'SUB TOTAL LABEL', value: 'Sub Total', status: 'Active' },
    { key: 'shipping_label', label: 'SHIPPING LABEL', value: 'Shipping', status: 'Active' },
    { key: 'shipping_value', label: 'SHIPPING COST VALUE TEXT', value: 'Free', status: 'Active' },
    { key: 'total_pay_label', label: 'TOTAL TO PAY LABEL', value: 'Total to Pay', status: 'Active' },
    { key: 'payment_button_text', label: 'PAYMENT BUTTON TEXT', value: 'Continue to Payment', status: 'Active' },
    { key: 'return_cart_text', label: 'RETURN TO CART LINK TEXT', value: '← Return to Cart', status: 'Active' }
  ]);

  const [savingSettings, setSavingSettings] = useState(false);

  // Shipping Rules State
  const [rules, setRules] = useState([]);
  const [loadingRules, setLoadingRules] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editRule, setEditRule] = useState(null);
  const [ruleForm, setRuleForm] = useState({ region_name: '', shipping_fee: 'Free', estimated_delivery: '2-3 Business Days', status: 'Active' });

  const fetchSettings = () => {
    fetch(`${API}/sections/checkout_page_settings`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          let meta = {};
          try { meta = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : (data.metadata || {}); } catch(e) {}
          if (Array.isArray(meta.p1)) setPanel1Fields(meta.p1);
          if (Array.isArray(meta.p2)) setPanel2Fields(meta.p2);
          if (Array.isArray(meta.p3)) setPanel3Fields(meta.p3);
          if (Array.isArray(meta.p4)) setPanel4Fields(meta.p4);
        }
      })
      .catch(err => console.error("Error fetching checkout settings:", err));
  };

  const fetchRules = () => {
    setLoadingRules(true);
    fetch(`${API}/module/checkout-rules`)
      .then(res => res.json())
      .then(data => setRules(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching rules:", err))
      .finally(() => setLoadingRules(false));
  };

  useEffect(() => {
    fetchSettings();
    fetchRules();
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
    if (panelNum === 4) setPanel4Fields(p => [...p, newF]);
  };

  const handleSaveAllSettings = () => {
    setSavingSettings(true);
    const fieldStatuses = {};
    const metaData = {
      p1: panel1Fields,
      p2: panel2Fields,
      p3: panel3Fields,
      p4: panel4Fields,
      field_statuses: fieldStatuses
    };

    [...panel1Fields, ...panel2Fields, ...panel3Fields, ...panel4Fields].forEach(f => {
      fieldStatuses[f.key] = f.status;
      if (f.status === 'Active') {
        metaData[f.key] = f.value;
      } else {
        metaData[f.key] = '[DISABLED]';
      }
    });

    const titleVal = panel1Fields.find(f => f.key === 'title' && f.status === 'Active')?.value || 'Checkout';

    fetch(`${API}/sections/checkout_page_settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: titleVal,
        metadata: metaData
      })
    })
      .then(() => alert('Checkout Page settings saved successfully!'))
      .catch(err => console.error("Error saving checkout settings:", err))
      .finally(() => setSavingSettings(false));
  };

  // Shipping Rules Handlers
  const openAddRule = () => { setEditRule(null); setRuleForm({ region_name: '', shipping_fee: 'Free', estimated_delivery: '2-3 Business Days', status: 'Active' }); setShowModal(true); };
  const openEditRule = (r) => { setEditRule(r); setRuleForm({ region_name: r.region_name || '', shipping_fee: r.shipping_fee || 'Free', estimated_delivery: r.estimated_delivery || '2-3 Business Days', status: r.status || 'Active' }); setShowModal(true); };
  const handleSaveRule = (e) => {
    e.preventDefault();
    const url = editRule ? `${API}/module/checkout-rules/${editRule.id}` : `${API}/module/checkout-rules`;
    const method = editRule ? 'PUT' : 'POST';
    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ruleForm) }).then(() => { setShowModal(false); fetchRules(); });
  };
  const handleToggleRuleStatus = (r) => { fetch(`${API}/module/checkout-rules/${r.id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: r.status === 'Active' ? 'Draft' : 'Active' }) }).then(fetchRules); };
  const handleDeleteRule = (id) => { if (window.confirm("Delete rule?")) fetch(`${API}/module/checkout-rules/${id}`, { method: 'DELETE' }).then(fetchRules); };

  const filteredRules = rules.filter(r => (r.region_name || '').toLowerCase().includes(searchQuery.toLowerCase()));

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
            Checkout Page Settings & Manager
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Configure Checkout page fields with 3-button actions [Deactivate] [Edit] [Trash], Add More Field on top, & Save Changes on bottom.
          </p>
        </div>
        <button onClick={openAddRule} style={{ ...btnP, boxShadow: '0 4px 14px rgba(184,147,91,0.4)' }}>
          + Add Shipping Rule
        </button>
      </div>

      {/* ── PANEL 1: CHECKOUT HEADER & STEPS ────────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 1</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Checkout Title & Progress Steps</h3>
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
          <button type="button" onClick={handleSaveAllSettings} disabled={savingSettings} style={btnP}>{savingSettings ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>

      {/* ── PANEL 2: CONTACT INFORMATION FORM FIELDS ───────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 2</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Contact Information Section Fields</h3>
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
          <button type="button" onClick={handleSaveAllSettings} disabled={savingSettings} style={btnP}>{savingSettings ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>

      {/* ── PANEL 3: SHIPPING ADDRESS FORM FIELDS ─────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 3</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Shipping Address Section Fields</h3>
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
          <button type="button" onClick={handleSaveAllSettings} disabled={savingSettings} style={btnP}>{savingSettings ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>

      {/* ── PANEL 4: ORDER SUMMARY CARD FIELDS ─────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 4</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Order Summary Card & Button Labels</h3>
          </div>
          <button type="button" onClick={() => handleAddMoreField(4)} style={{ ...btnG, border: '1px solid #B8935B', fontWeight: '700' }}>+ Add More Field</button>
        </div>
        {panel4Fields.map(f => (
          <FieldRow 
            key={f.key} 
            label={f.label} 
            value={f.value} 
            status={f.status} 
            onChangeValue={v => setPanel4Fields(p => p.map(item => item.key === f.key ? { ...item, value: v } : item))} 
            onToggleStatus={() => setPanel4Fields(p => p.map(item => item.key === f.key ? { ...item, status: (item.status === 'Active' || item.status === 'Live') ? 'Inactive' : 'Active' } : item))} 
            onEditLabel={() => handleEditLabel(setPanel4Fields, f.key, f.label)} 
            onDelete={() => setPanel4Fields(p => p.filter(item => item.key !== f.key))} 
          />
        ))}
        <div style={{ marginTop: '10px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
          <button type="button" onClick={handleSaveAllSettings} disabled={savingSettings} style={btnP}>{savingSettings ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>

      {/* ── PANEL 5: SHIPPING RULES (FULL CRUD TABLE) ─────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 5</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Active Shipping Rules ({rules.length})</h3>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input type="text" placeholder="Search rule..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...iStyle, width: '220px' }} />
            <button onClick={openAddRule} style={btnP}>+ Add Shipping Rule</button>
          </div>
        </div>

        {loadingRules ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#E7D9C9' }}>Loading...</div>
        ) : filteredRules.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#B8A99A' }}>No rules found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#182012', borderBottom: '1px solid rgba(184,147,91,0.25)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B' }}>REGION NAME</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B' }}>FEE</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B' }}>ESTIMATE</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B' }}>STATUS</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredRules.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(184,147,91,0.1)' }}>
                    <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: '700', color: '#F6F1E3' }}>{r.region_name}</td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', fontWeight: '700', color: '#B8935B' }}>{r.shipping_fee}</td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', color: '#E7D9C9' }}>{r.estimated_delivery}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '10px', fontWeight: '700', color: r.status === 'Active' ? '#22c55e' : '#EF4444', backgroundColor: r.status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>{r.status || 'Active'}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleToggleRuleStatus(r)} style={{ ...btnG, padding: '5px 10px', fontSize: '11px' }}>{r.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                        <button onClick={() => openEditRule(r)} style={{ ...btnG, padding: '5px 10px' }}><EditIcon /></button>
                        <button onClick={() => handleDeleteRule(r.id)} style={{ ...btnD, padding: '5px 10px' }}><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rule Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '26px', width: '90%', maxWidth: '480px', border: '1px solid #B8935B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', color: '#F6F1E3' }}>{editRule ? 'Edit Rule' : 'Add Rule'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9' }}><CloseIcon /></button>
            </div>
            <form onSubmit={handleSaveRule} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><label style={lStyle}>Region Name</label><input required value={ruleForm.region_name} onChange={e => setRuleForm(p => ({ ...p, region_name: e.target.value }))} style={iStyle} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={lStyle}>Fee</label><input value={ruleForm.shipping_fee} onChange={e => setRuleForm(p => ({ ...p, shipping_fee: e.target.value }))} style={iStyle} /></div>
                <div><label style={lStyle}>Estimate</label><input value={ruleForm.estimated_delivery} onChange={e => setRuleForm(p => ({ ...p, estimated_delivery: e.target.value }))} style={iStyle} /></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnG}>Cancel</button>
                <button type="submit" style={btnP}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutManagerPage;
