import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth';
import { ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = authService.getStoredUser();
    const token = authService.getToken();

    if (storedUser && token) {
      setUser(storedUser);
      setIsAuthenticated(true);
      // Verify token is still valid
      authService.getMe()
        .then((response) => {
          if (response.success) {
            setUser(response.data);
            localStorage.setItem('user_data', JSON.stringify(response.data));
          }
        })
        .catch(() => {
          // Token invalid, logout
          authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (role) => {
    if (!user) return false;
    return user.roles?.some((r) => r.name === role);
  };

  const isAdmin = () => hasRole(ROLES.ADMIN);

  const value = {
    user,
    loading,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;

