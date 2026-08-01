import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

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

const btnP = {
  padding: '10px 20px',
  borderRadius: '8px',
  backgroundColor: '#B8935B',
  border: 'none',
  color: '#1A2010',
  fontSize: '14px',
  fontWeight: '700',
  cursor: 'pointer'
};

const btnS = {
  padding: '8px 16px',
  borderRadius: '6px',
  backgroundColor: 'transparent',
  border: '1px solid #B8935B',
  color: '#B8935B',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer'
};

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [activeTab, setActiveTab] = useState('general');

  // Master Data
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [allSpecs, setAllSpecs] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    compare_at_price: '',
    stock: 0,
    category_id: '',
    status: 'Live',
    short_description: '',
    long_description: '',
    care_instructions: '',
    fabric_details: '',
    is_featured: 0,
    is_new_arrival: 0,
    seo_title: '',
    meta_description: '',
    keywords: '',
    gallery: [],
    variants: [],
    sizes: [],
    specifications: [],
    display_sections: []
  });

  useEffect(() => {
    // Fetch Master Data
    const fetchMaster = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('adminToken')}` };
        const [catRes, colorRes, sizeRes, specRes] = await Promise.all([
          fetch(`${API_BASE}/module/categories`, { headers }).then(r => r.json()),
          fetch(`${API_BASE}/module/colors`, { headers }).then(r => r.json()),
          fetch(`${API_BASE}/module/sizes`, { headers }).then(r => r.json()),
          fetch(`${API_BASE}/module/specifications`, { headers }).then(r => r.json())
        ]);
        setCategories(Array.isArray(catRes) ? catRes : []);
        setColors(Array.isArray(colorRes) ? colorRes : []);
        setSizes(Array.isArray(sizeRes) ? sizeRes : []);
        setAllSpecs(Array.isArray(specRes) ? specRes : []);
      } catch (err) {
        console.error("Failed to fetch master data", err);
      }
    };

    fetchMaster();

    if (!isNew) {
      fetch(`${API_BASE}/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      })
      .then(res => res.json())
      .then(data => {
        setFormData({
          ...data,
          gallery: data.gallery || [],
          variants: data.variants || [],
          sizes: data.sizes || [],
          specifications: data.specifications || []
        });
        setLoading(false);
      })
      .catch(err => console.error("Error fetching product", err));
    }
  }, [id, isNew]);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? `${API_BASE}/products` : `${API_BASE}/products/${id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Product saved successfully!');
        navigate('/products');
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Failed to save product');
    }
  };

  const addGalleryItem = () => {
    setFormData({ ...formData, gallery: [...formData.gallery, { image_url: '', media_type: 'image', is_featured: 0 }] });
  };

  const removeGalleryItem = (index) => {
    const newG = [...formData.gallery];
    newG.splice(index, 1);
    setFormData({ ...formData, gallery: newG });
  };

  const toggleSize = (sizeId) => {
    const current = [...formData.sizes];
    const idx = current.indexOf(sizeId);
    if (idx > -1) current.splice(idx, 1);
    else current.push(sizeId);
    setFormData({ ...formData, sizes: current });
  };

  if (loading) return <div style={{ color: '#F6F1E3', padding: '40px' }}>Loading product details...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#F6F1E3', margin: 0 }}>{isNew ? 'Create New Product' : 'Edit Product: ' + formData.name}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
           <button onClick={() => navigate('/products')} style={btnS}>Cancel</button>
           <button onClick={handleSave} style={btnP}>Save Product</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '20px', borderBottom: '1px solid rgba(184,147,91,0.3)' }}>
        {['general', 'description', 'media', 'variants', 'attributes', 'seo'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === t ? '#3E4930' : 'transparent',
              border: 'none',
              color: activeTab === t ? '#B8935B' : '#F6F1E3',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontSize: '12px',
              fontWeight: '700',
              borderRadius: '8px 8px 0 0'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        {activeTab === 'general' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={lStyle}>Product Name *</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={iStyle} required />
            </div>
            <div>
              <label style={lStyle}>Slug (Unique Identifier)</label>
              <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} style={iStyle} placeholder="auto-generated if empty" />
            </div>
            <div>
              <label style={lStyle}>Base Price (Rs.) *</label>
              <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={iStyle} required />
            </div>
            <div>
              <label style={lStyle}>Compare At Price (MRP)</label>
              <input type="number" value={formData.compare_at_price || ''} onChange={e => setFormData({...formData, compare_at_price: e.target.value})} style={iStyle} />
            </div>
            <div>
              <label style={lStyle}>Category</label>
              <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} style={iStyle}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={lStyle}>Visibility Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={iStyle}>
                <option value="Live">Live (Visible)</option>
                <option value="Draft">Draft (Hidden)</option>
                <option value="Inactive">Inactive (Hidden)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
               <label style={{ ...lStyle, marginBottom: 0, display: 'inline' }}>
                 <input type="checkbox" checked={formData.is_featured === 1} onChange={e => setFormData({...formData, is_featured: e.target.checked ? 1 : 0})} /> Featured
               </label>
               <label style={{ ...lStyle, marginBottom: 0, display: 'inline' }}>
                 <input type="checkbox" checked={formData.is_new_arrival === 1} onChange={e => setFormData({...formData, is_new_arrival: e.target.checked ? 1 : 0})} /> New Arrival
               </label>
            </div>
          </div>
        )}

        {activeTab === 'description' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={lStyle}>Short Description</label>
              <textarea value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} style={{ ...iStyle, height: '80px' }} />
            </div>
            <div>
              <label style={lStyle}>Long Description / Details</label>
              <textarea value={formData.long_description} onChange={e => setFormData({...formData, long_description: e.target.value})} style={{ ...iStyle, height: '150px' }} />
            </div>
            <div>
              <label style={lStyle}>Fabric Details</label>
              <input type="text" value={formData.fabric_details} onChange={e => setFormData({...formData, fabric_details: e.target.value})} style={iStyle} />
            </div>
            <div>
              <label style={lStyle}>Care Instructions</label>
              <textarea value={formData.care_instructions} onChange={e => setFormData({...formData, care_instructions: e.target.value})} style={{ ...iStyle, height: '80px' }} />
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <button type="button" onClick={addGalleryItem} style={btnS}>+ Add Image</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {formData.gallery.map((img, idx) => (
                <div key={idx} style={{ padding: '15px', border: '1px solid rgba(184,147,91,0.3)', borderRadius: '12px', backgroundColor: '#222C1A' }}>
                  <img src={img.image_url || '/placeholder.png'} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                  <input type="text" value={img.image_url} onChange={e => {
                    const newG = [...formData.gallery];
                    newG[idx].image_url = e.target.value;
                    setFormData({...formData, gallery: newG});
                  }} style={{ ...iStyle, marginBottom: '10px' }} placeholder="Image URL" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '10px', color: '#F6F1E3' }}>
                      <input type="checkbox" checked={img.is_featured === 1} onChange={e => {
                         const newG = formData.gallery.map((g, i) => ({...g, is_featured: i === idx ? 1 : 0}));
                         setFormData({...formData, gallery: newG});
                      }} /> Main
                    </label>
                    <button type="button" onClick={() => removeGalleryItem(idx)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px' }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'variants' && (
          <div>
            <p style={{ color: '#E7D9C9', fontSize: '13px' }}>Define color variants and their specific stock levels.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
               {colors.map(color => {
                 const variant = formData.variants.find(v => v.color_id === color.color_id);
                 return (
                   <div key={color.color_id} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '10px', borderBottom: '1px solid rgba(184,147,91,0.1)' }}>
                     <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: color.hex_code, border: '1px solid #B8935B' }} />
                     <div style={{ width: '100px', color: '#F6F1E3', fontSize: '13px' }}>{color.name}</div>
                     <input
                       type="number"
                       placeholder="Stock"
                       value={variant ? variant.stock_quantity : ''}
                       onChange={e => {
                         const val = parseInt(e.target.value) || 0;
                         let newV = [...formData.variants];
                         const idx = newV.findIndex(v => v.color_id === color.color_id);
                         if (idx > -1) {
                           if (val === 0 && e.target.value === '') newV.splice(idx, 1);
                           else newV[idx].stock_quantity = val;
                         } else {
                           newV.push({ color_id: color.color_id, stock_quantity: val, sku: `${formData.sku || 'PROD'}-${color.name.substring(0,3).toUpperCase()}` });
                         }
                         setFormData({...formData, variants: newV});
                       }}
                       style={{ ...iStyle, width: '80px' }}
                     />
                     <input
                       type="text"
                       placeholder="SKU"
                       value={variant ? variant.sku : ''}
                       onChange={e => {
                          let newV = [...formData.variants];
                          const idx = newV.findIndex(v => v.color_id === color.color_id);
                          if (idx > -1) newV[idx].sku = e.target.value;
                          setFormData({...formData, variants: newV});
                       }}
                       style={{ ...iStyle, width: '150px' }}
                     />
                   </div>
                 );
               })}
            </div>
          </div>
        )}

        {activeTab === 'attributes' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
              <label style={lStyle}>Available Sizes</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {sizes.map(s => (
                  <label key={s.size_id} style={{ color: '#F6F1E3', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" checked={formData.sizes.includes(s.size_id)} onChange={() => toggleSize(s.size_id)} /> {s.size_name}
                  </label>
                ))}
              </div>
            </div>
            <div>
               <label style={lStyle}>Specifications</label>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {allSpecs.map(spec => {
                    const sValue = formData.specifications.find(s => s.spec_id === spec.spec_id);
                    return (
                      <div key={spec.spec_id}>
                        <label style={{ color: '#B8935B', fontSize: '10px' }}>{spec.spec_name}</label>
                        <input type="text" value={sValue ? sValue.value : ''} onChange={e => {
                           let newS = [...formData.specifications];
                           const idx = newS.findIndex(s => s.spec_id === spec.spec_id);
                           if (idx > -1) {
                             if (e.target.value === '') newS.splice(idx, 1);
                             else newS[idx].value = e.target.value;
                           } else {
                             newS.push({ spec_id: spec.spec_id, value: e.target.value });
                           }
                           setFormData({...formData, specifications: newS});
                        }} style={iStyle} />
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={lStyle}>SEO Title</label>
              <input type="text" value={formData.seo_title} onChange={e => setFormData({...formData, seo_title: e.target.value})} style={iStyle} />
            </div>
            <div>
              <label style={lStyle}>Meta Description</label>
              <textarea value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})} style={{ ...iStyle, height: '80px' }} />
            </div>
            <div>
              <label style={lStyle}>Keywords (comma separated)</label>
              <input type="text" value={formData.keywords} onChange={e => setFormData({...formData, keywords: e.target.value})} style={iStyle} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
