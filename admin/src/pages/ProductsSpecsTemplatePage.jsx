import React, { useState, useEffect } from 'react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

const ProductsSpecsTemplatePage = () => {
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const [specs, setSpecs] = useState([]);
  
  // Expanded State (which spec is currently open in edit mode)
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetch(`${API}/sections/products_specs_template`)
      .then(res => res.json())
      .then(data => {
        if (data && data.metadata) {
          let meta = data.metadata;
          if (typeof meta === 'string') {
            try { meta = JSON.parse(meta); } catch (e) {}
          }
          if (meta.isActive !== undefined) setIsActive(meta.isActive);
          if (meta.specs) {
            const updatedSpecs = meta.specs.map(s => {
              // Convert legacy comma-separated strings to array of objects
              let parsedGarmentTypes = s.garmentTypes;
              if (typeof parsedGarmentTypes === 'string') {
                parsedGarmentTypes = parsedGarmentTypes.split(',').filter(x => x.trim() !== '').map((opt, i) => ({ id: 'g-' + Date.now() + i, name: opt.trim(), active: true }));
              } else if (!parsedGarmentTypes) {
                parsedGarmentTypes = [];
              }

              let parsedFabricTypes = s.fabricTypes;
              if (typeof parsedFabricTypes === 'string') {
                parsedFabricTypes = parsedFabricTypes.split(',').filter(x => x.trim() !== '').map((opt, i) => ({ id: 'f-' + Date.now() + i, name: opt.trim(), active: true }));
              } else if (!parsedFabricTypes) {
                parsedFabricTypes = [];
              }

              return {
                ...s,
                active: s.active !== undefined ? s.active : true,
                garmentTypeLabel: s.garmentTypeLabel || 'GARMENT TYPE',
                garmentTypes: parsedGarmentTypes,
                fabricTypeLabel: s.fabricTypeLabel || 'FABRIC TYPE',
                fabricTypes: parsedFabricTypes,
                hasSize: s.hasSize !== undefined ? s.hasSize : true,
                hasColor: s.hasColor !== undefined ? s.hasColor : true,
                hasSizeGuide: s.hasSizeGuide !== undefined ? s.hasSizeGuide : true
              };
            });
            setSpecs(updatedSpecs);
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = () => {
    setSaving(true);
    fetch(`${API}/sections/products_specs_template`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Product Specifications & Customization',
        metadata: { isActive, specs }
      })
    })
      .then(res => res.json())
      .then(() => alert("Saved successfully!"))
      .catch(() => alert("Error saving"))
      .finally(() => setSaving(false));
  };

  const toggleSpec = (id) => {
    setSpecs(specs.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const deleteSpec = (id) => {
    if (window.confirm("Are you sure you want to delete this category completely?")) {
      setSpecs(specs.filter(s => s.id !== id));
    }
  };

  const updateSpecField = (specId, field, value) => {
    setSpecs(specs.map(s => s.id === specId ? { ...s, [field]: value } : s));
  };

  const addNewSpec = () => {
    const newId = 'cat-' + Date.now();
    const newSpec = {
      id: newId,
      name: 'NEW CATEGORY',
      active: true,
      garmentTypeLabel: 'GARMENT TYPE',
      garmentTypes: [{ id: 'g-' + Date.now(), name: 'Option 1', active: true }],
      fabricTypeLabel: 'FABRIC TYPE',
      fabricTypes: [{ id: 'f-' + Date.now(), name: 'Option 1', active: true }],
      hasSize: true,
      hasColor: true,
      hasSizeGuide: true
    };
    setSpecs([...specs, newSpec]);
    setExpandedId(newId);
  };

  // --- Sub-Item Managers ---
  const addSubItem = (specId, listType) => {
    setSpecs(specs.map(s => {
      if (s.id === specId) {
        return {
          ...s,
          [listType]: [...s[listType], { id: listType.charAt(0) + '-' + Date.now(), name: 'New Option', active: true }]
        };
      }
      return s;
    }));
  };

  const updateSubItemName = (specId, listType, itemId, newName) => {
    setSpecs(specs.map(s => {
      if (s.id === specId) {
        return {
          ...s,
          [listType]: s[listType].map(item => item.id === itemId ? { ...item, name: newName } : item)
        };
      }
      return s;
    }));
  };

  const toggleSubItem = (specId, listType, itemId) => {
    setSpecs(specs.map(s => {
      if (s.id === specId) {
        return {
          ...s,
          [listType]: s[listType].map(item => item.id === itemId ? { ...item, active: !item.active } : item)
        };
      }
      return s;
    }));
  };

  const deleteSubItem = (specId, listType, itemId) => {
    setSpecs(specs.map(s => {
      if (s.id === specId) {
        return {
          ...s,
          [listType]: s[listType].filter(item => item.id !== itemId)
        };
      }
      return s;
    }));
  };

  const cardStyle = { backgroundColor: '#222C1A', borderRadius: '16px', padding: '24px', border: '1px solid rgba(184,147,91,0.3)' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #7d8b6b', backgroundColor: '#182012', color: '#F6F1E3', marginTop: '6px' };
  const subInputStyle = { width: '200px', padding: '6px 10px', borderRadius: '4px', border: '1px solid #7d8b6b', backgroundColor: '#2a3621', color: '#F6F1E3' };
  const labelStyle = { fontSize: '12px', color: '#B8935B', fontWeight: 'bold', marginBottom: '10px', display: 'block', letterSpacing: '1px' };
  const btnStyle = { padding: '6px 12px', borderRadius: '6px', border: '1px solid #7d8b6b', backgroundColor: '#4a5542', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '50px' }}>
      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>Category Specifications & Customization</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>Manage the accordion attributes displayed on the product detail page.</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{ padding: '9px 18px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <label style={{ fontSize: '14px', color: '#F6F1E3', fontWeight: 'bold' }}>Master Switch: Accordions on Product Pages</label>
            <button 
              onClick={() => setIsActive(!isActive)}
              style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', backgroundColor: isActive ? '#3E4930' : '#4a4a4a', color: '#F6F1E3', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {isActive ? 'ENABLED (ON)' : 'DISABLED (OFF)'}
            </button>
          </div>
          <button onClick={addNewSpec} style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#B8935B', color: '#1A2010', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            + Add New Category
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {specs.map(spec => (
            <div key={spec.id} style={{ padding: '0', backgroundColor: '#182012', borderRadius: '8px', border: `1px solid ${expandedId === spec.id ? '#B8935B' : 'rgba(184,147,91,0.3)'}`, color: '#F6F1E3', overflow: 'hidden' }}>
              
              {/* Header Bar */}
              <div 
                style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: spec.active ? 1 : 0.6, cursor: 'pointer', backgroundColor: expandedId === spec.id ? '#202A18' : 'transparent' }}
                onClick={() => setExpandedId(expandedId === spec.id ? null : spec.id)}
              >
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{spec.name}</div>
                  <div style={{ fontSize: '12px', color: '#E7D9C9', marginTop: '6px' }}>
                    {spec.garmentTypes?.filter(g=>g.active).length || 0} Garments | {spec.fabricTypes?.filter(f=>f.active).length || 0} Fabrics
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => toggleSpec(spec.id)} style={btnStyle}>
                    {spec.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => setExpandedId(expandedId === spec.id ? null : spec.id)} style={btnStyle}>
                    {expandedId === spec.id ? 'Close' : 'Edit Options'}
                  </button>
                  <button onClick={() => deleteSpec(spec.id)} style={{ ...btnStyle, backgroundColor: '#5c2b2b', borderColor: '#8c4242' }}>Delete</button>
                </div>
              </div>

              {/* Expanded Builder UI */}
              {expandedId === spec.id && (
                <div style={{ padding: '24px', borderTop: '1px solid rgba(184,147,91,0.2)', backgroundColor: '#1B2414', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Category Name */}
                  <div>
                    <label style={labelStyle}>CATEGORY NAME</label>
                    <input style={inputStyle} value={spec.name} onChange={e => updateSpecField(spec.id, 'name', e.target.value)} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    
                    {/* Garment Types */}
                    <div style={{ backgroundColor: '#222C1A', padding: '16px', borderRadius: '8px', border: '1px solid rgba(184,147,91,0.1)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>DROPDOWN 1 LABEL:</label>
                        <input 
                          style={{ ...subInputStyle, flex: 1 }} 
                          value={spec.garmentTypeLabel || 'GARMENT TYPE'} 
                          onChange={e => updateSpecField(spec.id, 'garmentTypeLabel', e.target.value)} 
                        />
                      </div>
                      <label style={labelStyle}>DROPDOWN 1 OPTIONS</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                        {spec.garmentTypes && spec.garmentTypes.map(gt => (
                          <div key={gt.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: gt.active ? 1 : 0.5 }}>
                            <input 
                              style={subInputStyle} 
                              value={gt.name} 
                              onChange={e => updateSubItemName(spec.id, 'garmentTypes', gt.id, e.target.value)} 
                            />
                            <button onClick={() => toggleSubItem(spec.id, 'garmentTypes', gt.id)} style={{ ...btnStyle, padding: '4px 8px' }}>
                              {gt.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => deleteSubItem(spec.id, 'garmentTypes', gt.id)} style={{ ...btnStyle, padding: '4px 8px', backgroundColor: '#5c2b2b', borderColor: '#8c4242' }}>X</button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => addSubItem(spec.id, 'garmentTypes')} style={{ ...btnStyle, width: '100%' }}>+ Add Option</button>
                    </div>

                    {/* Fabric Types */}
                    <div style={{ backgroundColor: '#222C1A', padding: '16px', borderRadius: '8px', border: '1px solid rgba(184,147,91,0.1)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>DROPDOWN 2 LABEL:</label>
                        <input 
                          style={{ ...subInputStyle, flex: 1 }} 
                          value={spec.fabricTypeLabel || 'FABRIC TYPE'} 
                          onChange={e => updateSpecField(spec.id, 'fabricTypeLabel', e.target.value)} 
                        />
                      </div>
                      <label style={labelStyle}>DROPDOWN 2 OPTIONS</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                        {spec.fabricTypes && spec.fabricTypes.map(ft => (
                          <div key={ft.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: ft.active ? 1 : 0.5 }}>
                            <input 
                              style={subInputStyle} 
                              value={ft.name} 
                              onChange={e => updateSubItemName(spec.id, 'fabricTypes', ft.id, e.target.value)} 
                            />
                            <button onClick={() => toggleSubItem(spec.id, 'fabricTypes', ft.id)} style={{ ...btnStyle, padding: '4px 8px' }}>
                              {ft.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => deleteSubItem(spec.id, 'fabricTypes', ft.id)} style={{ ...btnStyle, padding: '4px 8px', backgroundColor: '#5c2b2b', borderColor: '#8c4242' }}>X</button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => addSubItem(spec.id, 'fabricTypes')} style={{ ...btnStyle, width: '100%' }}>+ Add Option</button>
                    </div>
                  </div>

                  {/* Settings Toggle Row */}
                  <div style={{ backgroundColor: '#222C1A', padding: '16px', borderRadius: '8px', border: '1px solid rgba(184,147,91,0.1)' }}>
                    <label style={labelStyle}>LAYOUT CONTROLS</label>
                    <div style={{ display: 'flex', gap: '30px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" checked={spec.hasColor !== false} onChange={e => updateSpecField(spec.id, 'hasColor', e.target.checked)} style={{ width: '18px', height: '18px' }} />
                        <label style={{ fontSize: '13px' }}>Show Colour Selector</label>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" checked={spec.hasSize !== false} onChange={e => updateSpecField(spec.id, 'hasSize', e.target.checked)} style={{ width: '18px', height: '18px' }} />
                        <label style={{ fontSize: '13px' }}>Show Size Selector</label>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" checked={spec.hasSizeGuide !== false} onChange={e => updateSpecField(spec.id, 'hasSizeGuide', e.target.checked)} style={{ width: '18px', height: '18px' }} />
                        <label style={{ fontSize: '13px' }}>Show Size Guide Link</label>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          ))}
          {specs.length === 0 && <div style={{ color: '#E7D9C9', textAlign: 'center', padding: '20px' }}>No categories found. Click "Add New Category" to create one.</div>}
        </div>
      </div>
    </div>
  );
};

export default ProductsSpecsTemplatePage;
