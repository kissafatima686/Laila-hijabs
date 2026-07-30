import React, { useState, useEffect } from 'react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' };
const cardStyle = { backgroundColor: '#222C1A', borderRadius: '16px', padding: '24px', border: '1px solid rgba(184,147,91,0.3)' };
const btnPrimary = { padding: '10px 20px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnGhost = { padding: '7px 14px', borderRadius: '6px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer' };
const btnDanger = { padding: '7px 12px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', fontSize: '12px', cursor: 'pointer' };

const STATUS_COLORS = { 
  'Live': { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' }, 
  'Approved': { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' }, 
  'Rejected': { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' }, 
  'Pending': { color: '#F6F1E3', bg: 'rgba(184,147,91,0.1)', border: 'rgba(184,147,91,0.3)' }, 
  'Draft': { color: '#B8A99A', bg: 'rgba(184,147,91,0.05)', border: 'rgba(184,147,91,0.2)' } 
};

const ProductReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRating, setFilterRating] = useState('All');

  const fetch_ = () => {
    setLoading(true);
    fetch(`${API}/module/reviews`).then(r => r.json()).then(d => setReviews(Array.isArray(d) ? d : [])).catch(() => setReviews([])).finally(() => setLoading(false));
  };
  useEffect(() => { fetch_(); }, []);

  const handleStatus = (id, status) => {
    fetch(`${API}/module/reviews/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }).then(fetch_);
  };
  const handleDelete = (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    fetch(`${API}/module/reviews/${id}`, { method: 'DELETE' }).then(fetch_);
  };

  const filtered = reviews.filter(r => {
    const matchSearch = (r.reviewer_name || '').toLowerCase().includes(search.toLowerCase()) || (r.comment || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || 
      (filterStatus === 'Approved' ? (r.status === 'Approved' || r.status === 'Live') : 
       filterStatus === 'Rejected' ? (r.status === 'Rejected' || r.status === 'Draft' || r.status === 'Inactive') : 
       r.status === filterStatus);
    const matchRating = filterRating === 'All' || r.rating === parseInt(filterRating);
    return matchSearch && matchStatus && matchRating;
  });

  const avgRating = filtered.length ? (filtered.reduce((s, r) => s + (r.rating || 0), 0) / filtered.length).toFixed(1) : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', border: '1px solid #B8935B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '6px' }}>PRODUCTS & COMMENTS</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>Customer Reviews & Comments</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>Control, approve, or reject customer review comments before they appear on the store.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#B8935B' }}>{avgRating}</div>
            <div style={{ fontSize: '11px', color: '#E7D9C9' }}>Avg Rating</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#F6F1E3' }}>{filtered.length}</div>
            <div style={{ fontSize: '11px', color: '#E7D9C9' }}>Reviews</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="text" placeholder="Search reviews..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: '260px' }} />
        <select value={filterRating} onChange={e => setFilterRating(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
          <option value="All">All Ratings</option>
          {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n} Star)</option>)}
        </select>
        {['All', 'Approved', 'Rejected', 'Pending'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '8px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', border: filterStatus === s ? '1px solid #B8935B' : '1px solid rgba(184,147,91,0.3)', backgroundColor: filterStatus === s ? '#B8935B' : 'transparent', color: filterStatus === s ? '#1A2010' : '#E7D9C9' }}>{s}</button>
        ))}
      </div>

      {/* Table */}
      <div style={cardStyle}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#E7D9C9' }}>Loading reviews...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#182012', borderBottom: '1px solid rgba(184,147,91,0.3)' }}>
                  {['Reviewer', 'Rating', 'Title', 'Review Comment', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '1px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#B8A99A' }}>No reviews found under status '{filterStatus}'.</td></tr>
                ) : filtered.map(r => {
                  const sc = STATUS_COLORS[r.status] || STATUS_COLORS['Draft'];
                  const isApproved = r.status === 'Approved' || r.status === 'Live';
                  const isRejected = r.status === 'Rejected' || r.status === 'Draft' || r.status === 'Inactive';
                  return (
                    <tr key={r.review_id} style={{ borderBottom: '1px solid rgba(184,147,91,0.1)' }}>
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#F6F1E3', whiteSpace: 'nowrap' }}>{r.reviewer_name}</td>
                      <td style={{ padding: '14px 16px', color: '#B8935B', whiteSpace: 'nowrap' }}>{'★'.repeat(r.rating || 0)}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#E7D9C9', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title || '—'}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#E7D9C9', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.comment}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', fontWeight: '700', color: sc.color, backgroundColor: sc.bg, border: `1px solid ${sc.border}` }}>
                          {isApproved ? 'Approved' : isRejected ? 'Rejected' : (r.status || 'Pending')}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: '#B8A99A', whiteSpace: 'nowrap' }}>{r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            onClick={() => handleStatus(r.review_id, 'Approved')} 
                            style={{ 
                              ...btnGhost, 
                              backgroundColor: isApproved ? '#3E4930' : 'transparent', 
                              borderColor: isApproved ? '#B8935B' : 'rgba(34,197,94,0.4)',
                              color: isApproved ? '#F6F1E3' : '#22c55e',
                              fontWeight: '700'
                            }}
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleStatus(r.review_id, 'Rejected')} 
                            style={{ 
                              ...btnDanger, 
                              backgroundColor: isRejected ? 'rgba(239,68,68,0.25)' : 'transparent', 
                              borderColor: 'rgba(239,68,68,0.4)',
                              color: '#EF4444',
                              fontWeight: '700'
                            }}
                          >
                            Reject
                          </button>
                          <button onClick={() => handleDelete(r.review_id)} style={btnDanger} title="Delete">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviewsPage;
