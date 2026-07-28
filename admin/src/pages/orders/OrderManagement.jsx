import React, { useEffect, useState } from 'react';
import { fetchOrdersApi } from '../../api/adminApi';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrdersApi().then(data => {
      if (Array.isArray(data)) setOrders(data);
    }).catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '8px' }}>
      <h3>Customer Orders</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, idx) => (
            <tr key={idx}>
              <td>{o.ORDER_ID}</td>
              <td>PKR {o.TOTAL_AMOUNT}</td>
              <td>{o.ORDER_STATUS}</td>
              <td>{o.CREATED_AT}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}