import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api/admin';

const iStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '12px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' };
const cardStyle = { backgroundColor: '#222C1A', borderRadius: '16px', padding: '22px', border: '1px solid rgba(184,147,91,0.3)' };
const btnPrimary = { padding: '9px 18px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnGhost = { padding: '9px 18px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid #B8935B', color: '#B8935B', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };

// Standard 3-button action style rules matching screenshot
const btnStatus = { 
  height: '36px', 
  padding: '0 14px', 
  borderRadius: '8px', 
  backgroundColor: '#182012', 
  border: '1px solid #B8935B', 
  color: '#F6F1E3', 
  fontSize: '12px', 
  fontWeight: '600', 
  cursor: 'pointer' 
};

const btnEditIcon = { 
  height: '36px', 
  width: '36px', 
  borderRadius: '8px', 
  backgroundColor: '#182012', 
  border: '1px solid #B8935B', 
  color: '#F6F1E3', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  cursor: 'pointer' 
};

const btnDeleteIcon = { 
  height: '36px', 
  width: '36px', 
  borderRadius: '8px', 
  backgroundColor: 'rgba(239,68,68,0.15)', 
  border: '1px solid rgba(239,68,68,0.4)', 
  color: '#EF4444', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  cursor: 'pointer' 
};

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DEFAULT_CONVERSIONS = [
  { id: 'c1', size_label: 'XXS', pk_size: '34-36', uk_size: '4-6', us_size: '0-2', eu_size: '32-34', status: 'Active' },
  { id: 'c2', size_label: 'XS', pk_size: '36-38', uk_size: '6-8', us_size: '2-4', eu_size: '34-36', status: 'Active' },
  { id: 'c3', size_label: 'S', pk_size: '38-40', uk_size: '10-12', us_size: '6-8', eu_size: '38-40', status: 'Active' },
  { id: 'c4', size_label: 'M', pk_size: '40-42', uk_size: '14-16', us_size: '10-12', eu_size: '42-44', status: 'Active' },
  { id: 'c5', size_label: 'L', pk_size: '44-46', uk_size: '18-20', us_size: '14-16', eu_size: '46-48', status: 'Active' },
  { id: 'c6', size_label: 'XL', pk_size: '48-50', uk_size: '22-24', us_size: '18-20', eu_size: '50-52', status: 'Active' },
  { id: 'c7', size_label: 'XXL', pk_size: '50-52', uk_size: '24-26', us_size: '20-22', eu_size: '52-54', status: 'Active' },
  { id: 'c8', size_label: '3XL', pk_size: '54-56', uk_size: '26-28', us_size: '22-24', eu_size: '54-56', status: 'Active' },
  { id: 'c9', size_label: '4XL', pk_size: '58-60', uk_size: '28-30', us_size: '24-26', eu_size: '56-58', status: 'Active' }
];

const DEFAULT_LENGTHS = [
  { id: 'l0', length_inches: '50', height_ft: "4'9\"-4'11\"", height_cm: '145-150', status: 'Active' },
  { id: 'l1', length_inches: '52', height_ft: "4'11\"-5'2\"", height_cm: '150-157', status: 'Active' },
  { id: 'l2', length_inches: '54', height_ft: "5'2\"-5'4\"", height_cm: '157-163', status: 'Active' },
  { id: 'l3', length_inches: '56', height_ft: "5'4\"-5'6\"", height_cm: '163-168', status: 'Active' },
  { id: 'l4', length_inches: '58', height_ft: "5'6\"-5'8\"", height_cm: '168-173', status: 'Active' },
  { id: 'l5', length_inches: '60', height_ft: "5'8\"-5'10\"", height_cm: '173-178', status: 'Active' },
  { id: 'l6', length_inches: '62', height_ft: "5'9\"-6'2\"", height_cm: '175-188', status: 'Active' },
  { id: 'l7', length_inches: '64', height_ft: "6'2\"-6'5\"", height_cm: '188-195', status: 'Active' }
];

const SizeGuidePage = () => {
  const [conversions, setConversions] = useState(DEFAULT_CONVERSIONS);
  const [lengths, setLengths] = useState(DEFAULT_LENGTHS);
  const [guideHeader, setGuideHeader] = useState({
    title: 'Size Guide',
    intro: 'At LAILA HIJABS, we understand the importance of finding the perfect fit when it comes to clothing. That\'s why we offer a wide range of sizes and lengths to suit your desired fit. Our sizing chart below will help you find the right size for you.',
    howto_subtitle: 'To determine your length, measure from the highest point of your shoulder to the length you want the dress to sit.',
    howto_tip: 'TIP: For accurate measurements, wear the shoes you intend to pair with the garment. If you plan to wear heels with a garment, consider sizing up for the length measurement.',
    howto_image: '/hero2.png',
    chest_instructions: 'Measure around the fullest part of your chest.',
    waist_instructions: 'Measure at the narrowest part of your waistline.',
    hips_instructions: 'Measure at the fullest part of your hips.'
  });

  const [saving, setSaving] = useState(false);

  const fetch_ = () => {
    fetch(`${API}/sections/products_size_guide`)
      .then(r => r.json())
      .then(d => {
        if (d && d.metadata) {
          let m = {};
          try { m = typeof d.metadata === 'string' ? JSON.parse(d.metadata) : d.metadata; } catch(e) {}
          if (Array.isArray(m.conversions) && m.conversions.length > 0) setConversions(m.conversions);
          if (Array.isArray(m.lengths) && m.lengths.length > 0) setLengths(m.lengths);
          if (m.header) setGuideHeader(prev => ({ ...prev, ...m.header }));
        }
      })
      .catch(() => {});
  };

  useEffect(() => { fetch_(); }, []);

  const handleSaveAll = () => {
    setSaving(true);
    const meta = {
      conversions,
      lengths,
      header: guideHeader
    };

    fetch(`${API}/sections/products_size_guide`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: guideHeader.title,
        metadata: meta
      })
    })
      .then(() => alert('Size Guide settings & rows saved successfully!'))
      .catch(() => alert('Error saving Size Guide.'))
      .finally(() => setSaving(false));
  };

  const addConversionRow = () => {
    const newId = `c_${Date.now()}`;
    setConversions(prev => [...prev, { id: newId, size_label: '3XL', uk_size: '26-28', us_size: '22-24', eu_size: '54-56', status: 'Active' }]);
  };

  const deleteConversionRow = (id) => {
    if (conversions.length <= 1) return alert('At least 1 size row must remain.');
    setConversions(prev => prev.filter(c => c.id !== id));
  };

  const toggleConversionStatus = (id) => {
    setConversions(prev => prev.map(c => c.id === id ? { ...c, status: (c.status === 'Active' || c.status === 'Live') ? 'Inactive' : 'Active' } : c));
  };

  const addLengthRow = () => {
    const newId = `l_${Date.now()}`;
    setLengths(prev => [...prev, { id: newId, length_inches: '64', height_ft: "6'2\"-6'5\"", height_cm: '188-195', status: 'Active' }]);
  };

  const deleteLengthRow = (id) => {
    if (lengths.length <= 1) return alert('At least 1 length row must remain.');
    setLengths(prev => prev.filter(l => l.id !== id));
  };

  const toggleLengthStatus = (id) => {
    setLengths(prev => prev.map(l => l.id === id ? { ...l, status: (l.status === 'Active' || l.status === 'Live') ? 'Inactive' : 'Active' } : l));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '50px' }}>
      
      {/* ── Page Banner Header ────────────────────────────────────────────── */}
      <div style={{ 
        ...cardStyle, 
        background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', 
        border: '1px solid #B8935B', 
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '12px' 
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '6px' }}>PRODUCTS & FITTINGS</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>Size Guide Chart Manager</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>Manage Size Conversions, Length Measurements rows with full edit, deactivate & delete controls.</p>
        </div>
        <button onClick={handleSaveAll} disabled={saving} style={{ ...btnPrimary, boxShadow: '0 4px 14px rgba(184, 147, 91, 0.4)' }}>
          {saving ? 'Saving All...' : 'Save All Changes'}
        </button>
      </div>

      {/* ── SECTION 1: HEADER TEXT & INTRO ───────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#B8935B' }}>1. Page Title & Intro Paragraph</h3>
          <button onClick={handleSaveAll} style={btnGhost}>Save Section</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={lStyle}>Page Title</label>
            <input value={guideHeader.title} onChange={e => setGuideHeader({ ...guideHeader, title: e.target.value })} style={iStyle} />
          </div>
          <div>
            <label style={lStyle}>Introduction Text</label>
            <textarea rows="3" value={guideHeader.intro} onChange={e => setGuideHeader({ ...guideHeader, intro: e.target.value })} style={{ ...iStyle, resize: 'vertical' }} />
          </div>
        </div>
      </div>

      {/* ── SECTION 2: SIZE CONVERSION ROWS ───────────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>WOMEN'S CLOTHING</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
              Size Conversion Rows ({conversions.length})
            </h3>
          </div>

          {/* Toggle visible size standards (PK, UK, US, EU) */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', backgroundColor: '#182012', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(184,147,91,0.3)' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#B8935B' }}>ACTIVE COLUMNS:</span>
            {[
              { key: 'show_pk', label: 'PK Size' },
              { key: 'show_uk', label: 'UK Size' },
              { key: 'show_us', label: 'US Size' },
              { key: 'show_eu', label: 'EU Size' }
            ].map(col => (
              <label key={col.key} style={{ fontSize: '12px', color: '#F6F1E3', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input 
                  type="checkbox" 
                  checked={guideHeader[col.key] !== false} 
                  onChange={e => setGuideHeader({ ...guideHeader, [col.key]: e.target.checked })} 
                />
                {col.label}
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={addConversionRow} style={{ ...btnGhost, border: '1px solid #B8935B', fontWeight: '700' }}>
              + Add Size Row
            </button>
            <button onClick={handleSaveAll} style={btnPrimary}>Save Section</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {conversions.map((c) => {
            const isActive = c.status === 'Active' || c.status === undefined;
            return (
              <div key={c.id} style={{
                backgroundColor: '#182012',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(184,147,91,0.3)',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: 1, display: 'flex', gap: '10px', minWidth: '280px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '110px' }}>
                    <label style={lStyle}>LAILA HIJABS SIZE</label>
                    <input 
                      value={c.size_label} 
                      onChange={e => setConversions(prev => prev.map(item => item.id === c.id ? { ...item, size_label: e.target.value } : item))} 
                      style={{ ...iStyle, fontWeight: '700', color: isActive ? '#F6F1E3' : '#EF4444' }} 
                      placeholder="e.g. S, M, L" 
                    />
                  </div>
                  {guideHeader.show_pk !== false && (
                    <div style={{ flex: 1, minWidth: '110px' }}>
                      <label style={lStyle}>PK SIZE</label>
                      <input 
                        value={c.pk_size || ''} 
                        onChange={e => setConversions(prev => prev.map(item => item.id === c.id ? { ...item, pk_size: e.target.value } : item))} 
                        style={iStyle} 
                        placeholder="e.g. 38-40" 
                      />
                    </div>
                  )}
                  {guideHeader.show_uk !== false && (
                    <div style={{ flex: 1, minWidth: '110px' }}>
                      <label style={lStyle}>UK SIZE</label>
                      <input 
                        value={c.uk_size} 
                        onChange={e => setConversions(prev => prev.map(item => item.id === c.id ? { ...item, uk_size: e.target.value } : item))} 
                        style={iStyle} 
                        placeholder="e.g. 10-12" 
                      />
                    </div>
                  )}
                  {guideHeader.show_us !== false && (
                    <div style={{ flex: 1, minWidth: '110px' }}>
                      <label style={lStyle}>US SIZE</label>
                      <input 
                        value={c.us_size} 
                        onChange={e => setConversions(prev => prev.map(item => item.id === c.id ? { ...item, us_size: e.target.value } : item))} 
                        style={iStyle} 
                        placeholder="e.g. 6-8" 
                      />
                    </div>
                  )}
                  {guideHeader.show_eu !== false && (
                    <div style={{ flex: 1, minWidth: '110px' }}>
                      <label style={lStyle}>EU SIZE</label>
                      <input 
                        value={c.eu_size} 
                        onChange={e => setConversions(prev => prev.map(item => item.id === c.id ? { ...item, eu_size: e.target.value } : item))} 
                        style={iStyle} 
                        placeholder="e.g. 38-40" 
                      />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button 
                    type="button" 
                    onClick={() => toggleConversionStatus(c.id)} 
                    style={{ ...btnStatus, backgroundColor: isActive ? '#182012' : 'rgba(239,68,68,0.15)', color: isActive ? '#F6F1E3' : '#EF4444', borderColor: isActive ? '#B8935B' : 'rgba(239,68,68,0.4)' }}
                  >
                    {isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button type="button" onClick={handleSaveAll} style={btnEditIcon} title="Save & Edit">
                    <EditIcon />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => deleteConversionRow(c.id)} 
                    style={btnDeleteIcon}
                    title="Delete Row"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 3: LENGTH MEASUREMENTS ROWS ──────────────────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>LENGTH & HEIGHT CHART</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>
              Length Measurements Rows ({lengths.length})
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={addLengthRow} style={btnStatus}>
              + Add Length Row
            </button>
            <button onClick={handleSaveAll} style={btnPrimary}>Save Section</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {lengths.map((l) => {
            const isActive = l.status === 'Active' || l.status === undefined;
            return (
              <div key={l.id} style={{
                backgroundColor: '#182012',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(184,147,91,0.3)',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1.5fr', gap: '12px', minWidth: '280px' }}>
                  <div>
                    <label style={lStyle}>LENGTH (INCHES)</label>
                    <input 
                      value={l.length_inches} 
                      onChange={e => setLengths(prev => prev.map(item => item.id === l.id ? { ...item, length_inches: e.target.value } : item))} 
                      style={{ ...iStyle, fontWeight: '700', color: isActive ? '#F6F1E3' : '#EF4444' }} 
                      placeholder="e.g. 56" 
                    />
                  </div>
                  <div>
                    <label style={lStyle}>RECOMMENDED HEIGHT</label>
                    <input 
                      value={l.height_ft} 
                      onChange={e => setLengths(prev => prev.map(item => item.id === l.id ? { ...item, height_ft: e.target.value } : item))} 
                      style={iStyle} 
                      placeholder="e.g. 5'4-5'6" 
                    />
                  </div>
                  <div>
                    <label style={lStyle}>RECOMMENDED HEIGHT (CM)</label>
                    <input 
                      value={l.height_cm} 
                      onChange={e => setLengths(prev => prev.map(item => item.id === l.id ? { ...item, height_cm: e.target.value } : item))} 
                      style={iStyle} 
                      placeholder="e.g. 163-168" 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button 
                    type="button" 
                    onClick={() => toggleLengthStatus(l.id)} 
                    style={{ ...btnStatus, backgroundColor: isActive ? '#182012' : 'rgba(239,68,68,0.15)', color: isActive ? '#F6F1E3' : '#EF4444', borderColor: isActive ? '#B8935B' : 'rgba(239,68,68,0.4)' }}
                  >
                    {isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button type="button" onClick={handleSaveAll} style={btnEditIcon} title="Save & Edit">
                    <EditIcon />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => deleteLengthRow(l.id)} 
                    style={btnDeleteIcon}
                    title="Delete Row"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 4: HOW TO MEASURE GUIDELINES & DIAGRAM ───────────────── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#B8935B' }}>How To Measure Guidelines</h3>
          <button onClick={handleSaveAll} style={btnPrimary}>Save Section</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={lStyle}>Measurement Advice Text</label>
            <textarea rows="2" value={guideHeader.howto_subtitle} onChange={e => setGuideHeader({ ...guideHeader, howto_subtitle: e.target.value })} style={{ ...iStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={lStyle}>Pro Tip / Heels Advice</label>
            <textarea rows="2" value={guideHeader.howto_tip} onChange={e => setGuideHeader({ ...guideHeader, howto_tip: e.target.value })} style={{ ...iStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={lStyle}>Illustration / Diagram Image URL</label>
            <input value={guideHeader.howto_image} onChange={e => setGuideHeader({ ...guideHeader, howto_image: e.target.value })} style={iStyle} />
          </div>
          {guideHeader.howto_image && (
            <div>
              <img src={guideHeader.howto_image} alt="Diagram" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #B8935B' }} />
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lStyle}>Chest Step</label>
              <input value={guideHeader.chest_instructions} onChange={e => setGuideHeader({ ...guideHeader, chest_instructions: e.target.value })} style={iStyle} />
            </div>
            <div>
              <label style={lStyle}>Waist Step</label>
              <input value={guideHeader.waist_instructions} onChange={e => setGuideHeader({ ...guideHeader, waist_instructions: e.target.value })} style={iStyle} />
            </div>
            <div>
              <label style={lStyle}>Hips Step</label>
              <input value={guideHeader.hips_instructions} onChange={e => setGuideHeader({ ...guideHeader, hips_instructions: e.target.value })} style={iStyle} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SizeGuidePage;
