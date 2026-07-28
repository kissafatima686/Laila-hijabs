import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api/admin';

const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' };
const cardStyle = { backgroundColor: '#222C1A', borderRadius: '16px', padding: '24px', border: '1px solid rgba(184,147,91,0.3)' };
const btnPrimary = { padding: '10px 20px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnGhost = { padding: '8px 14px', borderRadius: '6px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer' };
const btnDanger = { padding: '7px 12px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', fontSize: '12px', cursor: 'pointer' };

const EMPTY_ROW = { size_label: '', bust_cm: '', waist_cm: '', hip_cm: '', length_cm: '', us_size: '', uk_size: '', display_order: 0 };

const SizeGuidePage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState(EMPTY_ROW);
  const [saving, setSaving] = useState(false);

  const fetch_ = () => {
    setLoading(true);
    fetch(`${API}/module/size-guide`).then(r => r.json()).then(d => setRows(Array.isArray(d) ? d : [])).catch(() => setRows([])).finally(() => setLoading(false));
  };
  useEffect(() => { fetch_(); }, []);

  const openAdd = () => { setForm(EMPTY_ROW); setEditRow(null); setShowModal(true); };
  const openEdit = (r) => { setForm({ size_label: r.size_label || '', bust_cm: r.bust_cm || '', waist_cm: r.waist_cm || '', hip_cm: r.hip_cm || '', length_cm: r.length_cm || '', us_size: r.us_size || '', uk_size: r.uk_size || '', display_order: r.display_order || 0 }); setEditRow(r); setShowModal(true); };
  const handleSave = (e) => {
    e.preventDefault(); setSaving(true);
    const id = editRow?.row_id;
    fetch(id ? `${API}/module/size-guide/${id}` : `${API}/module/size-guide`, { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      .then(() => { setShowModal(false); fetch_(); }).finally(() => setSaving(false));
  };
  const handleDelete = (id) => {
    if (!window.confirm('Delete this row?')) return;
    fetch(`${API}/module/size-guide/${id}`, { method: 'DELETE' }).then(fetch_);
  };

  const sorted = [...rows].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', border: '1px solid #B8935B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '6px' }}>PRODUCTS</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>Size Guide</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>Manage the size chart table — all measurements in cm. Displayed on product pages.</p>
        </div>
        <button onClick={openAdd} style={btnPrimary}>+ Add Size Row</button>
      </div>

      <div style={cardStyle}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#E7D9C9' }}>Loading...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ backgroundColor: '#182012', borderBottom: '1px solid rgba(184,147,91,0.3)' }}>
                  {['Size', 'Bust (cm)', 'Waist (cm)', 'Hip (cm)', 'Length (cm)', 'US', 'UK', 'Order', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#B8A99A', fontSize: '13px' }}>No size rows yet. Add your first size.</td></tr>
                ) : sorted.map(r => (
                  <tr key={r.row_id} style={{ borderBottom: '1px solid rgba(184,147,91,0.1)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#B8935B', fontSize: '14px' }}>{r.size_label}</td>
                    {['bust_cm', 'waist_cm', 'hip_cm', 'length_cm', 'us_size', 'uk_size', 'display_order'].map(col => (
                      <td key={col} style={{ padding: '12px 16px', fontSize: '13px', color: '#E7D9C9' }}>{r[col] || '—'}</td>
                    ))}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => openEdit(r)} style={btnGhost}>Edit</button>
                        <button onClick={() => handleDelete(r.row_id)} style={btnDanger}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '28px', width: '90%', maxWidth: '520px', border: '1px solid #B8935B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#F6F1E3' }}>{editRow ? 'Edit Size Row' : 'Add Size Row'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Size Label *</label>
                <input required value={form.size_label} onChange={e => setForm(p => ({ ...p, size_label: e.target.value }))} style={inputStyle} placeholder="e.g. XS, S, M, L, XL, XXL" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {[['bust_cm', 'Bust (cm)'], ['waist_cm', 'Waist (cm)'], ['hip_cm', 'Hip (cm)'], ['length_cm', 'Length (cm)'], ['us_size', 'US Size'], ['uk_size', 'UK Size']].map(([key, lbl]) => (
                  <div key={key}>
                    <label style={labelStyle}>{lbl}</label>
                    <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} style={inputStyle} placeholder={`Enter ${lbl}...`} />
                  </div>
                ))}
              </div>
              <div>
                <label style={labelStyle}>Display Order</label>
                <input type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnGhost}>Cancel</button>
                <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving...' : 'Save Row'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeGuidePage;
