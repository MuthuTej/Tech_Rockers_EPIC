import React, { createContext, useContext, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('layoutiq_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const loginWithGoogle = useCallback(async (credential, selectedRole = 'engineer') => {
    try {
      const { email: rawEmail, name, picture } = jwtDecode(credential);
      const email = rawEmail.trim().toLowerCase();

      // 1. Set user immediately from JWT so navigation doesn't block
      const initials = name
        ? name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
        : email.substring(0, 2).toUpperCase();

      const optimistic = { id: email, name, email, role: selectedRole, initials, picture: picture || '' };
      localStorage.setItem('layoutiq_user', JSON.stringify(optimistic));
      localStorage.setItem('layoutiq_credential', credential);
      setUser(optimistic);

      // 2. Sync with backend — creates user if new, returns confirmed role
      const { data } = await api.post('/auth/google', { email, name, picture, role: selectedRole });
      const synced = {
        id:       data.email,
        name:     data.name,
        email:    data.email,
        role:     data.role,
        initials: data.initials,
        picture:  data.picture || '',
      };
      localStorage.setItem('layoutiq_user', JSON.stringify(synced));
      setUser(synced);
    } catch (err) {
      console.error('Login error:', err);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('layoutiq_user');
    localStorage.removeItem('layoutiq_credential');
  }, []);

  return (
    <AuthContext.Provider value={{ user, role: user?.role ?? null, isAuthenticated: !!user, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
