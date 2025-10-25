import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      
      api.get('/auth/me')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        });
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  // Fungsi untuk login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token } = response.data;
      setToken(access_token);
      return true;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      return false;
    }
  };

  // Fungsi untuk register
  const register = async (name, email, password, password_confirmation) => {
     try {
       await api.post('/auth/register', { name, email, password, password_confirmation });
       return true;
     } catch (error) {
       console.error("Registration failed:", error.response?.data || error.message);
       return false;
     }
  };

  // Fungsi untuk logout
  const logout = () => {
    api.post('/auth/logout').catch();
    
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};