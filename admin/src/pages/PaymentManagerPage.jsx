import React, { useState, useEffect } from 'react';

/**
 * Payment & Receipt Settings Manager (Under Header Utilities -> Payment & Receipt Settings):
 *  - Panel 1: Order Confirmation Header Fields
 *  - Panel 2: Billed To & Order Info Fields
 *  - Panel 3: Item Breakdown & Totals Labels
 *  - Panel 4: Action Button Labels
 *  (Each Panel has "+ Add More Field" on top, 3-button action row [ Deactivate / Activate ] [ Edit Icon ] [ Trash Icon ] on every field right side, and "Save Changes" on bottom)
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

const PaymentManagerPage = () => {
  // Panel 1 Fields (Header & Titles)
  const [panel1Fields, setPanel1Fields] = useState([
    { key: 'title', label: 'MAIN PAGE TITLE', value: 'Order Confirmation', status: 'Active' },
    { key: 'step_3_label', label: 'STEP 3 LABEL', value: '3. Payment & Receipt', status: 'Active' },
    { key: 'payment_confirmed_badge', label: 'ORDER CONFIRMED BADGE TEXT', value: '✓ Order Confirmed', status: 'Active' },
    { key: 'thank_you_title', label: 'THANK YOU HEADING TEXT', value: 'Thank You For Your Order!', status: 'Active' }
  ]);

  // Panel 2 Fields (Grid Headings)
  const [panel2Fields, setPanel2Fields] = useState([
    { key: 'billed_to_header', label: 'BILLED TO SECTION HEADING', value: 'Billed To:', status: 'Active' },
    { key: 'order_info_header', label: 'ORDER INFO SECTION HEADING', value: 'Order Info:', status: 'Active' }
  ]);

  // Panel 3 Fields (Item Breakdown & Totals)
  const [panel3Fields, setPanel3Fields] = useState([
    { key: 'item_breakdown_header', label: 'ITEM BREAKDOWN HEADING', value: 'Item Breakdown', status: 'Active' },
    { key: 'subtotal_label', label: 'SUBTOTAL LABEL', value: 'Subtotal', status: 'Active' },
    { key: 'discount_label', label: 'DISCOUNT LABEL', value: 'Discount', status: 'Active' },
    { key: 'shipping_label', label: 'SHIPPING LABEL', value: 'Shipping', status: 'Active' },
    { key: 'free_text', label: 'FREE SHIPPING TEXT', value: 'Free', status: 'Active' },
    { key: 'total_paid_label', label: 'TOTAL PAID LABEL', value: 'Total Paid', status: 'Active' }
  ]);

  // Panel 4 Fields (Action Buttons, WhatsApp Number, & Return Home Directory)
  const [panel4Fields, setPanel4Fields] = useState([
    { key: 'send_whatsapp_btn', label: 'WHATSAPP BUTTON TEXT', value: 'Send Receipt to WhatsApp', status: 'Active' },
    { key: 'whatsapp_number', label: 'WHATSAPP PHONE NUMBER', value: '923238399480', status: 'Active' },
    { key: 'return_home_btn', label: 'RETURN HOME BUTTON TEXT', value: 'Return to Home', status: 'Active' },
    { key: 'return_home_link', label: 'RETURN HOME DIRECTORY / URL LINK', value: '/', status: 'Active' }
  ]);

  const [savingSettings, setSavingSettings] = useState(false);

  const fetchSettings = () => {
    fetch(`${API}/sections/payment_page_settings`)
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
      .catch(err => console.error("Error fetching payment settings:", err));
  };

  useEffect(() => {
    fetchSettings();
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

    const titleVal = panel1Fields.find(f => f.key === 'title' && f.status === 'Active')?.value || 'Order Confirmation';

    fetch(`${API}/sections/payment_page_settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: titleVal,
        metadata: metaData
      })
    })
      .then(() => alert('Payment & Receipt Page settings saved successfully!'))
      .catch(err => console.error("Error saving payment settings:", err))
      .finally(() => setSavingSettings(false));
  };

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
            Payment & Receipt Settings Manager
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Configure Order Confirmation Receipt fields with 3-button actions [Deactivate] [Edit] [Trash], Add More Field on top, & Save Changes on bottom.
          </p>
        </div>
      </div>

      {/* ── PANEL 1: ORDER CONFIRMATION HEADER ─────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 1</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Order Confirmation Header & Badge Labels</h3>
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
            onToggleStatus={() => setPanel1Fields(p => p.map(item => item.key === f.key ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item))} 
            onEditLabel={() => handleEditLabel(setPanel1Fields, f.key, f.label)} 
            onDelete={() => setPanel1Fields(p => p.filter(item => item.key !== f.key))} 
          />
        ))}
        <div style={{ marginTop: '10px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
          <button type="button" onClick={handleSaveAllSettings} disabled={savingSettings} style={btnP}>{savingSettings ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>

      {/* ── PANEL 2: BILLED TO & ORDER INFO ─────────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 2</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Billed To & Order Info Grid Headings</h3>
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
            onToggleStatus={() => setPanel2Fields(p => p.map(item => item.key === f.key ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item))} 
            onEditLabel={() => handleEditLabel(setPanel2Fields, f.key, f.label)} 
            onDelete={() => setPanel2Fields(p => p.filter(item => item.key !== f.key))} 
          />
        ))}
        <div style={{ marginTop: '10px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
          <button type="button" onClick={handleSaveAllSettings} disabled={savingSettings} style={btnP}>{savingSettings ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>

      {/* ── PANEL 3: ITEM BREAKDOWN & TOTALS ───────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 3</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Item Breakdown & Summary Total Labels</h3>
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
            onToggleStatus={() => setPanel3Fields(p => p.map(item => item.key === f.key ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item))} 
            onEditLabel={() => handleEditLabel(setPanel3Fields, f.key, f.label)} 
            onDelete={() => setPanel3Fields(p => p.filter(item => item.key !== f.key))} 
          />
        ))}
        <div style={{ marginTop: '10px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
          <button type="button" onClick={handleSaveAllSettings} disabled={savingSettings} style={btnP}>{savingSettings ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>

      {/* ── PANEL 4: RECEIPT ACTION BUTTONS ─────────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>PANEL 4</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Action Button Text Labels</h3>
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
            onToggleStatus={() => setPanel4Fields(p => p.map(item => item.key === f.key ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item))} 
            onEditLabel={() => handleEditLabel(setPanel4Fields, f.key, f.label)} 
            onDelete={() => setPanel4Fields(p => p.filter(item => item.key !== f.key))} 
          />
        ))}
        <div style={{ marginTop: '10px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
          <button type="button" onClick={handleSaveAllSettings} disabled={savingSettings} style={btnP}>{savingSettings ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagerPage;
