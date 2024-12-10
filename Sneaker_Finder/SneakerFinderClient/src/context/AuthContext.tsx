import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUserData } from '../services/userService';
import axios from 'axios';

interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: 'Male' | 'Female';
  birthDate: Date;
}

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userData: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
    };
    initAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setUserData(null);
      return false;
    }

    try {
      const data = await getCurrentUserData();
      setUserData({
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserData(null);
      }
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser(email, password);
      if (response.token) {
        localStorage.setItem('token', response.token);
        setIsAuthenticated(true);
        // Fetch user data after successful login
        const userData = await getCurrentUserData();
        setUserData({
          _id: userData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email
        });
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUserData(null);
      throw error;
    }
  };

  const register = async (userData: RegisterUserData) => {
    try {
      const response = await registerUser(userData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        setIsAuthenticated(true);
        // After registration, get the complete user data including _id
        const completeUserData = await getCurrentUserData();
        setUserData({
          _id: completeUserData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email
        });
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUserData(null);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userData,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}