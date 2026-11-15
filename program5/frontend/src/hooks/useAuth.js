import { useState, useEffect, useContext, createContext } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authToken) {
      try {
        const decoded = jwtDecode(authToken);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ id: decoded.id, email: decoded.email, username: decoded.username });
        } else {
          logout();
        }
      } catch (e) {
        console.error("Error decoding token", e);
        logout();
      }
    }
    setLoading(false);
  }, [authToken]);

  const login = async (email, password) => {
    try {
      const response = await apiLogin({ email, password });
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      setAuthToken(token);
      const decoded = jwtDecode(token);
      setUser({ id: decoded.id, email: decoded.email, username: decoded.username });
      return { success: true };
    } catch (error) {
      console.error("Login failed", error);
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await apiRegister({ username, email, password });
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      setAuthToken(token);
      const decoded = jwtDecode(token);
      setUser({ id: decoded.id, email: decoded.email, username: decoded.username });
      return { success: true };
    } catch (error) {
      console.error("Registration failed", error);
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setUser(null);
  };

  const value = { user, authToken, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
