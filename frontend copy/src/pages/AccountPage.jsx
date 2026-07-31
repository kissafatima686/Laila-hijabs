import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useContent } from '../context/useContent';
import './AccountPage.css';
import { 
  IoCubeOutline, 
  IoLocationOutline, 
  IoSettingsOutline, 
  IoLogOutOutline,
  IoHeartOutline,
  IoCutOutline
} from 'react-icons/io5';

const AccountPage = () => {
  const { wishlistItems, removeFromWishlist, moveToCart } = useContext(CartContext);
  const { getSectionContent } = useContent();
  const pageTitle = getSectionContent('account_page_settings', 'title', 'Account Overview');
  const pageSubtitle = getSectionContent('account_page_settings', 'subtitle', 'Manage your orders, profile, and addresses.');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  // Input states for Login/Register
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Persist user profile data
  const [userData, setUserData] = useState(() => {
    try {
      const savedUser = localStorage.getItem('laila_hijabs_user');
      if (savedUser) {
        setIsLoggedIn(true);
        return JSON.parse(savedUser);
      }
    } catch (e) {}
    return { name: "", email: "", phone: "" };
  });

  const [addresses, setAddresses] = useState(() => {
    try {
      const userStr = localStorage.getItem('laila_hijabs_user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (user && user.email) {
        const savedAddresses = localStorage.getItem(`laila_hijabs_addresses_${user.email}`);
        if (savedAddresses) return JSON.parse(savedAddresses);
      }
    } catch (e) {}
    return [];
  });
  
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ name: '', street: '', city: '', phone: '' });

  const [orders, setOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isLoggedIn && userData.email) {
      localStorage.setItem('laila_hijabs_user', JSON.stringify(userData));
    }
  }, [userData, isLoggedIn]);

  useEffect(() => {
    if (userData.email) {
      localStorage.setItem(`laila_hijabs_addresses_${userData.email}`, JSON.stringify(addresses));
    }
  }, [addresses, userData.email]);

  // Fetch Orders
  useEffect(() => {
    if (isLoggedIn && userData.email && (activeTab === 'orders' || activeTab === 'custom_orders')) {
      setLoadingOrders(true);
      if (activeTab === 'orders') {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${userData.email}`)
          .then(res => res.json())
          .then(data => setOrders(Array.isArray(data) ? data : []))
          .catch(err => console.error(err))
          .finally(() => setLoadingOrders(false));
      } else if (activeTab === 'custom_orders') {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/custom-orders/${userData.email}`)
          .then(res => res.json())
          .then(data => setCustomOrders(Array.isArray(data) ? data : []))
          .catch(err => console.error(err))
          .finally(() => setLoadingOrders(false));
      }
    }
  }, [isLoggedIn, userData.email, activeTab]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginEmail, password: loginPassword })
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Login failed');
          return;
        }
        
        setUserData({
          id: data.user.id,
          name: data.user.full_name,
          email: data.user.email,
          phone: data.user.phone,
          address: data.user.address,
          city: data.user.city
        });
        setIsLoggedIn(true);
        // Load addresses for this specific user
        if (data.user.address) {
          setAddresses([{ id: Date.now(), name: data.user.full_name, street: data.user.address, city: data.user.city, phone: data.user.phone, isDefault: true }]);
        }
      } catch (err) {
        console.error(err);
        alert('An error occurred during login');
      }
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (regName && regEmail && regPassword) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name: regName, email: regEmail, password: regPassword })
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Registration failed');
          return;
        }
        // After signing up, switch tab to Sign In form so the user logs in
        setIsRegister(false);
        setLoginEmail(regEmail);
        alert("Registration successful! Please Sign In with your credentials.");
      } catch (err) {
        console.error(err);
        alert('An error occurred during registration');
      }
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert("Profile details updated successfully!");
  };

  if (!isLoggedIn) {
    return (
      <div className="account-container" style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <div className="login-register-card" style={{ background: '#F6F1E3', padding: '40px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'left' }}>
          <div className="form-toggle-headers" style={{ display: 'flex', gap: '20px', borderBottom: '1px solid rgba(42,42,34,0.1)', paddingBottom: '15px', marginBottom: '30px' }}>
            <h2 
              onClick={() => setIsRegister(false)} 
              style={{ cursor: 'pointer', opacity: isRegister ? 0.4 : 1, transition: 'opacity 0.2s', fontFamily: 'Fraunces, serif', color: '#3E4930' }}
            >
              Sign In
            </h2>
            <h2 
              onClick={() => setIsRegister(true)} 
              style={{ cursor: 'pointer', opacity: isRegister ? 1 : 0.4, transition: 'opacity 0.2s', fontFamily: 'Fraunces, serif', color: '#3E4930' }}
            >
              Register
            </h2>
          </div>

          {!isRegister ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>Email Address *</label>
                <input 
                  type="email" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                  required 
                  style={{ padding: '12px', border: '1px solid rgba(42,42,34,0.15)', background: 'transparent', outline: 'none' }}
                />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>Password *</label>
                <input 
                  type="password" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  required 
                  style={{ padding: '12px', border: '1px solid rgba(42,42,34,0.15)', background: 'transparent', outline: 'none' }}
                />
              </div>
              <button 
                type="submit" 
                className="submit-btn" 
                style={{ backgroundColor: '#3E4930', color: '#fff', border: 'none', padding: '14px', fontSize: '13px', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '1.5px', fontWeight: 'bold' }}
              >
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>Full Name *</label>
                <input 
                  type="text" 
                  value={regName} 
                  onChange={(e) => setRegName(e.target.value)} 
                  required 
                  style={{ padding: '12px', border: '1px solid rgba(42,42,34,0.15)', background: 'transparent', outline: 'none' }}
                />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>Email Address *</label>
                <input 
                  type="email" 
                  value={regEmail} 
                  onChange={(e) => setRegEmail(e.target.value)} 
                  required 
                  style={{ padding: '12px', border: '1px solid rgba(42,42,34,0.15)', background: 'transparent', outline: 'none' }}
                />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>Password *</label>
                <input 
                  type="password" 
                  value={regPassword} 
                  onChange={(e) => setRegPassword(e.target.value)} 
                  required 
                  style={{ padding: '12px', border: '1px solid rgba(42,42,34,0.15)', background: 'transparent', outline: 'none' }}
                />
              </div>
              <button 
                type="submit" 
                className="submit-btn" 
                style={{ backgroundColor: '#3E4930', color: '#fff', border: 'none', padding: '14px', fontSize: '13px', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '1.5px', fontWeight: 'bold' }}
              >
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const welcomePrefix = getSectionContent('account_page_settings', 'welcome_prefix', 'Welcome back, ');

  return (
    <div className="account-container">
      <div className="account-header">
        <h1>{pageTitle}</h1>
        <p>{pageSubtitle}</p>
        <p>{welcomePrefix}<strong>{userData.name}</strong></p>
      </div>

      <div className="account-grid">
        {/* Left Sidebar Navigation */}
        <aside className="account-sidebar">
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <IoCubeOutline size={18} /> Order History
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <IoLocationOutline size={18} /> Saved Addresses
          </button>

          <button 
            className={`tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            <IoHeartOutline size={18} /> My Wishlist
          </button>

          <button 
            className={`tab-btn ${activeTab === 'custom_orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom_orders')}
          >
            <IoCutOutline size={18} /> Custom Orders
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <IoSettingsOutline size={18} /> Account Details
          </button>
          
          <button 
            className="tab-btn logout-btn"
            onClick={() => {
              setIsLoggedIn(false);
              localStorage.removeItem('laila_hijabs_user');
            }}
          >
            <IoLogOutOutline size={18} /> Log Out
          </button>
        </aside>

        {/* Right Content Area */}
        <main className="account-content">
          {/* TAB 1: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="tab-pane">
              <h2>Order History</h2>
              {loadingOrders ? (
                <p>Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="empty-text">You haven't placed any orders yet.</p>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => {
                    const parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                    const itemsStr = parsedItems && parsedItems.length > 0
                      ? parsedItems.map(item => `${item.product_name} (x${item.quantity})`).join(', ')
                      : 'Standard Items';
                      
                    return (
                      <div key={order.id} className="order-card">
                        <div className="order-card-header">
                          <div>
                            <span className="order-id">#{order.order_id || order.id}</span>
                            <span className="order-date">{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                          <span className={`order-status ${(order.order_status || 'Processing').toLowerCase()}`}>
                            {order.order_status || 'Processing'}
                          </span>
                        </div>
                        <p className="order-items">{itemsStr}</p>
                        <div className="order-card-footer">
                          <span className="order-total">Total: <strong>Rs. {parseFloat(order.total_amount).toLocaleString()}</strong></span>
                          <Link to="/contact-us" className="help-link">Need Help?</Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="tab-pane">
              <h2>Saved Addresses</h2>
              
              {isAddingAddress || editingAddressId !== null ? (
                <form 
                  className="details-form" 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (editingAddressId !== null) {
                      setAddresses(addresses.map(a => a.id === editingAddressId ? { ...addressForm, id: a.id, isDefault: a.isDefault } : a));
                    } else {
                      setAddresses([...addresses, { ...addressForm, id: Date.now(), isDefault: addresses.length === 0 }]);
                    }
                    
                    // Sync with backend if user has an ID
                    if (userData.id) {
                      try {
                        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${userData.id}/address`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ address: addressForm.street, city: addressForm.city, phone: addressForm.phone })
                        });
                        // Also update userData so it stays in sync
                        setUserData({ ...userData, address: addressForm.street, city: addressForm.city, phone: addressForm.phone });
                      } catch (err) {
                        console.error('Failed to sync address to backend', err);
                      }
                    }

                    setIsAddingAddress(false);
                    setEditingAddressId(null);
                  }}
                >
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Street Address</label>
                    <input type="text" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>City & Country</label>
                    <input type="text" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} required />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="save-btn">Save Address</button>
                    <button type="button" className="save-btn" style={{ background: '#ddd', color: '#111' }} onClick={() => { setIsAddingAddress(false); setEditingAddressId(null); }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  {addresses.length === 0 ? (
                    <p className="empty-text">You have no saved addresses.</p>
                  ) : (
                    <div className="address-grid">
                      {addresses.map((address) => (
                        <div key={address.id} className={`address-card ${address.isDefault ? 'default-address' : ''}`}>
                          {address.isDefault && <div className="address-badge">Default Shipping</div>}
                          <h3>{address.name}</h3>
                          <p>{address.street}</p>
                          <p>{address.city}</p>
                          <p className="address-phone">{address.phone}</p>
                          <div className="address-actions">
                            <button 
                              className="text-btn"
                              onClick={() => {
                                setAddressForm({ name: address.name, street: address.street, city: address.city, phone: address.phone });
                                setEditingAddressId(address.id);
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              className="text-btn delete"
                              onClick={() => setAddresses(addresses.filter(a => a.id !== address.id))}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button 
                    className="add-address-btn"
                    onClick={() => {
                      setAddressForm({ name: '', street: '', city: '', phone: '' });
                      setIsAddingAddress(true);
                    }}
                  >
                    + Add New Address
                  </button>
                </>
              )}
            </div>
          )}

          {/* TAB 3: MY WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="tab-pane">
              <h2>My Wishlist</h2>
              {wishlistItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p className="empty-text">Your wishlist is empty.</p>
                  <Link to="/categories" className="help-link">Explore Products</Link>
                </div>
              ) : (
                <div className="wishlist-grid">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="wishlist-card">
                      <div className="image-container">
                        <Link to={`/Products/${item.slug}`}>
                          <img src={item.image || "/hero2.png"} alt={item.name} className="wishlist-image" />
                        </Link>
                        <button className="remove-btn" onClick={() => removeFromWishlist(item.id)}>✕</button>
                      </div>
                      <div className="wishlist-details">
                        <Link to={`/Products/${item.slug}`} className="item-link">
                          <h3>{item.name}</h3>
                        </Link>
                        <p className="item-color">{item.color || "Olive"}</p>
                        <div className="item-pricing">
                          <span className="current-price">Rs. {item.price.toLocaleString()}</span>
                        </div>
                        <div className="wishlist-actions-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' }}>
                          <button 
                            className={`move-to-bag-btn ${!item.inStock ? 'disabled' : ''}`}
                            onClick={() => item.inStock && moveToCart(item)}
                            disabled={!item.inStock}
                            style={{ width: '100%', height: '36px', background: item.inStock ? '#3E4930' : '#ccc', color: '#fff', border: 'none', cursor: item.inStock ? 'pointer' : 'not-allowed', borderRadius: '2px', fontSize: '11px', fontWeight: 'bold' }}
                          >
                            {item.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CUSTOM ORDERS */}
          {activeTab === 'custom_orders' && (
            <div className="tab-pane">
              <h2>Custom Tailoring Requests</h2>
              {loadingOrders ? (
                <p>Loading custom orders...</p>
              ) : customOrders.length === 0 ? (
                <p className="empty-text">You haven't placed any custom bespoke requests yet.</p>
              ) : (
                <div className="orders-list">
                  {customOrders.map(co => (
                    <div key={co.id} className="order-card">
                      <div className="order-card-header">
                        <div>
                          <span className="order-id">#CUST-{co.id}</span>
                          <span className="order-date">{new Date(co.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <span className={`order-status ${(co.status || 'Received').toLowerCase()}`}>{co.status || 'Received'}</span>
                      </div>
                      <p className="order-items">
                        {co.garment_type} {co.fabric_choice && `(${co.fabric_choice})`} {co.custom_color && `- ${co.custom_color}`}
                      </p>
                      <div className="order-card-footer">
                        <span className="order-total">Status: <strong>{co.status || 'Patterning & Stitching'}</strong></span>
                        <Link to="/contact-us" className="help-link">Need Help?</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ACCOUNT DETAILS */}
          {activeTab === 'details' && (
            <div className="tab-pane">
              <h2>Account Details</h2>
              <form onSubmit={handleProfileUpdate} className="details-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={userData.name} 
                    onChange={(e) => setUserData({...userData, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={userData.email} 
                    onChange={(e) => setUserData({...userData, email: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input 
                    type="tel" 
                    value={userData.phone} 
                    onChange={(e) => setUserData({...userData, phone: e.target.value})} 
                    required 
                  />
                </div>
                <button type="submit" className="save-btn">Save Changes</button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AccountPage;