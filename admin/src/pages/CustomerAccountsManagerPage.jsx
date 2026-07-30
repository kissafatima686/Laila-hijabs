import React, { useState, useEffect } from 'react';

/**
 * Customer Accounts Manager (Under Header Utilities -> Customer Accounts):
 * Manages all 5 Customer Account Sections with FULL CRUD (Add, Edit, Save, Active Toggle, Delete):
 *  1. Registered Accounts & Profiles
 *  2. Customer Order History
 *  3. Custom Tailoring Orders
 *  4. Page Header CMS Settings (Title, Subtitle, Welcome Back User Text)
 */

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

const cardStyle = { 
  backgroundColor: '#222C1A', 
  borderRadius: '14px', 
  padding: '22px', 
  border: '1px solid rgba(184,147,91,0.25)' 
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

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
  </svg>
);

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CustomerAccountsManagerPage = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'orders' | 'custom_orders' | 'settings'

  // Users State
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchUser, setSearchUser] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [userForm, setUserForm] = useState({ full_name: '', email: '', phone: '', status: 'Active' });

  // Orders State & CRUD
  const [orders, setOrders] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [orderForm, setOrderForm] = useState({ guest_email: '', total_amount: '0', order_status: 'Processing', payment_status: 'Paid' });

  // Custom Orders State & CRUD
  const [customOrders, setCustomOrders] = useState([]);
  const [showCustomOrderModal, setShowCustomOrderModal] = useState(false);
  const [editCustomOrder, setEditCustomOrder] = useState(null);
  const [customOrderForm, setCustomOrderForm] = useState({ customer_name: '', garment_type: '', description: '', status: 'Active' });

  // Page CMS Settings State (Title, Subtitle, Welcome Back User Text)
  const [pageSettings, setPageSettings] = useState({
    title: 'Account Overview',
    subtitle: 'Manage your orders, profile, and addresses.',
    welcome_prefix: 'Welcome back, '
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Fetch Users
  const fetchUsers = () => {
    setLoadingUsers(true);
    fetch(`${API}/module/users`)
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching users:", err))
      .finally(() => setLoadingUsers(false));
  };

  // Fetch Orders
  const fetchOrders = () => {
    fetch(`${API}/orders`)
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching orders:", err));
  };

  // Fetch Custom Orders
  const fetchCustomOrders = () => {
    fetch(`${API}/module/custom-orders`)
      .then(res => res.json())
      .then(data => setCustomOrders(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching custom orders:", err));
  };

  // Fetch Account Page CMS Settings
  const fetchPageSettings = () => {
    fetch(`${API}/sections/account_page_settings`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          let meta = {};
          try { meta = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : (data.metadata || {}); } catch(e) {}
          setPageSettings({
            title: data.title || 'Account Overview',
            subtitle: data.subtitle || 'Manage your orders, profile, and addresses.',
            welcome_prefix: meta.welcome_prefix || 'Welcome back, '
          });
        }
      })
      .catch(err => console.error("Error fetching account page settings:", err));
  };

  useEffect(() => {
    fetchUsers();
    fetchOrders();
    fetchCustomOrders();
    fetchPageSettings();
  }, []);

  const handleSavePageSettings = (e) => {
    e.preventDefault();
    setSavingSettings(true);
    fetch(`${API}/sections/account_page_settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: pageSettings.title,
        subtitle: pageSettings.subtitle,
        metadata: { welcome_prefix: pageSettings.welcome_prefix }
      })
    })
      .then(() => alert('Customer Account Page settings saved successfully!'))
      .catch(err => console.error("Error saving page settings:", err))
      .finally(() => setSavingSettings(false));
  };

  // --- USER CRUD ---
  const openAddUser = () => {
    setEditUser(null);
    setUserForm({ full_name: '', email: '', phone: '', status: 'Active' });
    setShowUserModal(true);
  };
  const openEditUser = (user) => {
    setEditUser(user);
    setUserForm({ full_name: user.full_name || '', email: user.email || '', phone: user.phone || '', status: user.status || 'Active' });
    setShowUserModal(true);
  };
  const handleSaveUser = (e) => {
    e.preventDefault();
    const url = editUser ? `${API}/module/users/${editUser.user_id}` : `${API}/module/users`;
    const method = editUser ? 'PUT' : 'POST';
    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userForm) })
      .then(() => { setShowUserModal(false); fetchUsers(); });
  };
  const handleToggleUserStatus = (user) => {
    const nextStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    fetch(`${API}/module/users/${user.user_id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    }).then(fetchUsers);
  };
  const handleDeleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this customer account?")) return;
    fetch(`${API}/module/users/${id}`, { method: 'DELETE' }).then(fetchUsers);
  };

  // --- ORDER CRUD ---
  const openAddOrder = () => {
    setEditOrder(null);
    setOrderForm({ guest_email: '', total_amount: '0', order_status: 'Processing', payment_status: 'Paid' });
    setShowOrderModal(true);
  };
  const openEditOrder = (ord) => {
    setEditOrder(ord);
    setOrderForm({
      guest_email: ord.guest_email || ord.customer_name_reg || '',
      total_amount: ord.total_amount || '0',
      order_status: ord.order_status || 'Processing',
      payment_status: ord.payment_status || 'Paid'
    });
    setShowOrderModal(true);
  };
  const handleSaveOrder = (e) => {
    e.preventDefault();
    const url = editOrder ? `${API}/module/orders/${editOrder.order_id}` : `${API}/module/orders`;
    const method = editOrder ? 'PUT' : 'POST';
    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderForm) })
      .then(() => { setShowOrderModal(false); fetchOrders(); });
  };
  const handleToggleOrderStatus = (ord) => {
    const nextStatus = ord.order_status === 'Processing' ? 'Delivered' : (ord.order_status === 'Delivered' ? 'Cancelled' : 'Processing');
    fetch(`${API}/module/orders/${ord.order_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_status: nextStatus })
    }).then(fetchOrders);
  };
  const handleDeleteOrder = (id) => {
    if (!window.confirm("Are you sure you want to delete this order record?")) return;
    fetch(`${API}/module/orders/${id}`, { method: 'DELETE' }).then(fetchOrders);
  };

  // --- CUSTOM ORDER CRUD ---
  const openAddCustomOrder = () => {
    setEditCustomOrder(null);
    setCustomOrderForm({ customer_name: '', garment_type: '', description: '', status: 'Active' });
    setShowCustomOrderModal(true);
  };
  const openEditCustomOrder = (co) => {
    setEditCustomOrder(co);
    setCustomOrderForm({ customer_name: co.customer_name || '', garment_type: co.garment_type || '', description: co.description || '', status: co.status || 'Active' });
    setShowCustomOrderModal(true);
  };
  const handleSaveCustomOrder = (e) => {
    e.preventDefault();
    const url = editCustomOrder ? `${API}/module/custom-orders/${editCustomOrder.custom_order_id}` : `${API}/module/custom-orders`;
    const method = editCustomOrder ? 'PUT' : 'POST';
    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(customOrderForm) })
      .then(() => { setShowCustomOrderModal(false); fetchCustomOrders(); });
  };
  const handleToggleCustomOrderStatus = (co) => {
    const nextStatus = co.status === 'Active' ? 'Draft' : 'Active';
    fetch(`${API}/module/custom-orders/${co.custom_order_id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    }).then(fetchCustomOrders);
  };
  const handleDeleteCustomOrder = (id) => {
    if (!window.confirm("Are you sure you want to delete this custom order request?")) return;
    fetch(`${API}/module/custom-orders/${id}`, { method: 'DELETE' }).then(fetchCustomOrders);
  };

  const filteredUsers = users.filter(u => {
    const q = searchUser.toLowerCase();
    return (u.full_name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q) || (u.phone || '').toLowerCase().includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '50px' }}>
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div style={{ 
        background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', 
        borderRadius: '16px', 
        padding: '24px 28px', 
        border: '1px solid #B8935B', 
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '12px' 
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '5px' }}>
            HEADER UTILITIES
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#F6F1E3' }}>
            Customer Accounts Manager
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Manage all customer account sections: Registered Users, Order History, Custom Orders, & Page Header CMS Settings.
          </p>
        </div>
      </div>

      {/* ── Top Section Tabs Bar ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
        <button 
          onClick={() => setActiveTab('users')} 
          style={{ 
            padding: '9px 18px', 
            borderRadius: '20px', 
            fontSize: '12px', 
            fontWeight: '700', 
            cursor: 'pointer', 
            border: activeTab === 'users' ? '1px solid #B8935B' : '1px solid rgba(184,147,91,0.25)', 
            backgroundColor: activeTab === 'users' ? '#B8935B' : 'transparent', 
            color: activeTab === 'users' ? '#1A2010' : '#E7D9C9' 
          }}
        >
          1. Registered Accounts ({users.length})
        </button>

        <button 
          onClick={() => setActiveTab('orders')} 
          style={{ 
            padding: '9px 18px', 
            borderRadius: '20px', 
            fontSize: '12px', 
            fontWeight: '700', 
            cursor: 'pointer', 
            border: activeTab === 'orders' ? '1px solid #B8935B' : '1px solid rgba(184,147,91,0.25)', 
            backgroundColor: activeTab === 'orders' ? '#B8935B' : 'transparent', 
            color: activeTab === 'orders' ? '#1A2010' : '#E7D9C9' 
          }}
        >
          2. Order History ({orders.length})
        </button>

        <button 
          onClick={() => setActiveTab('custom_orders')} 
          style={{ 
            padding: '9px 18px', 
            borderRadius: '20px', 
            fontSize: '12px', 
            fontWeight: '700', 
            cursor: 'pointer', 
            border: activeTab === 'custom_orders' ? '1px solid #B8935B' : '1px solid rgba(184,147,91,0.25)', 
            backgroundColor: activeTab === 'custom_orders' ? '#B8935B' : 'transparent', 
            color: activeTab === 'custom_orders' ? '#1A2010' : '#E7D9C9' 
          }}
        >
          3. Custom Orders ({customOrders.length})
        </button>

        <button 
          onClick={() => setActiveTab('settings')} 
          style={{ 
            padding: '9px 18px', 
            borderRadius: '20px', 
            fontSize: '12px', 
            fontWeight: '700', 
            cursor: 'pointer', 
            border: activeTab === 'settings' ? '1px solid #B8935B' : '1px solid rgba(184,147,91,0.25)', 
            backgroundColor: activeTab === 'settings' ? '#B8935B' : 'transparent', 
            color: activeTab === 'settings' ? '#1A2010' : '#E7D9C9' 
          }}
        >
          4. Page Header CMS Settings
        </button>
      </div>

      {/* ── TAB 1: REGISTERED CUSTOMER ACCOUNTS ─────────────────────────────── */}
      {activeTab === 'users' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>SECTION 1</div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Registered Customer User Accounts</h3>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Search user name, email..." 
                value={searchUser} 
                onChange={e => setSearchUser(e.target.value)} 
                style={{ ...iStyle, width: '220px' }} 
              />
              <button onClick={openAddUser} style={btnP}>+ Add Customer</button>
            </div>
          </div>

          {loadingUsers ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#E7D9C9' }}>Loading Customer Accounts...</div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#B8A99A', fontSize: '13px' }}>
              No registered customer users found.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#182012', borderBottom: '1px solid rgba(184,147,91,0.25)' }}>
                    <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>CUSTOMER NAME</th>
                    <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>EMAIL ADDRESS</th>
                    <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>PHONE NUMBER</th>
                    <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>STATUS</th>
                    <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.user_id} style={{ borderBottom: '1px solid rgba(184,147,91,0.1)' }}>
                      <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: '700', color: '#F6F1E3' }}>
                        {user.full_name || 'Customer'}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: '12px', color: '#B8A99A' }}>
                        {user.email}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: '12px', color: '#E7D9C9' }}>
                        {user.phone || 'N/A'}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ 
                          fontSize: '10px', 
                          padding: '3px 10px', 
                          borderRadius: '10px', 
                          fontWeight: '700', 
                          color: user.status === 'Active' ? '#22c55e' : '#EF4444', 
                          backgroundColor: user.status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          border: `1px solid ${user.status === 'Active' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                        }}>
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button onClick={() => handleToggleUserStatus(user)} style={{ ...btnG, padding: '5px 10px', fontSize: '11px' }}>
                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button onClick={() => openEditUser(user)} style={{ ...btnG, padding: '5px 10px' }} title="Edit"><EditIcon /></button>
                          <button onClick={() => handleDeleteUser(user.user_id)} style={{ ...btnD, padding: '5px 10px' }} title="Delete"><TrashIcon /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: CUSTOMER ORDER HISTORY (FULL CRUD) ──────────────────────── */}
      {activeTab === 'orders' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>SECTION 2</div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Customer Order History</h3>
            </div>
            <button onClick={openAddOrder} style={btnP}>+ Add Order</button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#182012', borderBottom: '1px solid rgba(184,147,91,0.25)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>ORDER ID</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>CUSTOMER</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>TOTAL</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>ORDER STATUS</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#B8A99A' }}>No customer orders placed yet.</td></tr>
                ) : orders.map(order => (
                  <tr key={order.order_id} style={{ borderBottom: '1px solid rgba(184,147,91,0.1)' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '700', color: '#F6F1E3' }}>#{order.order_number || order.order_id}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#B8A99A' }}>{order.customer_name_reg || order.guest_email || 'Customer'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '700', color: '#B8935B' }}>Rs. {order.total_amount}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '8px', fontWeight: '700', backgroundColor: '#3E4930', color: '#F6F1E3' }}>
                        {order.order_status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleToggleOrderStatus(order)} style={{ ...btnG, padding: '5px 10px', fontSize: '11px' }}>
                          Status: {order.order_status}
                        </button>
                        <button onClick={() => openEditOrder(order)} style={{ ...btnG, padding: '5px 10px' }} title="Edit"><EditIcon /></button>
                        <button onClick={() => handleDeleteOrder(order.order_id)} style={{ ...btnD, padding: '5px 10px' }} title="Delete"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: CUSTOM TAILORING ORDERS (FULL CRUD) ────────────────────── */}
      {activeTab === 'custom_orders' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px' }}>SECTION 3</div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Custom Tailoring Requests</h3>
            </div>
            <button onClick={openAddCustomOrder} style={btnP}>+ Add Custom Order</button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#182012', borderBottom: '1px solid rgba(184,147,91,0.25)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>CUSTOMER NAME</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>GARMENT TYPE</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>DETAILS</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px' }}>STATUS</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {customOrders.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#B8A99A' }}>No custom tailoring requests submitted yet.</td></tr>
                ) : customOrders.map(co => (
                  <tr key={co.custom_order_id} style={{ borderBottom: '1px solid rgba(184,147,91,0.1)' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '700', color: '#F6F1E3' }}>{co.customer_name}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#B8A99A' }}>{co.garment_type}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#E7D9C9' }}>{co.description}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '8px', fontWeight: '700', backgroundColor: '#3E4930', color: '#F6F1E3' }}>{co.status}</span></td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleToggleCustomOrderStatus(co)} style={{ ...btnG, padding: '5px 10px', fontSize: '11px' }}>
                          {co.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => openEditCustomOrder(co)} style={{ ...btnG, padding: '5px 10px' }} title="Edit"><EditIcon /></button>
                        <button onClick={() => handleDeleteCustomOrder(co.custom_order_id)} style={{ ...btnD, padding: '5px 10px' }} title="Delete"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 4: PAGE HEADER CMS SETTINGS (WITH WELCOME BACK USER TEXT) ──── */}
      {activeTab === 'settings' && (
        <div style={cardStyle}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.4px', marginBottom: '4px' }}>SECTION 4</div>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#F6F1E3' }}>Customer Account Page Settings</h3>

          <form onSubmit={handleSavePageSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '550px' }}>
            <div>
              <label style={lStyle}>Page Header Title</label>
              <input 
                value={pageSettings.title} 
                onChange={e => setPageSettings(p => ({ ...p, title: e.target.value }))} 
                style={iStyle} 
                placeholder="e.g. Account Overview" 
              />
            </div>

            <div>
              <label style={lStyle}>Page Header Subtitle</label>
              <input 
                value={pageSettings.subtitle} 
                onChange={e => setPageSettings(p => ({ ...p, subtitle: e.target.value }))} 
                style={iStyle} 
                placeholder="e.g. Manage your orders, profile, and addresses." 
              />
            </div>

            <div>
              <label style={lStyle}>Welcome Back Specific User Text (Prefix)</label>
              <input 
                value={pageSettings.welcome_prefix} 
                onChange={e => setPageSettings(p => ({ ...p, welcome_prefix: e.target.value }))} 
                style={iStyle} 
                placeholder="e.g. Welcome back, " 
              />
              <span style={{ fontSize: '11px', color: '#B8A99A', marginTop: '4px', display: 'block' }}>
                This text appears before the logged-in customer's name (e.g. "{pageSettings.welcome_prefix}ADMIN").
              </span>
            </div>

            <div>
              <button type="submit" disabled={savingSettings} style={btnP}>
                {savingSettings ? 'Saving Settings...' : 'Save Account Page Settings'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── User Add / Edit Modal ───────────────────────────────────────────── */}
      {showUserModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '26px', width: '90%', maxWidth: '480px', border: '1px solid #B8935B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>CUSTOMER ACCOUNT</div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#F6F1E3' }}>
                  {editUser ? 'Edit Customer Account' : 'Add New Customer'}
                </h3>
              </div>
              <button onClick={() => setShowUserModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer' }}><CloseIcon /></button>
            </div>

            <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={lStyle}>Customer Full Name *</label>
                <input required value={userForm.full_name} onChange={e => setUserForm(p => ({ ...p, full_name: e.target.value }))} style={iStyle} placeholder="e.g. Ayesha Khan" />
              </div>
              <div>
                <label style={lStyle}>Email Address *</label>
                <input required type="email" value={userForm.email} onChange={e => setUserForm(p => ({ ...p, email: e.target.value }))} style={iStyle} placeholder="e.g. ayesha@example.com" />
              </div>
              <div>
                <label style={lStyle}>Phone Number</label>
                <input value={userForm.phone} onChange={e => setUserForm(p => ({ ...p, phone: e.target.value }))} style={iStyle} placeholder="e.g. +92 323 8399480" />
              </div>
              <div>
                <label style={lStyle}>Account Status</label>
                <select value={userForm.status} onChange={e => setUserForm(p => ({ ...p, status: e.target.value }))} style={iStyle}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Banned">Banned</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
                <button type="button" onClick={() => setShowUserModal(false)} style={btnG}>Cancel</button>
                <button type="submit" style={btnP}>{editUser ? 'Save & Update' : 'Add Customer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Order Add / Edit Modal ─────────────────────────────────────────── */}
      {showOrderModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '26px', width: '90%', maxWidth: '480px', border: '1px solid #B8935B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>ORDER MANAGEMENT</div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#F6F1E3' }}>
                  {editOrder ? 'Edit Order Record' : 'Add New Order'}
                </h3>
              </div>
              <button onClick={() => setShowOrderModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer' }}><CloseIcon /></button>
            </div>

            <form onSubmit={handleSaveOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={lStyle}>Customer Name / Email *</label>
                <input required value={orderForm.guest_email} onChange={e => setOrderForm(p => ({ ...p, guest_email: e.target.value }))} style={iStyle} placeholder="e.g. customer@example.com" />
              </div>
              <div>
                <label style={lStyle}>Total Amount (Rs.)</label>
                <input value={orderForm.total_amount} onChange={e => setOrderForm(p => ({ ...p, total_amount: e.target.value }))} style={iStyle} placeholder="e.g. 25,400" />
              </div>
              <div>
                <label style={lStyle}>Order Status</label>
                <select value={orderForm.order_status} onChange={e => setOrderForm(p => ({ ...p, order_status: e.target.value }))} style={iStyle}>
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
                <button type="button" onClick={() => setShowOrderModal(false)} style={btnG}>Cancel</button>
                <button type="submit" style={btnP}>{editOrder ? 'Save & Update' : 'Add Order'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Custom Order Add / Edit Modal ───────────────────────────────────── */}
      {showCustomOrderModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '26px', width: '90%', maxWidth: '480px', border: '1px solid #B8935B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>CUSTOM TAILORING</div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#F6F1E3' }}>
                  {editCustomOrder ? 'Edit Custom Order' : 'Add Custom Order'}
                </h3>
              </div>
              <button onClick={() => setShowCustomOrderModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer' }}><CloseIcon /></button>
            </div>

            <form onSubmit={handleSaveCustomOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={lStyle}>Customer Name *</label>
                <input required value={customOrderForm.customer_name} onChange={e => setCustomOrderForm(p => ({ ...p, customer_name: e.target.value }))} style={iStyle} placeholder="e.g. Ayesha Khan" />
              </div>
              <div>
                <label style={lStyle}>Garment Type</label>
                <input value={customOrderForm.garment_type} onChange={e => setCustomOrderForm(p => ({ ...p, garment_type: e.target.value }))} style={iStyle} placeholder="e.g. Bespoke Silk Abaya" />
              </div>
              <div>
                <label style={lStyle}>Description / Requirements</label>
                <textarea rows={3} value={customOrderForm.description} onChange={e => setCustomOrderForm(p => ({ ...p, description: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="Custom length, special embroidery details..." />
              </div>
              <div>
                <label style={lStyle}>Status</label>
                <select value={customOrderForm.status} onChange={e => setCustomOrderForm(p => ({ ...p, status: e.target.value }))} style={iStyle}>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
                <button type="button" onClick={() => setShowCustomOrderModal(false)} style={btnG}>Cancel</button>
                <button type="submit" style={btnP}>{editCustomOrder ? 'Save & Update' : 'Add Custom Order'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAccountsManagerPage;
