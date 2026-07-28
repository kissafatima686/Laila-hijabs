import React, { useState } from 'react';
import { createProductApi } from '../../api/adminApi';

export default function ProductManagement() {
  const [product, setProduct] = useState({ name: '', slug: '', category_id: '', price: '', stock_quantity: '', description: '', image_url: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createProductApi(product);
      if (res.message) alert('Product added successfully!');
      else alert(res.error || 'Failed to add product');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '8px' }}>
      <h3>Manage Products</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', marginTop: '15px' }}>
        <input type="text" placeholder="Product Name" value={product.name} onChange={e => setProduct({...product, name: e.target.value})} required />
        <input type="text" placeholder="Slug" value={product.slug} onChange={e => setProduct({...product, slug: e.target.value})} required />
        <input type="number" placeholder="Category ID" value={product.category_id} onChange={e => setProduct({...product, category_id: e.target.value})} required />
        <input type="number" placeholder="Price" value={product.price} onChange={e => setProduct({...product, price: e.target.value})} required />
        <input type="number" placeholder="Stock Quantity" value={product.stock_quantity} onChange={e => setProduct({...product, stock_quantity: e.target.value})} required />
        <button type="submit" style={{ padding: '10px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>Save Product</button>
      </form>
    </div>
  );
}