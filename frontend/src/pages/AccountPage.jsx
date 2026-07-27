import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AccountPage.css';
import { 
  IoCubeOutline, 
  IoLocationOutline, 
  IoSettingsOutline, 
  IoLogOutOutline 
} from 'react-icons/io5';

const AccountPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  // Input states for Login/Register
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Sample user profile data
  const [userData, setUserData] = useState({
    name: "ADMIN",
    email: "admin@example.com",
    phone: "+92 323 8399480"
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      isDefault: true,
      name: "ADMIN",
      street: "123 Street Name, Apartment, Suite",
      city: "Islamabad, Pakistan",
      phone: "+92 323 8399480"
    }
  ]);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ name: '', street: '', city: '', phone: '' });

  // Sample order history in PKR
  const orders = [
    {
      id: "LH-849201",
      date: "18 July, 2026",
      total: "Rs. 25,400",
      status: "Processing",
      items: "LAMIA OPEN KAFTAN SET (x1), PLEATED SATIN ABAYA (x2)"
    },
    {
      id: "LH-392011",
      date: "10 May, 2026",
      total: "Rs. 8,500",
      status: "Delivered",
      items: "PLEATED SATIN ABAYA (x1)"
    }
  ];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      setUserData(prev => ({
        ...prev,
        email: loginEmail,
        name: loginEmail.split('@')[0].toUpperCase()
      }));
      setIsLoggedIn(true);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (regName && regEmail && regPassword) {
      setUserData({
        name: regName,
        email: regEmail,
        phone: "+92 323 8399480"
      });
      // After signing up, switch tab to Sign In form so the user logs in
      setIsRegister(false);
      setLoginEmail(regEmail);
      alert("Registration successful! Please Sign In with your credentials.");
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

  return (
    <div className="account-container">
      <div className="account-header">
        <h1>My Account</h1>
        <p>Welcome back, <strong>{userData.name}</strong></p>
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
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <IoSettingsOutline size={18} /> Account Details
          </button>
          
          <button 
            className="tab-btn logout-btn"
            onClick={() => setIsLoggedIn(false)}
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
              {orders.length === 0 ? (
                <p className="empty-text">You haven't placed any orders yet.</p>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-card-header">
                        <div>
                          <span className="order-id">#{order.id}</span>
                          <span className="order-date">{order.date}</span>
                        </div>
                        <span className={`order-status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="order-items">{order.items}</p>
                      <div className="order-card-footer">
                        <span className="order-total">Total: <strong>{order.total}</strong></span>
                        <Link to="/contact-us" className="help-link">Need Help?</Link>
                      </div>
                    </div>
                  ))}
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
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingAddressId !== null) {
                      setAddresses(addresses.map(a => a.id === editingAddressId ? { ...addressForm, id: a.id, isDefault: a.isDefault } : a));
                    } else {
                      setAddresses([...addresses, { ...addressForm, id: Date.now(), isDefault: addresses.length === 0 }]);
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

          {/* TAB 3: ACCOUNT DETAILS */}
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