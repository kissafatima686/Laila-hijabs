import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:5000/api/admin';

const iStyle = { width: '100%', padding: '9px 12px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const cardStyle = { backgroundColor: '#222C1A', borderRadius: '16px', padding: '24px', border: '1px solid rgba(184,147,91,0.3)' };
const btnPrimary = { padding: '9px 18px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };

// Exact 3-button style rules matching screenshot
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

const DEFAULT_FABRICS = [
  { id: 'f1', name: 'Nida Crepe', status: 'Active' },
  { id: 'f2', name: 'Chiffon', status: 'Active' },
  { id: 'f3', name: 'Linen Blend', status: 'Active' },
  { id: 'f4', name: 'Silk Satin', status: 'Active' }
];

const DEFAULT_SIZES = [
  { id: 's1', name: 'XS', status: 'Active' },
  { id: 's2', name: 'S', status: 'Active' },
  { id: 's3', name: 'M', status: 'Active' },
  { id: 's4', name: 'L', status: 'Active' },
  { id: 's5', name: 'XL', status: 'Active' },
  { id: 's6', name: 'XXL', status: 'Active' }
];

const DEFAULT_COLORS = [
  { id: 'c1', name: 'Olive', hex_color: '#556B2F', status: 'Active' },
  { id: 'c2', name: 'Black', hex_color: '#000000', status: 'Active' },
  { id: 'c3', name: 'Ivory', hex_color: '#FFFFF0', status: 'Active' },
  { id: 'c4', name: 'Dusty Rose', hex_color: '#DCAE96', status: 'Active' }
];

const DEFAULT_PRICES = [
  { id: 'p1', name: 'Rs. 3,000 – 5,000', min_price: '3000', max_price: '5000', status: 'Active' },
  { id: 'p2', name: 'Rs. 5,000 – 8,000', min_price: '5000', max_price: '8000', status: 'Active' },
  { id: 'p3', name: 'Rs. 8,000+', min_price: '8000', max_price: '', status: 'Active' }
];

const ProductFiltersManagerPage = ({ activeTab: initialTab = 'all' }) => {
  const [fabrics, setFabrics] = useState(DEFAULT_FABRICS);
  const [sizes, setSizes] = useState(DEFAULT_SIZES);
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [priceRanges, setPriceRanges] = useState(DEFAULT_PRICES);
  const [saving, setSaving] = useState(false);
  const [currentTab, setCurrentTab] = useState(initialTab);

  useEffect(() => {
    setCurrentTab(initialTab);
  }, [initialTab]);

  const fetch_ = () => {
    fetch(`${API}/sections/products_filters_config`)
      .then(r => r.json())
      .then(d => {
        if (d && d.metadata) {
          let m = {};
          try { m = typeof d.metadata === 'string' ? JSON.parse(d.metadata) : d.metadata; } catch(e) {}
          if (Array.isArray(m.fabrics) && m.fabrics.length > 0) setFabrics(m.fabrics);
          if (Array.isArray(m.sizes) && m.sizes.length > 0) setSizes(m.sizes);
          if (Array.isArray(m.colors) && m.colors.length > 0) setColors(m.colors);
          if (Array.isArray(m.priceRanges) && m.priceRanges.length > 0) setPriceRanges(m.priceRanges);
        }
      })
      .catch(() => {});
  };

  useEffect(() => { fetch_(); }, []);

  const handleSaveAll = () => {
    setSaving(true);
    const meta = { fabrics, sizes, colors, priceRanges };

    fetch(`${API}/sections/products_filters_config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Color & Filter Options',
        metadata: meta
      })
    })
      .then(() => alert('Color, Size, Fabric & Filter options saved successfully!'))
      .catch(() => alert('Error saving filter options.'))
      .finally(() => setSaving(false));
  };

  // Fabric CRUD
  const addFabric = () => setFabrics(prev => [...prev, { id: `f_${Date.now()}`, name: 'New Fabric', status: 'Active' }]);
  const deleteFabric = (id) => setFabrics(prev => prev.filter(f => f.id !== id));
  const toggleFabricStatus = (id) => setFabrics(prev => prev.map(f => f.id === id ? { ...f, status: (f.status === 'Active' || f.status === 'Live') ? 'Inactive' : 'Active' } : f));

  // Size CRUD
  const addSize = () => setSizes(prev => [...prev, { id: `s_${Date.now()}`, name: '3XL', status: 'Active' }]);
  const deleteSize = (id) => setSizes(prev => prev.filter(s => s.id !== id));
  const toggleSizeStatus = (id) => setSizes(prev => prev.map(s => s.id === id ? { ...s, status: (s.status === 'Active' || s.status === 'Live') ? 'Inactive' : 'Active' } : s));

  // Color CRUD
  const addColor = () => setColors(prev => [...prev, { id: `c_${Date.now()}`, name: 'Gold / Beige', hex_color: '#D4AF37', status: 'Active' }]);
  const deleteColor = (id) => setColors(prev => prev.filter(c => c.id !== id));
  const toggleColorStatus = (id) => setColors(prev => prev.map(c => c.id === id ? { ...c, status: (c.status === 'Active' || c.status === 'Live') ? 'Inactive' : 'Active' } : c));

  // Price CRUD
  const addPriceRange = () => setPriceRanges(prev => [...prev, { id: `p_${Date.now()}`, name: 'Rs. 10,000+', min_price: '10000', max_price: '', status: 'Active' }]);
  const deletePriceRange = (id) => setPriceRanges(prev => prev.filter(p => p.id !== id));
  const togglePriceStatus = (id) => setPriceRanges(prev => prev.map(p => p.id === id ? { ...p, status: (p.status === 'Active' || p.status === 'Live') ? 'Inactive' : 'Active' } : p));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '50px' }}>
      
      {/* ── Banner Header ─────────────────────────────────────────────────── */}
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
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '6px' }}>PRODUCTS & CATALOG</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>Color & Filter Options Manager</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>Configure dynamic sidebar filters (Fabric, Size, Color, Price) and Product Page Swatches.</p>
        </div>
        <button onClick={handleSaveAll} disabled={saving} style={{ ...btnPrimary, boxShadow: '0 4px 14px rgba(184, 147, 91, 0.4)' }}>
          {saving ? 'Saving...' : 'Save All Filter Options'}
        </button>
      </div>

      {/* ── Filter Category Tab Navigation Bar ──────────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'All Filter Sections' },
          { key: 'fabrics', label: 'Fabric Options' },
          { key: 'sizes', label: 'Size Options' },
          { key: 'colors', label: 'Color Options & Swatches' },
          { key: 'prices', label: 'Price Range Options' }
        ].map(t => {
          const isSelected = currentTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setCurrentTab(t.key)}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                backgroundColor: isSelected ? '#B8935B' : '#182012',
                color: isSelected ? '#1A2010' : '#F6F1E3',
                border: isSelected ? '1px solid #B8935B' : '1px solid rgba(184,147,91,0.3)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── 1. FABRIC OPTIONS ─────────────────────────────────────────────── */}
      {(currentTab === 'all' || currentTab === 'fabrics') && (
      <div>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#B8935B', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              FABRIC
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={addFabric} style={btnStatus}>+ Add Fabric</button>
              <button onClick={handleSaveAll} style={btnPrimary}>Save Section</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '8px' }}>
            {fabrics.map((f) => {
              const isActive = f.status === 'Active';
              return (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Checkbox preview matching screenshot */}
                  <input type="checkbox" checked={isActive} onChange={() => toggleFabricStatus(f.id)} style={{ width: '16px', height: '16px', accentColor: '#B8935B', cursor: 'pointer' }} />
                  
                  <input 
                    value={f.name} 
                    onChange={e => setFabrics(prev => prev.map(item => item.id === f.id ? { ...item, name: e.target.value } : item))} 
                    style={{ ...iStyle, maxWidth: '300px', fontWeight: '500', color: isActive ? '#F6F1E3' : '#888' }} 
                  />

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      type="button" 
                      onClick={() => toggleFabricStatus(f.id)} 
                      style={{ ...btnStatus, height: '32px', padding: '0 10px', fontSize: '11px', backgroundColor: isActive ? '#182012' : 'rgba(239,68,68,0.15)', color: isActive ? '#F6F1E3' : '#EF4444', borderColor: isActive ? '#B8935B' : 'rgba(239,68,68,0.4)' }}
                    >
                      {isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button type="button" onClick={handleSaveAll} style={{ ...btnEditIcon, height: '32px', width: '32px' }} title="Save & Edit">
                      <EditIcon />
                    </button>
                    <button type="button" onClick={() => deleteFabric(f.id)} style={{ ...btnDeleteIcon, height: '32px', width: '32px' }} title="Delete Fabric">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* ── 2. SIZE OPTIONS ───────────────────────────────────────────────── */}
      {(currentTab === 'all' || currentTab === 'sizes') && (
      <div style={{ marginTop: '12px' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#B8935B', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                SIZE
              </h3>
              <Link to="/size-guide" style={{ fontSize: '11px', fontWeight: '700', color: '#B8935B', textDecoration: 'none', letterSpacing: '1px' }}>SIZE GUIDE</Link>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={addSize} style={btnStatus}>+ Add Size</button>
              <button onClick={handleSaveAll} style={btnPrimary}>Save Section</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '8px' }}>
            {sizes.map((s) => {
              const isActive = s.status === 'Active';
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <input type="checkbox" checked={isActive} onChange={() => toggleSizeStatus(s.id)} style={{ width: '16px', height: '16px', accentColor: '#B8935B', cursor: 'pointer' }} />
                  
                  <input 
                    value={s.name} 
                    onChange={e => setSizes(prev => prev.map(item => item.id === s.id ? { ...item, name: e.target.value } : item))} 
                    style={{ ...iStyle, maxWidth: '300px', fontWeight: '500', color: isActive ? '#F6F1E3' : '#888' }} 
                  />

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      type="button" 
                      onClick={() => toggleSizeStatus(s.id)} 
                      style={{ ...btnStatus, height: '32px', padding: '0 10px', fontSize: '11px', backgroundColor: isActive ? '#182012' : 'rgba(239,68,68,0.15)', color: isActive ? '#F6F1E3' : '#EF4444', borderColor: isActive ? '#B8935B' : 'rgba(239,68,68,0.4)' }}
                    >
                      {isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button type="button" onClick={handleSaveAll} style={{ ...btnEditIcon, height: '32px', width: '32px' }} title="Save & Edit">
                      <EditIcon />
                    </button>
                    <button type="button" onClick={() => deleteSize(s.id)} style={{ ...btnDeleteIcon, height: '32px', width: '32px' }} title="Delete Size">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* ── 3. COLOR OPTIONS & SWATCHES ───────────────────────────────────── */}
      {(currentTab === 'all' || currentTab === 'colors') && (
      <div style={{ marginTop: '12px' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#B8935B', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              COLOR
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={addColor} style={btnStatus}>+ Add Color Swatch</button>
              <button onClick={handleSaveAll} style={btnPrimary}>Save Section</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '8px' }}>
            {colors.map((c) => {
              const isActive = c.status === 'Active';
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <input type="checkbox" checked={isActive} onChange={() => toggleColorStatus(c.id)} style={{ width: '16px', height: '16px', accentColor: '#B8935B', cursor: 'pointer' }} />
                  
                  {/* Swatch circle */}
                  <div style={{ position: 'relative', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: c.hex_color || '#B8935B', border: '1.5px solid #F6F1E3', flexShrink: 0 }}>
                    <input 
                      type="color" 
                      value={c.hex_color || '#B8935B'} 
                      onChange={e => setColors(prev => prev.map(item => item.id === c.id ? { ...item, hex_color: e.target.value } : item))}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
                    />
                  </div>

                  <input 
                    value={c.name} 
                    onChange={e => setColors(prev => prev.map(item => item.id === c.id ? { ...item, name: e.target.value } : item))} 
                    style={{ ...iStyle, maxWidth: '300px', fontWeight: '500', color: isActive ? '#F6F1E3' : '#888' }} 
                  />

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      type="button" 
                      onClick={() => toggleColorStatus(c.id)} 
                      style={{ ...btnStatus, height: '32px', padding: '0 10px', fontSize: '11px', backgroundColor: isActive ? '#182012' : 'rgba(239,68,68,0.15)', color: isActive ? '#F6F1E3' : '#EF4444', borderColor: isActive ? '#B8935B' : 'rgba(239,68,68,0.4)' }}
                    >
                      {isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button type="button" onClick={handleSaveAll} style={{ ...btnEditIcon, height: '32px', width: '32px' }} title="Save & Edit">
                      <EditIcon />
                    </button>
                    <button type="button" onClick={() => deleteColor(c.id)} style={{ ...btnDeleteIcon, height: '32px', width: '32px' }} title="Delete Color">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* ── 4. PRICE RANGE OPTIONS ────────────────────────────────────────── */}
      {(currentTab === 'all' || currentTab === 'prices') && (
      <div style={{ marginTop: '12px' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#B8935B', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              PRICE
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={addPriceRange} style={btnStatus}>+ Add Price Range</button>
              <button onClick={handleSaveAll} style={btnPrimary}>Save Section</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '8px' }}>
            {priceRanges.map((p) => {
              const isActive = p.status === 'Active';
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <input type="checkbox" checked={isActive} onChange={() => togglePriceStatus(p.id)} style={{ width: '16px', height: '16px', accentColor: '#B8935B', cursor: 'pointer' }} />
                  
                  <input 
                    value={p.name} 
                    onChange={e => setPriceRanges(prev => prev.map(item => item.id === p.id ? { ...item, name: e.target.value } : item))} 
                    style={{ ...iStyle, maxWidth: '300px', fontWeight: '500', color: isActive ? '#F6F1E3' : '#888' }} 
                  />

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      type="button" 
                      onClick={() => togglePriceStatus(p.id)} 
                      style={{ ...btnStatus, height: '32px', padding: '0 10px', fontSize: '11px', backgroundColor: isActive ? '#182012' : 'rgba(239,68,68,0.15)', color: isActive ? '#F6F1E3' : '#EF4444', borderColor: isActive ? '#B8935B' : 'rgba(239,68,68,0.4)' }}
                    >
                      {isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button type="button" onClick={handleSaveAll} style={{ ...btnEditIcon, height: '32px', width: '32px' }} title="Save & Edit">
                      <EditIcon />
                    </button>
                    <button type="button" onClick={() => deletePriceRange(p.id)} style={{ ...btnDeleteIcon, height: '32px', width: '32px' }} title="Delete Range">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

    </div>
  );
};

export default ProductFiltersManagerPage;
