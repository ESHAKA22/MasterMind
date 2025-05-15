import React, { createContext, useState, useEffect } from 'react';
import { login, register } from '../services/api'; // Import from api.js

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginUser = async (username, password) => {
    try {
      const response = await login({ username, password }); // Use imported login
      const { userId, username: loggedInUsername } = response.data;
      const userData = { id: userId, username: loggedInUsername };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      throw error.response.data.error || 'Login failed';
    }
  };

  const registerUser = async (username, password, email) => {
    try {
      const response = await register({ username, password, email }); // Use imported register
      const { id, username: registeredUsername } = response.data;
      const userData = { id, username: registeredUsername };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Registration error:', error.response); // Debug log
      throw error.response.data.error || 'Registration failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login: loginUser, register: registerUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);