import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  const { token } = useAuth();
  const storedToken = token || localStorage.getItem('adminToken') || localStorage.getItem('token');

  if (!storedToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#F6F1E3',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: '#3E4930'
    }}>
      <Sidebar />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      }}>
        <Header />
        <main style={{
          flex: 1,
          padding: '24px 28px',
          overflowY: 'auto',
          boxSizing: 'border-box'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
