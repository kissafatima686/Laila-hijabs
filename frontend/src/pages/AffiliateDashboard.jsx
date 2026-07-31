import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AccountPage.css'; // Reusing styles

const AffiliateDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const affiliateRaw = localStorage.getItem('affiliateData');
    if (!affiliateRaw) {
      navigate('/affiliate/login');
      return;
    }
    const affiliate = JSON.parse(affiliateRaw);

    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || 'http://localhost:5000') + ''}/api/affiliate/dashboard?affiliate_id=${affiliate.id}`);
        if (response.ok) {
          const data = await response.json();
          setDashboardData({ ...data, code: affiliate.code });
        }
      } catch (err) {
        console.error("Failed to load dashboard", err);
      }
    };
    fetchData();
  }, [navigate]);

  if (!dashboardData) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Dashboard...</div>;

  const refLink = `${window.location.origin}/ref/${dashboardData.code}`; // Using frontend redirect

  return (
    <div className="account-page">
      <div className="account-header">
        <h1>Affiliate Dashboard</h1>
        <button onClick={() => { localStorage.removeItem('affiliateData'); navigate('/affiliate/login'); }} className="btn-secondary">Logout</button>
      </div>
      
      <div className="account-content">
        <div className="account-sidebar">
          <ul className="account-nav">
            <li className="active">Dashboard Overview</li>
          </ul>
        </div>
        
        <div className="account-main">
          <h2>Your Referral Link</h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <input type="text" value={refLink} readOnly style={{ flex: 1, padding: '10px' }} />
            <button className="btn-primary" onClick={() => navigator.clipboard.writeText(refLink)}>Copy Link</button>
          </div>

          <h2>Performance Metrics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
              <h3>Clicks</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboardData.clicks}</p>
            </div>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
              <h3>Orders</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboardData.sales}</p>
            </div>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
              <h3>Revenue Generated</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Rs. {parseFloat(dashboardData.revenue).toLocaleString()}</p>
            </div>
          </div>

          <h2>Commission Payouts</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px', textAlign: 'center' }}>
              <h3>Pending</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Rs. {parseFloat(dashboardData.pending_commission).toLocaleString()}</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#d1e7dd', borderRadius: '8px', textAlign: 'center' }}>
              <h3>Approved</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Rs. {parseFloat(dashboardData.approved_commission).toLocaleString()}</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#cff4fc', borderRadius: '8px', textAlign: 'center' }}>
              <h3>Paid Out</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Rs. {parseFloat(dashboardData.paid_commission).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
