import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Icon SVG ─────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);

const PAGE_ICONS = {
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  products: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
  blogs: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z',
  offers: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  affiliates: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  custom: 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
  location: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z',
  contact: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  global: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'
};

const PAGE_COLORS = {
  'Home Page': '#B8935B',
  'Products': '#22c55e',
  'Blogs': '#60a5fa',
  'Offers & Discounts': '#f59e0b',
  'Affiliate Program': '#a78bfa',
  'Custom Orders': '#fb923c',
  'Locations': '#34d399',
  'Contact': '#f87171',
  'Users & Admin': '#e879f9',
  'Global Content': '#94a3b8'
};

const KPI = ({ label, value, sub, icon, color = '#B8935B', onClick }) => (
  <div onClick={onClick} style={{
    backgroundColor: '#222C1A', borderRadius: '14px', padding: '20px 22px',
    border: `1px solid ${color}40`, cursor: onClick ? 'pointer' : 'default',
    display: 'flex', alignItems: 'center', gap: '16px',
    transition: 'all 0.2s ease', boxShadow: `0 4px 20px ${color}10`
  }}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.borderColor = color; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}40`; }}
  >
    <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Ico d={icon} size={20} color={color} />
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: '26px', fontWeight: '800', color: '#F6F1E3', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: '12px', fontWeight: '600', color: '#B8A99A', marginTop: '2px' }}>{label}</div>
      {sub && <div style={{ fontSize: '11px', color, marginTop: '2px', fontWeight: '600' }}>{sub}</div>}
    </div>
  </div>
);

const PageGroupCard = ({ group, navigate }) => {
  const [expanded, setExpanded] = useState(false);
  const color = PAGE_COLORS[group.page] || '#B8935B';
  const icon = PAGE_ICONS[group.icon] || PAGE_ICONS.global;

  return (
    <div style={{ backgroundColor: '#222C1A', borderRadius: '14px', border: `1px solid ${color}30`, overflow: 'hidden', transition: 'border-color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${color}70`}
      onMouseLeave={e => e.currentTarget.style.borderColor = `${color}30`}
    >
      {/* Header */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 18px', cursor: 'pointer', backgroundColor: `${color}08` }}
      >
        <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Ico d={icon} size={16} color={color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#F6F1E3' }}>{group.page}</div>
          <div style={{ fontSize: '11px', color: '#B8A99A', marginTop: '1px' }}>{group.modules.length} module{group.modules.length !== 1 ? 's' : ''} · {group.total} total records</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px', fontWeight: '800', color }}>{group.total}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8A99A" strokeWidth="2.5" strokeLinecap="round" style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Module rows */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${color}20` }}>
          {group.modules.map((m, i) => (
            <div
              key={m.table}
              onClick={() => navigate(m.route)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 18px', cursor: 'pointer', borderBottom: i < group.modules.length - 1 ? '1px solid rgba(184,147,91,0.08)' : 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(184,147,91,0.05)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#E7D9C9' }}>{m.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Progress bar */}
                <div style={{ width: '80px', height: '4px', borderRadius: '4px', backgroundColor: 'rgba(184,147,91,0.15)', overflow: 'hidden' }}>
                  <div style={{ width: `${m.pct}%`, height: '100%', backgroundColor: color, borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '12px', color, fontWeight: '700', minWidth: '28px', textAlign: 'right' }}>{m.total}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8A99A" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          ))}
          <div
            onClick={() => navigate(group.route)}
            style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', borderTop: `1px solid ${color}20`, fontSize: '12px', fontWeight: '700', color }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            Manage {group.page}
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchStats = () => {
    setLoading(true);
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/stats')
      .then(r => r.json())
      .then(d => {
        setStats(d);
        setLastUpdated(new Date().toLocaleString('en-PK', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }));
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStats(); }, []);

  const s = stats || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>

      {/* ─── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 60%, #1A2010 100%)', borderRadius: '18px', padding: '28px 32px', border: '1px solid #B8935B', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '2px', marginBottom: '6px' }}>LAILA HIJABS ADMIN</div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#F6F1E3' }}>Site Dashboard</h1>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Live stats for every page, module, and content section.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {lastUpdated && <span style={{ fontSize: '11px', color: '#B8A99A' }}>Updated {lastUpdated}</span>}
          <button onClick={fetchStats} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* ─── Top KPI Row ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
        <KPI label="Total Records" value={loading ? '—' : (s.totalEntries ?? 0)} sub="Across all modules" icon="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" color="#B8935B" />
        <KPI label="Total Orders" value={loading ? '—' : (s.totalOrders ?? 0)} sub={s.pendingOrders ? `${s.pendingOrders} pending` : 'All orders'} icon="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2" color="#22c55e" onClick={() => navigate('/orders')} />
        <KPI label="Revenue (Delivered)" value={loading ? '—' : `Rs. ${(s.totalRevenue ?? 0).toLocaleString()}`} sub="Shipped + Delivered" icon="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" color="#f59e0b" />
        <KPI label="Unread Messages" value={loading ? '—' : (s.contactMessages ?? 0)} sub="Contact inbox" icon="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" color="#f87171" onClick={() => navigate('/messages')} />
        <KPI label="Site Sections" value={loading ? '—' : (s.totalSections ?? 0)} sub="CMS content blocks" icon="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" color="#60a5fa" onClick={() => navigate('/sections/navbar_settings')} />
        <KPI label="Active Content" value={loading ? '—' : (s.liveEntries ?? 0)} sub={`${s.draftEntries ?? 0} in draft`} icon="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" color="#34d399" />
      </div>

      {/* ─── Content at a Glance (quick stat row) ────────────────────────────── */}
      {!loading && stats?.modules && (
        <div style={{ backgroundColor: '#222C1A', borderRadius: '14px', padding: '20px 24px', border: '1px solid rgba(184,147,91,0.25)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.5px', marginBottom: '16px', textTransform: 'uppercase' }}>
            Content At a Glance
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {stats.modules.filter(m => m.total > 0).map(m => (
              <div
                key={m.id}
                onClick={() => navigate(m.route)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 14px', borderRadius: '20px', border: '1px solid rgba(184,147,91,0.25)', cursor: 'pointer', backgroundColor: '#182012', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#B8935B'; e.currentTarget.style.backgroundColor = '#3E4930'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(184,147,91,0.25)'; e.currentTarget.style.backgroundColor = '#182012'; }}
              >
                <span style={{ fontSize: '12px', color: '#E7D9C9', fontWeight: '600' }}>{m.title}</span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#B8935B' }}>{m.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Per-Page Group Stats ─────────────────────────────────────────────── */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.5px', marginBottom: '14px', textTransform: 'uppercase' }}>
          Stats By Page — Click to Expand
        </div>

        {loading ? (
          <div style={{ backgroundColor: '#222C1A', borderRadius: '14px', padding: '60px', textAlign: 'center', color: '#E7D9C9', border: '1px solid rgba(184,147,91,0.2)' }}>
            <div style={{ fontSize: '14px' }}>Loading site stats...</div>
          </div>
        ) : stats?.pageGroups ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
            {stats.pageGroups.map(group => (
              <PageGroupCard key={group.page} group={group} navigate={navigate} />
            ))}
          </div>
        ) : (
          <div style={{ backgroundColor: '#222C1A', borderRadius: '14px', padding: '40px', textAlign: 'center', border: '1px solid rgba(184,147,91,0.2)' }}>
            <div style={{ fontSize: '13px', color: '#B8A99A', marginBottom: '12px' }}>Could not load stats from backend.</div>
            <div style={{ fontSize: '12px', color: '#B8A99A' }}>Make sure your server is running at <code style={{ color: '#B8935B' }}>localhost:5000</code></div>
          </div>
        )}
      </div>

      {/* ─── Quick Actions ────────────────────────────────────────────────────── */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#B8935B', letterSpacing: '1.5px', marginBottom: '14px', textTransform: 'uppercase' }}>
          Quick Actions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
          {[
            { label: 'Add Product', route: '/products', icon: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z', color: '#22c55e' },
            { label: 'Add Blog Post', route: '/blogs', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20', color: '#60a5fa' },
            { label: 'View Orders', route: '/orders', icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10', color: '#f59e0b' },
            { label: 'Edit Navbar', route: '/sections/navbar_settings', icon: 'M3 12h18M3 6h18M3 18h18', color: '#B8935B' },
            { label: 'Edit Footer', route: '/sections/footer_settings', icon: 'M3 5v14M21 5v14M3 12h18', color: '#B8935B' },
            { label: 'Contact Inbox', route: '/messages', icon: 'M4 4h16c1.1 0 2 .9 2 2v12', color: '#f87171' },
            { label: 'Testimonials', route: '/testimonials', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5', color: '#a78bfa' },
            { label: 'Size Guide', route: '/size-guide', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4', color: '#34d399' },
            { label: 'Manage FAQs', route: '/faqs', icon: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01', color: '#fb923c' },
            { label: 'Location Page', route: '/sections/location_visit_us_section', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', color: '#34d399' },
          ].map(a => (
            <div
              key={a.route}
              onClick={() => navigate(a.route)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', backgroundColor: '#222C1A', border: `1px solid ${a.color}30`, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3E4930'; e.currentTarget.style.borderColor = a.color; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#222C1A'; e.currentTarget.style.borderColor = `${a.color}30`; }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Ico d={a.icon} size={14} color={a.color} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#E7D9C9' }}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
