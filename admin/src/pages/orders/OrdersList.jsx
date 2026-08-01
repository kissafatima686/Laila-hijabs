import React, { useState, useEffect } from 'react';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrders = () => {
    setLoading(true);
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/orders')
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = (orderId, newStatus) => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_status: newStatus })
    })
      .then(() => fetchOrders())
      .catch(() => {});
  };

  const getStatusBadgeStyle = (status = 'Pending') => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return { backgroundColor: 'rgba(34,197,94,0.15)', color: '#15803D', border: '1px solid rgba(34,197,94,0.3)' };
      case 'processing':
        return { backgroundColor: '#E0E7FF', color: '#3730A3', border: '1px solid #A5B4FC' };
      case 'shipped':
        return { backgroundColor: '#F3E8FF', color: '#7E22CE', border: '1px solid #D8B4FE' };
      case 'cancelled':
        return { backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5' };
      default: // Pending
        return { backgroundColor: '#FEF3C7', color: '#D97706', border: '1px solid #FCD34D' };
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'All') return true;
    const st = (o.order_status || 'Pending').toLowerCase();
    return st === statusFilter.toLowerCase();
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      
      {/* Header Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '20px 24px',
        border: '1px solid #E7D9C9',
        boxShadow: '0 2px 8px rgba(62, 73, 48, 0.04)',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>
            ORDERS & FULFILLMENT
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#3E4930', margin: '2px 0 0 0' }}>
            Customer Orders Management
          </h2>
        </div>

        <button 
          onClick={fetchOrders} 
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            backgroundColor: '#F6F1E3',
            border: '1px solid #B8935B',
            color: '#3E4930',
            fontSize: '12.5px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Refresh Orders
        </button>
      </div>

      {/* Top Status Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#3E4930', marginRight: '4px' }}>
          Filter Status:
        </span>
        {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => {
          const isActive = statusFilter === st;
          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: isActive ? '#3E4930' : '#FFFFFF',
                color: isActive ? '#F6F1E3' : '#3E4930',
                border: `1px solid ${isActive ? '#3E4930' : '#E7D9C9'}`
              }}
            >
              {st}
            </button>
          );
        })}
      </div>

      {/* Orders Table Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E7D9C9',
        boxShadow: '0 2px 8px rgba(62, 73, 48, 0.04)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#3E4930', fontWeight: '600' }}>Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
            No orders found matching "{statusFilter}".
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E7D9C9', backgroundColor: '#F6F1E3' }}>
                <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: '700', color: '#3E4930', letterSpacing: '1px' }}>ORDER ID</th>
                <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: '700', color: '#3E4930', letterSpacing: '1px' }}>CUSTOMER</th>
                <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: '700', color: '#3E4930', letterSpacing: '1px' }}>TOTAL</th>
                <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: '700', color: '#3E4930', letterSpacing: '1px' }}>METHOD</th>
                <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: '700', color: '#3E4930', letterSpacing: '1px' }}>STATUS</th>
                <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: '700', color: '#3E4930', letterSpacing: '1px', textAlign: 'right' }}>UPDATE STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o, idx) => {
                const orderId = o.order_id || o.ORDER_ID || o.id || (idx + 1);
                const status = o.order_status || o.ORDER_STATUS || 'Pending';
                const badgeStyle = getStatusBadgeStyle(status);

                return (
                  <tr key={orderId} style={{ borderBottom: '1px solid #E7D9C9' }}>
                    <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '700', color: '#3E4930' }}>
                      #{orderId}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#3E4930' }}>
                        {o.recipient_name || o.customer_name || 'Customer'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                        {o.customer_email || o.shipping_address || 'Pakistan'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: '700', color: '#B8935B' }}>
                      Rs. {parseFloat(o.total_amount || o.TOTAL_AMOUNT || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '12px', color: '#3E4930', fontWeight: '500' }}>
                      {o.payment_method || 'WhatsApp Confirmation'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        fontSize: '10.5px',
                        fontWeight: '700',
                        padding: '3px 10px',
                        borderRadius: '10px',
                        whiteSpace: 'nowrap',
                        ...badgeStyle
                      }}>
                        {status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <select
                        value={status}
                        onChange={(e) => handleUpdateStatus(orderId, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: '#F6F1E3',
                          border: '1px solid #B8935B',
                          color: '#3E4930',
                          fontSize: '12px',
                          fontWeight: '600',
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
