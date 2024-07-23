import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/auth-status')
      .then(response => {
        setIsAuthenticated(response.data.isAuthenticated);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (credentials) => {
    return axios.post('/api/login', credentials)
      .then(response => {
        setIsAuthenticated(true);
      });
  };

  const logout = () => {
    return axios.post('/api/logout')
      .then(() => {
        setIsAuthenticated(false);
      });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };