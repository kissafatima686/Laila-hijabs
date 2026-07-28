import React, { useState, useEffect } from 'react';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '', price: '', compare_at_price: '', stock_quantity: 20,
    category_id: 2, image_url: '/hero2.png', fabric_type: 'Premium Nida',
    color: 'Black', badge: 'NEW IN', fit_type: 'Regular Fit', description: '', is_featured: 1
  });

  const fetchProducts = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/admin/products')
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(() => {
        setShowModal(false);
        setFormData({
          name: '', price: '', compare_at_price: '', stock_quantity: 20,
          category_id: 2, image_url: '/hero2.png', fabric_type: 'Premium Nida',
          color: 'Black', badge: 'NEW IN', fit_type: 'Regular Fit', description: '', is_featured: 1
        });
        fetchProducts();
      })
      .catch(() => {});
  };

  const handleDeleteProduct = (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    fetch(`http://localhost:5000/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}` }
    })
      .then(() => fetchProducts())
      .catch(() => {});
  };

  const filteredProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (p.fabric_type || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header Bar */}
      <div style={{
        backgroundColor: '#222C1A',
        borderRadius: '16px',
        padding: '24px 32px',
        border: '1px solid #B8935B',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#F6F1E3', margin: '0 0 6px 0' }}>
            Products Management
          </h2>
          <p style={{ fontSize: '13px', color: '#E7D9C9', margin: 0 }}>
            Manage catalog items, stock levels, badges, and pricing.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: '#B8935B',
            border: 'none',
            color: '#3E4930',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(184, 147, 91, 0.3)'
          }}
        >
          + Add New Product
        </button>
      </div>

      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search products by title or fabric..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '320px',
            padding: '10px 16px',
            borderRadius: '8px',
            backgroundColor: '#222C1A',
            border: '1px solid #B8935B',
            color: '#F6F1E3',
            fontSize: '13px',
            outline: 'none'
          }}
        />
      </div>

      {/* Products Table */}
      <div style={{
        backgroundColor: '#222C1A',
        borderRadius: '16px',
        border: '1px solid rgba(184, 147, 91, 0.3)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#E7D9C9' }}>Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#B8A99A' }}>No products found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(184, 147, 91, 0.3)', backgroundColor: '#182012' }}>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>PRODUCT</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>PRICE</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>STOCK</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>BADGE</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.product_id || p.id} style={{ borderBottom: '1px solid rgba(184, 147, 91, 0.15)' }}>
                  <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={p.image_url || '/hero2.png'} 
                      alt={p.name}
                      style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #B8935B' }} 
                    />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#F6F1E3' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: '#E7D9C9' }}>{p.fabric_type || 'Premium Nida'}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700', color: '#B8935B' }}>
                    Rs. {parseFloat(p.price || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: '#E7D9C9' }}>
                    {p.stock_quantity || 0} units
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
                    <button
                      onClick={() => handleDeleteProduct(p.product_id || p.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#EF4444',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#222C1A',
            borderRadius: '16px',
            padding: '28px',
            width: '90%', maxWidth: '520px',
            border: '1px solid #B8935B'
          }}>
            <h3 style={{ fontSize: '18px', color: '#F6F1E3', marginBottom: '16px' }}>Add New Product</h3>
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text" required placeholder="Product Title *"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid #B8935B', color: '#F6F1E3' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number" required placeholder="Price (Rs.) *"
                  value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid #B8935B', color: '#F6F1E3' }}
                />
                <input
                  type="number" placeholder="Stock Quantity"
                  value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid #B8935B', color: '#F6F1E3' }}
                />
              </div>
              <input
                type="text" placeholder="Fabric Type (e.g. Nida Silk, Chiffon)"
                value={formData.fabric_type} onChange={e => setFormData({...formData, fabric_type: e.target.value})}
                style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid #B8935B', color: '#F6F1E3' }}
              />
              <textarea
                rows="3" placeholder="Product Description..."
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid #B8935B', color: '#F6F1E3' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', color: '#E7D9C9', background: 'none', border: 'none' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#B8935B', color: '#3E4930', border: 'none', borderRadius: '6px', fontWeight: '700' }}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
