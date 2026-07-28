import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);

  const login = async (email, password) => {
    if (email === 'admin@lailahijabs.com' && password === 'admin123') {
      const mockToken = 'mock-jwt-token-laila-admin';
      localStorage.setItem('adminToken', mockToken);
      setToken(mockToken);
      return true;
    }
    throw new Error('Invalid email or password');
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}