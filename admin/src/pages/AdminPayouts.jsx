import React, { useState, useEffect } from "react";
const AdminPayouts = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPayoutsData();
  }, []);

  const fetchPayoutsData = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/admin/payouts/summary')
      .then(res => res.json())
      .then(data => {
        setAffiliates(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handlePayAll = async (affiliateId, amount) => {
    if (!window.confirm(`Are you sure you want to mark Rs. ${amount} as paid for this affiliate?`)) return;
    
    setProcessing(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/payouts/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ affiliate_id: affiliateId, amount: amount, payment_method: 'Manual Bank Transfer' })
      });
      if (res.ok) {
        alert('Payout processed successfully! Commissions marked as Paid.');
        fetchPayoutsData();
      } else {
        alert('Failed to process payout.');
      }
    } catch (err) {
      console.error(err);
      alert('Error processing payout.');
    }
    setProcessing(false);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '5px' }}>CONTENT MODULE</div>
          <h1 className="page-title">Payouts Manager</h1>
          <p className="page-desc" style={{ marginTop: '5px' }}>Calculate unpaid commissions and process payouts to your active affiliates.</p>
        </div>
      </div>

      <div className="table-container" style={{ backgroundColor: '#222C1A', borderRadius: '14px', border: '1px solid rgba(184,147,91,0.25)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '50px', textAlign: 'center', color: '#E7D9C9' }}>Loading Payouts Data...</div>
        ) : affiliates.length === 0 ? (
          <div style={{ padding: '50px', textAlign: 'center', color: '#B8A99A' }}>No affiliates with pending commissions found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#182012', borderBottom: '1px solid rgba(184,147,91,0.25)' }}>
                  <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', whiteSpace: 'nowrap' }}>Affiliate Name</th>
                  <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', whiteSpace: 'nowrap' }}>Affiliate Code</th>
                  <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', whiteSpace: 'nowrap' }}>Bank / Contact Info</th>
                  <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', whiteSpace: 'nowrap' }}>Total Pending Commission</th>
                  <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
              {affiliates.map((aff, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(184,147,91,0.1)', transition: 'background 0.12s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(184,147,91,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '13px 18px', fontSize: '13px', fontWeight: '600', color: '#F6F1E3', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 'bold' }}>{aff.full_name}</div>
                    <div style={{ fontSize: '11px', color: '#B8A99A' }}>{aff.email}</div>
                  </td>
                  <td style={{ padding: '13px 18px', fontSize: '12px', color: '#B8A99A' }}>{aff.affiliate_code}</td>
                  <td style={{ padding: '13px 18px', fontSize: '12px', color: '#B8A99A' }}>{aff.phone}</td>
                  <td style={{ padding: '13px 18px', fontSize: '14px', fontWeight: 'bold', color: '#F6F1E3' }}>
                    Rs. {aff.pending_amount ? parseFloat(aff.pending_amount).toLocaleString() : 0}
                  </td>
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handlePayAll(aff.affiliate_id, aff.pending_amount)}
                        disabled={!aff.pending_amount || parseFloat(aff.pending_amount) <= 0 || processing}
                        style={{ 
                          padding: '7px 12px', 
                          borderRadius: '6px', 
                          backgroundColor: (aff.pending_amount && parseFloat(aff.pending_amount) > 0) ? '#3E4930' : 'rgba(255,255,255,0.05)', 
                          color: (aff.pending_amount && parseFloat(aff.pending_amount) > 0) ? '#F6F1E3' : '#888', 
                          border: (aff.pending_amount && parseFloat(aff.pending_amount) > 0) ? '1px solid #B8935B' : '1px solid rgba(255,255,255,0.1)', 
                          fontSize: '12px',
                          cursor: (aff.pending_amount && parseFloat(aff.pending_amount) > 0) ? 'pointer' : 'not-allowed',
                          opacity: processing ? 0.7 : 1
                        }}
                      >
                        Mark as Paid
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayouts;
