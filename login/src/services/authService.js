import axios from 'axios';
import CryptoJS from 'crypto-js'; // Corrected the naming convention

export class AuthService {
  // Transit key for encryption
  static TRANSIT_KEY = process.env.REACT_APP_TRANSIT_KEY || 'defaultTransitKey';

  // Base API URL
  static API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Axios instance with default config
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
                password: '[REDACTED]',
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
      if (!this.TRANSIT_KEY) {
        throw new Error('Configuration error: TRANSIT_KEY is missing');
      }

      // Validate required fields
      const requiredFields = ['username', 'email', 'password'];
      for (const field of requiredFields) {
        if (!userData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Hash password before sending
      const securePassword = this.securePasswordForTransit(userData.password);

      const response = await this.axiosInstance.post('/api/auth/register', {
        ...userData,
        password: securePassword,
      });

      return response.data;
    } catch (error) {
      // Handle Axios errors
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          'Registration failed';

        if (error.response.status === 409) {
          throw new Error('Email already exists');
        } else if (error.response.status === 400) {
          throw new Error(errorMessage);
        } else {
          throw new Error(`Registration failed: ${errorMessage}`);
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
  }
}
