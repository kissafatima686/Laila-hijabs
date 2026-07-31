import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AccountPage.css';

const AffiliateLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/affiliate/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      localStorage.setItem('affiliateData', JSON.stringify(data.affiliate));
      navigate('/affiliate/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="account-page" style={{ display: 'flex', justifyContent: 'center', padding: '100px 20px' }}>
      <div style={{ maxWidth: '400px', width: '100%', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Affiliate Login</h2>
        {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Login</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>Not an affiliate yet? <Link to="/affiliate" style={{ color: '#B8935B' }}>Apply Here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AffiliateLogin;
