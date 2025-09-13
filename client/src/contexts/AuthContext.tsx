import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, type AuthUser } from '@/lib/apiClient';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (phone: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const currentUser = await apiClient.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);



  const login = async (phone: string, password: string) => {
    setLoading(true);
    try {
      const token = await apiClient.login(phone, password);
      setToken(token);
      
      // Fetch user data after successful login
      const user = await apiClient.getCurrentUser();
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiClient.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (name: string) => {
    if (!user) return;
    
    try {
      await apiClient.updateProfile(name);
      // Fetch updated user data after successful update
      const updatedUser = await apiClient.getCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const register = async (phone: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Register the user (returns void)
      await apiClient.register(name, phone, password);
      
      // Then log them in to get the token and user data
      await login(phone, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}