import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

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
    navigate('/products/new');
  };

  const openEditProduct = (prod) => {
    const id = prod.product_id || prod.id;
    navigate(`/products/${id}`);
  };

  const handleToggleStatus = (p) => {
    const productId = p.product_id;
    const nextStatus = (p.status === 'Live') ? 'Draft' : 'Live';
    fetch(`${API}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ ...p, status: nextStatus })
    }).then(fetchProducts);
  };

  const handleDeleteProduct = (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    fetch(`${API}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    })
      .then(() => fetchProducts())
      .catch(err => console.error("Error deleting product:", err));
  };

  const filteredProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (p.sku || '').toLowerCase().includes(search.toLowerCase())
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
          placeholder="Search products by title or SKU..."
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
        border: '1px solid rgba(184,147,91,0.3)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#E7D9C9' }}>Loading product inventory...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#B8A99A' }}>No products found. Click "+ Add New Product" to add items!</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(184,147,91,0.3)', backgroundColor: '#182012' }}>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>PRODUCT ITEM</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>PRICE</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>STOCK</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>STATUS</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => {
                const isActive = p.status === 'Live';
                return (
                  <tr key={p.product_id} style={{ borderBottom: '1px solid rgba(184,147,91,0.15)' }}>
                    <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={p.image_url || '/placeholder.png'}
                        alt={p.name}
                        style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #B8935B' }} 
                      />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#F6F1E3' }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: '#E7D9C9' }}>{p.sku || 'No SKU'}</div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700', color: '#B8935B' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>Rs. {parseFloat(p.price || 0).toLocaleString()}</span>
                        {p.compare_at_price && (
                          <span style={{ fontSize: '11px', textDecoration: 'line-through', color: '#E7D9C9', fontWeight: '400' }}>
                            Rs. {parseFloat(p.compare_at_price).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#E7D9C9' }}>
                      {p.stock} units
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '8px',
                        backgroundColor: isActive ? '#3E4930' : 'rgba(239,68,68,0.15)',
                        color: isActive ? '#B8935B' : '#EF4444',
                        border: isActive ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)'
                      }}>
                        {p.status}
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
                            backgroundColor: isActive ? '#3E4930' : '#B8935B',
                            color: isActive ? '#F6F1E3' : '#1A2010',
                            borderColor: '#B8935B'
                          }}
                        >
                          {isActive ? 'Draft' : 'Publish'}
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
                          onClick={() => handleDeleteProduct(p.product_id)}
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
        ) }
      </div>
    </div>
  );
};

export default ProductsList;
