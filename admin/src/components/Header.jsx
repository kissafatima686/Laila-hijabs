import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/dashboard': return 'Dashboard';
      case '/users': return 'Users Management';
      case '/sliders': return 'Sliders Management';
      case '/services': return 'Services Management';
      case '/sub-services': return 'Sub Services Management';
      case '/projects': return 'Projects Management';
      case '/team': return 'Team Members Management';
      case '/testimonials': return 'Testimonials Management';
      case '/blogs': return 'Blogs Management';
      default: return 'Dashboard';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#182012',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      borderBottom: '1px solid rgba(184, 147, 91, 0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      {/* Page Title */}
      <h1 style={{
        fontSize: '18px',
        fontWeight: '700',
        color: '#F6F1E3',
        margin: 0
      }}>
        {getPageTitle(location.pathname)}
      </h1>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          padding: '8px 20px',
          borderRadius: '8px',
          backgroundColor: '#3E4930',
          border: '1px solid #B8935B',
          color: '#F6F1E3',
          fontSize: '13px',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#B8935B'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#3E4930'}
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
