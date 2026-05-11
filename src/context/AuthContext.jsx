import React, { createContext, useContext, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const loginWithGoogle = useCallback((credential) => {
    try {
      const decoded = jwtDecode(credential);
      const email = decoded.email;
      const name = decoded.name;
      const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
      
      const managerMail = import.meta.env.managerMail;
      const role = email === managerMail ? 'manager' : 'engineer';
      
      setUser({
        id: email,
        name: name || email,
        email: email,
        role: role,
        initials: initials,
        picture: decoded.picture
      });
    } catch (err) {
      console.error('Failed to decode Google credential', err);
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
