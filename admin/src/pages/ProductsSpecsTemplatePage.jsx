import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api/admin';

const ProductsSpecsTemplatePage = () => {
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const [specs, setSpecs] = useState([
    { id: 1, name: 'FOR ABAYA' },
    { id: 2, name: 'FOR SCARF / HIJAB' },
    { id: 3, name: 'FOR CO-ORD SET' },
    { id: 4, name: 'FOR IRANI CHADAR' },
    { id: 5, name: 'FOR JILBAB' },
    { id: 6, name: 'FOR NAMAZ CHADAR' },
    { id: 7, name: 'FOR ROUND CHADAR' }
  ]);

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
          if (meta.specs) setSpecs(meta.specs);
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

  const cardStyle = { backgroundColor: '#222C1A', borderRadius: '16px', padding: '24px', border: '1px solid rgba(184,147,91,0.3)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '50px' }}>
      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>Category Specifications & Customization</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>Manage the accordion attributes displayed on the product detail page.</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{ padding: '9px 18px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
          {saving ? 'Saving...' : 'Save Attributes'}
        </button>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <label style={{ fontSize: '14px', color: '#F6F1E3', fontWeight: 'bold' }}>Enable Category Specifications Accordion on Product Pages</label>
          <button 
            onClick={() => setIsActive(!isActive)}
            style={{ 
              padding: '6px 14px', 
              borderRadius: '20px', 
              border: 'none', 
              backgroundColor: isActive ? '#3E4930' : '#4a4a4a', 
              color: '#F6F1E3', 
              fontWeight: 'bold', 
              cursor: 'pointer' 
            }}
          >
            {isActive ? 'ENABLED (ON)' : 'DISABLED (OFF)'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {specs.map(spec => (
            <div key={spec.id} style={{ padding: '16px', backgroundColor: '#182012', borderRadius: '8px', border: '1px solid rgba(184,147,91,0.3)', display: 'flex', justifyContent: 'space-between', color: '#F6F1E3', fontWeight: 'bold' }}>
              <span>{spec.name}</span>
              <span>v</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsSpecsTemplatePage;
