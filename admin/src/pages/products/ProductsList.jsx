import React, { useState, useEffect } from 'react';

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

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    compare_at_price: '',
    stock_quantity: 20,
    category_id: 2,
    image_url: '/hero2.png',
    fabric_type: 'Premium Nida',
    color: 'Black',
    badge: 'NEW IN',
    fit_type: 'Regular Fit',
    description: '',
    is_featured: 1,
    status: 'Active'
  });

  const fetchProducts = () => {
    setLoading(true);
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddProduct = () => {
    setEditProduct(null);
    setFormData({
      name: '',
      price: '',
      compare_at_price: '',
      stock_quantity: 20,
      category_id: 2,
      image_url: '/hero2.png',
      gallery_images: '/hero2.png, /hero1.png, /abaya1.png',
      fabric_type: 'Premium Nida',
      color: 'Black, Olive, Ivory, Dusty Rose',
      available_sizes: 'XS, S, M, L, XL, XXL',
      size_guide_key: 'products_size_guide',
      badge: 'NEW IN',
      fit_type: 'Saudi Flared Fit',
      description: '',
      is_featured: 1,
      status: 'Active'
    });
    setShowModal(true);
  };

  const openEditProduct = (prod) => {
    setEditProduct(prod);
    setFormData({
      name: prod.name || '',
      price: prod.price || '',
      compare_at_price: prod.compare_at_price || '',
      stock_quantity: prod.stock_quantity ?? 20,
      category_id: prod.category_id || 2,
      image_url: prod.image_url || '/hero2.png',
      gallery_images: prod.gallery_images || prod.image_url || '/hero2.png, /hero1.png, /abaya1.png',
      fabric_type: prod.fabric_type || 'Premium Nida',
      color: prod.color || 'Black, Olive, Ivory, Dusty Rose',
      available_sizes: prod.available_sizes || 'XS, S, M, L, XL, XXL',
      size_guide_key: prod.size_guide_key || 'products_size_guide',
      badge: prod.badge || 'NEW IN',
      fit_type: prod.fit_type || 'Regular Fit',
      description: prod.description || '',
      is_featured: prod.is_featured ?? 1,
      status: prod.status || 'Active'
    });
    setShowModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const productId = editProduct ? (editProduct.product_id || editProduct.id) : null;
    const url = editProduct ? `${API}/products/${productId}` : `${API}/products`;
    const method = editProduct ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(() => {
        setShowModal(false);
        fetchProducts();
      })
      .catch(err => console.error("Error saving product:", err));
  };

  const handleToggleStatus = (p) => {
    const productId = p.product_id || p.id;
    const nextStatus = (p.status === 'Active' || p.status === 'Live') ? 'Inactive' : 'Active';
    fetch(`${API}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}`
      },
      body: JSON.stringify({ ...p, status: nextStatus })
    }).then(fetchProducts);
  };

  const handleDeleteProduct = (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    fetch(`${API}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}` }
    })
      .then(() => fetchProducts())
      .catch(err => console.error("Error deleting product:", err));
  };

  const filteredProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (p.fabric_type || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '50px' }}>
      
      {/* Header Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)',
        borderRadius: '16px',
        padding: '24px 32px',
        border: '1px solid #B8935B',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '5px' }}>
            INVENTORY MANAGEMENT
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#F6F1E3', margin: '0 0 6px 0' }}>
            Products Inventory Manager
          </h2>
          <p style={{ fontSize: '13px', color: '#E7D9C9', margin: 0 }}>
            Manage product items, stock levels, pricing, badges, and activate/deactivate status.
          </p>
        </div>

        <button
          onClick={openAddProduct}
          style={{ ...btnP, boxShadow: '0 4px 14px rgba(184, 147, 91, 0.4)' }}
        >
          + Add New Product
        </button>
      </div>

      {/* Controls Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search products by title or fabric..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...iStyle, width: '320px' }}
        />
        <button onClick={openAddProduct} style={btnP}>+ Add Product</button>
      </div>

      {/* Products Table */}
      <div style={{
        backgroundColor: '#222C1A',
        borderRadius: '16px',
        border: '1px solid rgba(184, 147, 91, 0.3)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#E7D9C9' }}>Loading product inventory...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#B8A99A' }}>No products found. Click "+ Add New Product" to add items!</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(184, 147, 91, 0.3)', backgroundColor: '#182012' }}>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>PRODUCT ITEM</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>PRICE</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>STOCK</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>BADGE</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => {
                const isActive = (p.status === 'Active' || p.status === 'Live' || p.status === undefined);
                return (
                  <tr key={p.product_id || p.id} style={{ borderBottom: '1px solid rgba(184, 147, 91, 0.15)' }}>
                    <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={p.image_url || '/hero2.png'} 
                        alt={p.name}
                        style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #B8935B' }} 
                      />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#F6F1E3' }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: '#E7D9C9' }}>{p.fabric_type || 'Premium Nida'}</div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700', color: '#B8935B' }}>
                      Rs. {parseFloat(p.price || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#E7D9C9' }}>
                      {p.stock_quantity ?? 20} units
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '8px',
                        backgroundColor: '#3E4930',
                        color: '#B8935B',
                        border: '1px solid #B8935B'
                      }}>
                        {p.badge || 'NEW IN'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p)}
                          style={{
                            ...btnG,
                            height: '35px',
                            padding: '0 14px',
                            fontWeight: '600',
                            backgroundColor: isActive ? '#3E4930' : 'rgba(239,68,68,0.15)',
                            color: isActive ? '#F6F1E3' : '#EF4444',
                            borderColor: isActive ? '#B8935B' : 'rgba(239,68,68,0.4)'
                          }}
                        >
                          {isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditProduct(p)}
                          style={{ ...btnG, height: '35px', width: '35px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Edit Product"
                        >
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.product_id || p.id)}
                          style={{ ...btnD, height: '35px', width: '35px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Delete Product"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#222C1A',
            borderRadius: '16px',
            padding: '28px',
            width: '90%', maxWidth: '540px',
            border: '1px solid #B8935B',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>INVENTORY MANAGER</div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#F6F1E3' }}>
                  {editProduct ? 'Edit Product Item' : 'Add New Product'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer' }}><CloseIcon /></button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={lStyle}>Product Title *</label>
                <input
                  type="text" required placeholder="e.g. Royal Silk Hijab"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  style={iStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>Price (Rs.) *</label>
                  <input type="number" min="0" required placeholder="e.g. 2999"
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                    style={iStyle}
                  />
                </div>
                <div>
                  <label style={lStyle}>Stock Quantity</label>
                  <input type="number" min="0" placeholder="20"
                    value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})}
                    style={iStyle}
                  />
                </div>
              </div>

              <div>
                <label style={lStyle}>Image URL *</label>
                <input
                  type="text" required placeholder="e.g. /hero2.png or https://..."
                  value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})}
                  style={iStyle}
                />
                {formData.image_url && (
                  <div style={{ marginTop: '8px' }}>
                    <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '110px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #B8935B' }} />
                  </div>
                )}
              </div>

              {/* Product Gallery Images with live thumbnails */}
              <div>
                <label style={lStyle}>Product Gallery Images (comma separated URLs) *</label>
                <textarea
                  rows="2"
                  placeholder="e.g. /hero2.png, /hero1.png, /abaya1.png"
                  value={formData.gallery_images || formData.image_url || ''} 
                  onChange={e => setFormData({...formData, gallery_images: e.target.value, image_url: e.target.value.split(',')[0].trim()})}
                  style={{ ...iStyle, resize: 'vertical' }}
                />
                {formData.gallery_images && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {formData.gallery_images.split(',').map((img, i) => img.trim() && (
                      <div key={i} style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
                        <img src={img.trim()} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', borderRadius: '6px', objectFit: 'cover', border: i === 0 ? '2px solid #B8935B' : '1px solid rgba(184,147,91,0.4)' }} />
                        {i === 0 && <span style={{ position: 'absolute', bottom: 2, left: 2, background: '#B8935B', color: '#1A2010', fontSize: '8px', fontWeight: '800', padding: '1px 3px', borderRadius: '3px' }}>MAIN</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>Fabric Type</label>
                  <input
                    type="text" placeholder="e.g. Premium Nida Silk"
                    value={formData.fabric_type} onChange={e => setFormData({...formData, fabric_type: e.target.value})}
                    style={iStyle}
                  />
                </div>
                <div>
                  <label style={lStyle}>Badge</label>
                  <select
                    value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})}
                    style={iStyle}
                  >
                    <option value="NEW IN">NEW IN</option>
                    <option value="BEST SELLER">BEST SELLER</option>
                    <option value="LIMITED EDITION">LIMITED EDITION</option>
                    <option value="FEATURED">FEATURED</option>
                    <option value="SALE">SALE</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>Available Colors (comma separated)</label>
                  <input
                    type="text" placeholder="e.g. Black, Olive, Ivory, Dusty Rose"
                    value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}
                    style={iStyle}
                  />
                </div>
                <div>
                  <label style={lStyle}>Fit Type</label>
                  <input
                    type="text" placeholder="e.g. Saudi Flared Loose Fit"
                    value={formData.fit_type} onChange={e => setFormData({...formData, fit_type: e.target.value})}
                    style={iStyle}
                  />
                </div>
              </div>

              {/* Sizes & Size Guide options */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lStyle}>Available Sizes (comma separated)</label>
                  <input
                    type="text" placeholder="e.g. XS, S, M, L, XL, XXL, 52, 54, 56"
                    value={formData.available_sizes || 'XS, S, M, L, XL, XXL'} 
                    onChange={e => setFormData({...formData, available_sizes: e.target.value})}
                    style={iStyle}
                  />
                </div>
                <div>
                  <label style={lStyle}>Size Guide Link</label>
                  <select
                    value={formData.size_guide_key || 'products_size_guide'} 
                    onChange={e => setFormData({...formData, size_guide_key: e.target.value})}
                    style={iStyle}
                  >
                    <option value="products_size_guide">Default Size Guide Chart</option>
                    <option value="custom">Custom Garment Size Guide</option>
                    <option value="none">No Size Guide</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={lStyle}>Product Description</label>
                <textarea
                  rows="3" placeholder="Describe the item material, fold, and texture..."
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  style={{ ...iStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnG}>Cancel</button>
                <button type="submit" style={btnP}>{editProduct ? 'Save & Update' : 'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
