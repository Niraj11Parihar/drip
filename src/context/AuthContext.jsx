import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, email, phone, address }
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('dx_user');
      const savedToken = localStorage.getItem('dx_token');
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedToken) setToken(savedToken);
    } catch (_) {}
    setAuthLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('dx_user', JSON.stringify(data.user));
    localStorage.setItem('dx_token', data.token);
    return data.user;
  };

  const register = async (name, email, phone, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('dx_user', JSON.stringify(data.user));
    localStorage.setItem('dx_token', data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dx_user');
    localStorage.removeItem('dx_token');
  };

  // Update locally cached profile (after order, etc.)
  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('dx_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, authLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
