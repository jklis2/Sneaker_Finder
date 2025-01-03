import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://sneaker-finder-server-g1jq.onrender.com/api'
  : '/api';

const API_URL = `${API_BASE_URL}/users`;

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Please log in again');
  }
  return { Authorization: `Bearer ${token}` };
};

export interface ShippingAddress {
  street: string;
  number: string;
  apartmentNumber?: string;
  city: string;
  postalCode: string;
  province: string;
  phoneNumber: string;
}

export interface UserData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  shippingAddresses?: ShippingAddress[];
  profilePicture?: string;
}

interface LoginResponse {
  token: string;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: 'Male' | 'Female';
  birthDate: Date;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
    throw error;
  }
};

export const registerUser = async (userData: RegisterUserData): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to register');
    }
    throw error;
  }
};

// Get current user data
export const getCurrentUserData = async (): Promise<UserData> => {
  try {
    const headers = getAuthHeader();
    const response = await axios.get<UserData>(`${API_URL}/me`, {
      headers,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token'); // Clear invalid token
        throw new Error('Please log in again');
      }
      throw new Error(error.response?.data?.message || 'Failed to get user data');
    }
    throw error;
  }
};

// Update email
export const updateUserEmail = async (email: string): Promise<void> => {
  try {
    const headers = getAuthHeader();
    await axios.put(`${API_URL}/me/email`, { email }, {
      headers,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token'); // Clear invalid token
        throw new Error('Please log in again');
      }
      throw new Error(error.response?.data?.message || 'Failed to update email');
    }
    throw error;
  }
};

// Update password
export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const headers = getAuthHeader();
    await axios.put(
      `${API_URL}/me/password`,
      { currentPassword, newPassword },
      { headers }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token'); // Clear invalid token
        throw new Error('Please log in again');
      }
      throw new Error(error.response?.data?.message || 'Failed to update password');
    }
    throw error;
  }
};

// Get shipping addresses
export const getShippingAddresses = async (): Promise<ShippingAddress[]> => {
  try {
    const headers = getAuthHeader();
    const response = await axios.get<{ shippingAddresses: ShippingAddress[] }>(`${API_URL}/me/addresses`, {
      headers,
    });
    return response.data.shippingAddresses;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token'); // Clear invalid token
        throw new Error('Please log in again');
      }
      throw new Error(error.response?.data?.message || 'Failed to get shipping addresses');
    }
    throw error;
  }
};

// Add shipping address
export const addShippingAddress = async (
  address: ShippingAddress
): Promise<void> => {
  try {
    const headers = getAuthHeader();
    await axios.post(`${API_URL}/me/addresses`, address, {
      headers,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token'); // Clear invalid token
        throw new Error('Please log in again');
      }
      throw new Error(error.response?.data?.message || 'Failed to add shipping address');
    }
    throw error;
  }
};

// Update shipping address
export const updateShippingAddress = async (
  index: number,
  address: ShippingAddress
): Promise<void> => {
  try {
    const headers = getAuthHeader();
    await axios.put(
      `${API_URL}/me/addresses/${index}`,
      address,
      { headers }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token'); // Clear invalid token
        throw new Error('Please log in again');
      }
      throw new Error(error.response?.data?.message || 'Failed to update shipping address');
    }
    throw error;
  }
};

// Delete shipping address
export const deleteShippingAddress = async (
  index: number
): Promise<void> => {
  try {
    const headers = getAuthHeader();
    await axios.delete(`${API_URL}/me/addresses/${index}`, {
      headers,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token'); // Clear invalid token
        throw new Error('Please log in again');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete shipping address');
    }
    throw error;
  }
};
