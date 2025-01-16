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
  profilePicture?: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  isAuthenticated: boolean;
  userData: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  updateUserData: (newData: Partial<UserData>) => void;
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
        email: data.email,
        profilePicture: data.profilePicture,
        role: data.role,
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
      if (!response.token) {
        throw new Error('No token received from server');
      }
      
      localStorage.setItem('token', response.token);
      
      // Get user data before setting authenticated state
      const current = await getCurrentUserData();
      
      // Only set authenticated state after successfully getting user data
      setUserData({
        _id: current._id,
        firstName: current.firstName,
        lastName: current.lastName,
        email: current.email,
        profilePicture: current.profilePicture,
        role: current.role || 'user' // Set default role if not provided
      });
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUserData(null);
      throw error;
    }
  };

  const register = async (newUser: RegisterUserData) => {
    try {
      const response = await registerUser(newUser);
      if (response.token) {
        localStorage.setItem('token', response.token);
        setIsAuthenticated(true);

        const completeUserData = await getCurrentUserData();
        setUserData({
          _id: completeUserData._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          profilePicture: completeUserData.profilePicture,
          role: completeUserData.role,
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

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData(prev => prev ? { ...prev, ...newData } : null);
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
        updateUserData
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
