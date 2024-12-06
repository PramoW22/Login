import axios from 'axios';
import CryptoJS from 'crypto-js'; // For secure encryption of sensitive data

export class AuthService {
  // Transit key for encryption
  static TRANSIT_KEY = process.env.REACT_APP_TRANSIT_KEY || 'defaultTransitKey';

  // Base API URL
  static API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Axios instance with default configuration
  static axiosInstance = (() => {
    const instance = axios.create({
      baseURL: AuthService.API_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: true, // Important for CORS if using cookies
    });

    // Request interceptor
    instance.interceptors.request.use(
      (config) => {
        console.log('Request:', {
          url: config.url,
          method: config.method,
          headers: config.headers,
          // Mask sensitive data
          data: config.data
            ? {
              ...config.data,
              password: '[REDACTED]', // Mask password in logs
            }
            : undefined,
        });
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    instance.interceptors.response.use(
      (response) => {
        console.log('Response:', {
          status: response.status,
          headers: response.headers,
          data: response.data,
        });
        return response;
      },
      (error) => {
        console.error('Response Error:', {
          message: error.message,
          response: error.response
            ? {
              status: error.response.status,
              data: error.response.data,
            }
            : null,
        });
        return Promise.reject(error);
      }
    );

    return instance;
  })();

  // Encrypt password for secure transit
  static securePasswordForTransit(password) {
    if (!this.TRANSIT_KEY) {
      throw new Error('Configuration error: TRANSIT_KEY is missing');
    }
    return CryptoJS.AES.encrypt(password, this.TRANSIT_KEY).toString();
  }

  // User registration method
  static async register(userData) {
    try {
      // Validate required fields
      const requiredFields = ['username', 'email', 'password'];
      for (const field of requiredFields) {
        if (!userData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Encrypt password before sending
      const securePassword = this.securePasswordForTransit(userData.password);

      // Make API call
      const response = await this.axiosInstance.post('/api/auth/signup', {
        ...userData,
        password: securePassword,
      });

      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Registration failed');
    }
  }

  // User login method
  static async login(credentials) {
    try {

      const requiredFields = ['email', 'password'];
      for (const field of requiredFields) {
        if (!credentials[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Encrypt password before sending
      const securePassword = this.securePasswordForTransit(credentials.password);

      const response = await this.axiosInstance.post('/api/auth/login', {
        ...credentials,
        password: securePassword,
      });

      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Login failed');
    }
  }

  // Logout method
  static async logout() {
    try {
      const response = await this.axiosInstance.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Logout failed');
    }
  }

  // Handle Axios errors
  static handleAxiosError(error, defaultMessage) {
    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        defaultMessage;

      if (error.response.status === 409) {
        throw new Error('Conflict: Data already exists');
      }
      else if (error.response.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response.status === 400) {
        throw new Error(errorMessage);
      } else {
        throw new Error(`${defaultMessage}: ${errorMessage}`);
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error(
        'Unable to reach the server. Please check your internet connection.'
      );
    } else {
      console.error('Error setting up request:', error.message);
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }

  // Check authentication status
  static async checkAuth() {
    try {
      const response = await this.axiosInstance.get('/api/auth/status');
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to check authentication status');
    }
  }

  static async adminLogin(credentials) {
    try {

      const TRANSIT_KEY = process.env.REACT_APP_TRANSIT_KEY;

      if (!credentials.username || !credentials.password) {
        throw new Error('Username and password are required');
      }

      // Encrypt password
      const securePassword = this.securePasswordForTransit(credentials.password);


      const response = await this.axiosInstance.post('/api/auth/admin-login', {
        username: credentials.username,
        password: securePassword,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (error) {
      console.error('Admin login error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }


  static async verifyOTP(username, otp) {

    try {
      const verifyResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, otp })
      });


      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.message || 'OTP verification failed');
      }

      localStorage.setItem('token', verifyData.token);
      localStorage.setItem('user', JSON.stringify(verifyData.admin));

      return verifyData;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }
  // Fetch user profile
  static async getProfile() {
    try {
      const response = await this.axiosInstance.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to fetch user profile');
    }
  }
}
