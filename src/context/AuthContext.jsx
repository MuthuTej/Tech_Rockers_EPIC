import React, { createContext, useContext, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const loginWithGoogle = useCallback(async (credential) => {
    try {
      const decoded = jwtDecode(credential);
      const email = decoded.email;
      const name = decoded.name;
      const picture = decoded.picture;
      
      const { default: api } = await import('../api/client');
      const response = await api.post('/users/auth', { email, name, picture });
      setUser(response.data);
    } catch (err) {
      console.error('Failed to authenticate with backend', err);
    }
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = {
    user,
    role: user ? user.role : null,
    isAuthenticated: !!user,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
