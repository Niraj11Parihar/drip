import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, email, phone, address }
  const [authLoading, setAuthLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dx_user');
      if (saved) setUser(JSON.parse(saved));
    } catch (_) {}
    setAuthLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    // Strip password before storing
    const { password: _, ...safeUser } = data.user;
    setUser(safeUser);
    localStorage.setItem('dx_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const register = async (name, email, phone, password) => {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    const { password: _, ...safeUser } = data.user;
    setUser(safeUser);
    localStorage.setItem('dx_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dx_user');
  };

  // Update locally cached profile (after order, etc.)
  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('dx_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
