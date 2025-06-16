import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the authentication context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To indicate initial auth check is in progress
  const navigate = useNavigate();

  // Function to check authentication status with the backend
  const checkAuthStatus = async () => {
    try {
      // Allow credentials (cookies) to be sent with the request
      const response = await fetch('/api/check_auth', { credentials: 'include' });
      const data = await response.json();
      if (data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser({ username: data.username });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Run checkAuthStatus on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // Important: Send cookies
      });
      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setUser({ username: data.username });
        return { success: true, message: data.message };
      } else {
        setIsAuthenticated(false);
        setUser(null);
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login API error:", error);
      return { success: false, error: "Network error or server unavailable" };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include' // Important: Send cookies to clear session
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login'); // Redirect to login page after logout
        return { success: true, message: "Logged out" };
      } else {
        const data = await response.json();
        return { success: false, error: data.error || "Logout failed" };
      }
    } catch (error) {
      console.error("Logout API error:", error);
      return { success: false, error: "Network error during logout" };
    }
  };

  const authContextValue = {
    isAuthenticated,
    user,
    loading, // Expose loading state
    login,
    logout,
    checkAuthStatus // Allow components to re-check if needed
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context easily
export const useAuth = () => {
  return useContext(AuthContext);
};
