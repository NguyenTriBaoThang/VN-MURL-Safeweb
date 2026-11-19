import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../types';
import { loginApi, getMeApi } from '../api/client';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  quickLogin: (role: 'Admin' | 'User') => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem('safeweb_user');
    const token = localStorage.getItem('safeweb_token');
    if (savedUser && token) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('safeweb_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await getMeApi();
      if (res.isAuthenticated && res.username && res.role) {
        const updatedUser: AuthUser = {
          username: res.username,
          role: res.role,
          token,
        };
        setUser(updatedUser);
        localStorage.setItem('safeweb_user', JSON.stringify(updatedUser));
      } else {
        localStorage.removeItem('safeweb_token');
        localStorage.removeItem('safeweb_user');
        setUser(null);
      }
    } catch {
      // Keep existing user if network is temporarily down, or retain session
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await loginApi(username, password);
      const authUser: AuthUser = {
        username: res.username,
        role: res.role,
        token: res.token,
      };
      localStorage.setItem('safeweb_token', res.token);
      localStorage.setItem('safeweb_user', JSON.stringify(authUser));
      setUser(authUser);
      return { success: true, role: res.role };
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Đăng nhập không thành công.';
      return { success: false, error: msg };
    }
  };

  const quickLogin = async (role: 'Admin' | 'User') => {
    if (role === 'Admin') {
      const res = await login('admin', 'Admin@123');
      return res.success;
    } else {
      const res = await login('user', 'User@123');
      return res.success;
    }
  };

  const logout = () => {
    localStorage.removeItem('safeweb_token');
    localStorage.removeItem('safeweb_user');
    setUser(null);
  };

  const isAuthenticated = !!user && !!localStorage.getItem('safeweb_token');
  const isAdmin = isAuthenticated && user?.role === 'Admin';
  const isUser = isAuthenticated && user?.role === 'User';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isUser,
        loading,
        login,
        quickLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
