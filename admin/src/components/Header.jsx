import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = (pathname) => {
    if (pathname.includes('/products')) return 'Product Inventory';
    if (pathname.includes('/categories')) return 'Categories Manager';
    if (pathname.includes('/offers')) return 'Offers & Promotions';
    if (pathname.includes('/orders')) return 'Customer Orders';
    if (pathname.includes('/messages')) return 'Customer Form Messages';
    if (pathname.includes('/hero')) return 'Hero Sliders & Banners';
    if (pathname.includes('/affiliate')) return 'Affiliate Program';
    if (pathname.includes('/custom-orders')) return 'Custom Order Requests';
    if (pathname.includes('/blogs')) return 'Blogs & Articles';
    if (pathname.includes('/admin-users')) return 'Admin Users & Roles';
    if (pathname.includes('/settings')) return 'System Settings';
    if (pathname.includes('/footer')) return 'Footer Manager';
    return 'Dashboard Overview';
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header style={{
      height: '60px',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      margin: '16px 28px 0 28px',
      borderRadius: '12px',
      border: '1px solid #E7D9C9',
      boxShadow: '0 2px 8px rgba(62, 73, 48, 0.04)',
      position: 'sticky',
      top: '16px',
      zIndex: 90
    }}>
      {/* Page Title / Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '13px', color: '#B8935B', fontWeight: '600' }}>Admin /</span>
        <h1 style={{
          fontSize: '15px',
          fontWeight: '700',
          color: '#3E4930',
          margin: 0
        }}>
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      {/* Right Side: Profile & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            backgroundColor: '#3E4930', color: '#F6F1E3',
            border: '1.5px solid #B8935B',
            fontWeight: '700', fontSize: '13px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            A
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#3E4930' }}>Main Admin</span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '7px 16px',
            borderRadius: '6px',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#DC2626',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#FCA5A5'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#FEE2E2'}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
