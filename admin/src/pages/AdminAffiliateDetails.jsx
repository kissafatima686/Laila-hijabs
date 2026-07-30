import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const AdminAffiliateDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/affiliate-details/${id}`)
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="page-wrapper"><p>Loading Affiliate Data...</p></div>;
  if (!data || data.error) return <div className="page-wrapper"><p>Error loading affiliate data.</p></div>;

  const { affiliate, stats, commissions, clicks } = data;

  return (
    <div className="page-wrapper">
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div>
          <Link to="/approved-affiliates" style={{ color: '#F2EBDF', textDecoration: 'none', fontSize: '14px', marginBottom: '10px', display: 'inline-block' }}>
            &larr; Back to Approved Affiliates
          </Link>
          <h1 className="page-title">{affiliate.full_name}'s Affiliate Dashboard</h1>
          <p className="page-desc" style={{ marginTop: '5px' }}>Code: <strong>{affiliate.affiliate_code}</strong> | Status: <span className={`status-pill ${affiliate.status.toLowerCase()}`}>{affiliate.status}</span></p>
          <p className="page-desc" style={{ marginTop: '5px' }}>Link: <a href={affiliate.affiliate_link} target="_blank" rel="noreferrer" style={{color: '#93A96C'}}>{affiliate.affiliate_link}</a></p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ backgroundColor: '#2B3322', padding: '20px', borderRadius: '8px', border: '1px solid rgba(242, 235, 223, 0.1)' }}>
          <h3 style={{ fontSize: '14px', color: 'rgba(242, 235, 223, 0.6)', margin: '0 0 10px 0' }}>Total Clicks</h3>
          <p style={{ fontSize: '32px', margin: 0 }}>{stats.totalClicks}</p>
        </div>
        <div style={{ backgroundColor: '#2B3322', padding: '20px', borderRadius: '8px', border: '1px solid rgba(242, 235, 223, 0.1)' }}>
          <h3 style={{ fontSize: '14px', color: 'rgba(242, 235, 223, 0.6)', margin: '0 0 10px 0' }}>Total Orders</h3>
          <p style={{ fontSize: '32px', margin: 0 }}>{stats.totalOrders}</p>
        </div>
        <div style={{ backgroundColor: '#2B3322', padding: '20px', borderRadius: '8px', border: '1px solid rgba(242, 235, 223, 0.1)' }}>
          <h3 style={{ fontSize: '14px', color: 'rgba(242, 235, 223, 0.6)', margin: '0 0 10px 0' }}>Pending Commission</h3>
          <p style={{ fontSize: '32px', margin: 0 }}>Rs. {stats.pendingCommission.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: '#2B3322', padding: '20px', borderRadius: '8px', border: '1px solid rgba(242, 235, 223, 0.1)' }}>
          <h3 style={{ fontSize: '14px', color: 'rgba(242, 235, 223, 0.6)', margin: '0 0 10px 0' }}>Paid Commission</h3>
          <p style={{ fontSize: '32px', margin: 0 }}>Rs. {stats.paidCommission.toLocaleString()}</p>
        </div>
      </div>

      <div className="table-container" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', padding: '20px 24px', margin: 0, borderBottom: '1px solid rgba(242,235,223,0.1)' }}>Recent Commissions (Orders)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', color: '#F2EBDF' }}>
          <thead>
            <tr style={{ backgroundColor: '#2B3322', borderBottom: '1px solid rgba(184, 147, 91, 0.2)' }}>
              <th style={{ padding: '14px 20px', fontWeight: '600', color: '#B8935B' }}>Order ID</th>
              <th style={{ padding: '14px 20px', fontWeight: '600', color: '#B8935B' }}>Sale Amount</th>
              <th style={{ padding: '14px 20px', fontWeight: '600', color: '#B8935B' }}>Commission Rate</th>
              <th style={{ padding: '14px 20px', fontWeight: '600', color: '#B8935B' }}>Commission Amount</th>
              <th style={{ padding: '14px 20px', fontWeight: '600', color: '#B8935B' }}>Status</th>
              <th style={{ padding: '14px 20px', fontWeight: '600', color: '#B8935B' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {commissions.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center', opacity: 0.5}}>No commissions recorded yet.</td></tr>
            ) : (
              commissions.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(242, 235, 223, 0.05)', backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(43, 51, 34, 0.3)' }}>
                  <td style={{ padding: '14px 20px' }}>#{c.order_id}</td>
                  <td style={{ padding: '14px 20px' }}>Rs. {c.sale_amount}</td>
                  <td style={{ padding: '14px 20px' }}>{c.commission_rate}%</td>
                  <td style={{ padding: '14px 20px' }}>Rs. {c.commission_amount}</td>
                  <td style={{ padding: '14px 20px' }}><span className={`status-pill ${c.status.toLowerCase()}`}>{c.status}</span></td>
                  <td style={{ padding: '14px 20px' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-container">
        <h2 style={{ fontSize: '18px', padding: '20px 24px', margin: 0, borderBottom: '1px solid rgba(242,235,223,0.1)' }}>Recent Click Tracking (Cookies)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', color: '#F2EBDF' }}>
          <thead>
            <tr style={{ backgroundColor: '#2B3322', borderBottom: '1px solid rgba(184, 147, 91, 0.2)' }}>
              <th style={{ padding: '14px 20px', fontWeight: '600', color: '#B8935B' }}>IP Address</th>
              <th style={{ padding: '14px 20px', fontWeight: '600', color: '#B8935B' }}>Browser / Device</th>
              <th style={{ padding: '14px 20px', fontWeight: '600', color: '#B8935B' }}>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {clicks.length === 0 ? (
              <tr><td colSpan="3" style={{textAlign: 'center', opacity: 0.5}}>No clicks recorded yet.</td></tr>
            ) : (
              clicks.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(242, 235, 223, 0.05)', backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(43, 51, 34, 0.3)' }}>
                  <td style={{ padding: '14px 20px' }}>{c.ip_address}</td>
                  <td style={{ padding: '14px 20px' }}>{c.browser}</td>
                  <td style={{ padding: '14px 20px' }}>{new Date(c.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAffiliateDetails;
