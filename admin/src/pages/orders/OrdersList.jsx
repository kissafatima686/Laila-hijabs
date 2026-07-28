import React, { useState, useEffect } from 'react';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/admin/orders')
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = (orderId, newStatus) => {
    fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_status: newStatus })
    })
      .then(() => fetchOrders())
      .catch(() => {});
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{
        backgroundColor: '#222C1A',
        borderRadius: '16px',
        padding: '24px 32px',
        border: '1px solid #B8935B'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#F6F1E3', margin: '0 0 6px 0' }}>
          Customer Orders Management
        </h2>
        <p style={{ fontSize: '13px', color: '#E7D9C9', margin: 0 }}>
          View, process, ship, and update order statuses in real-time.
        </p>
      </div>

      {/* Orders Table */}
      <div style={{
        backgroundColor: '#222C1A',
        borderRadius: '16px',
        border: '1px solid rgba(184, 147, 91, 0.3)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#E7D9C9' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#B8A99A' }}>No orders found yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(184, 147, 91, 0.3)', backgroundColor: '#182012' }}>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>ORDER ID</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>CUSTOMER</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>TOTAL</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>METHOD</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>STATUS</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', textAlign: 'right' }}>UPDATE STATUS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const orderId = o.order_id || o.ORDER_ID || o.id;
                const status = o.order_status || o.ORDER_STATUS || 'Pending';
                
                return (
                  <tr key={orderId} style={{ borderBottom: '1px solid rgba(184, 147, 91, 0.15)' }}>
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700', color: '#F6F1E3' }}>
                      #{orderId}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#F6F1E3' }}>{o.recipient_name || o.customer_name || 'Customer'}</div>
                      <div style={{ fontSize: '11px', color: '#E7D9C9' }}>{o.customer_email || o.shipping_address || 'Pakistan'}</div>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700', color: '#B8935B' }}>
                      Rs. {parseFloat(o.total_amount || o.TOTAL_AMOUNT || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '12px', color: '#E7D9C9' }}>
                      {o.payment_method || 'COD'}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        backgroundColor: '#3E4930',
                        color: '#F6F1E3',
                        border: '1px solid #B8935B'
                      }}>
                        {status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <select
                        value={status}
                        onChange={(e) => handleUpdateStatus(orderId, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: '#182012',
                          border: '1px solid #B8935B',
                          color: '#F6F1E3',
                          fontSize: '12px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
