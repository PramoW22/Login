import React, { useState } from 'react';
import { AuthService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    otp: '',
  });
  const [loginError, setLoginError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Form validation
  const validateForm = () => {
    if (!formData.username || !formData.password) {
      setError('Username and password are required');
      return false;
    }
    if (otpSent && !formData.otp) {
      setError('OTP is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (!otpSent) {
        // Initial login request with username/password
        const response = await AuthService.adminLogin({
          username: formData.username,
          password: formData.password,
        });
          alert("OTP sent to your email");
          setOtpSent(true); // Move to OTP step
      } else {
        // OTP verification step
        const response = await AuthService.verifyOTP(
          formData.username,
          formData.otp
        );

          alert("Login successful");
          navigate("/admin-dashboard");
      }
    } catch (error) {
      setLoginError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Admin Login</h1>

      {/* Display login error */}
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {!otpSent && (
          <>
            <div>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {otpSent && (
          <div>
            <label>Enter OTP:</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Authenticating...' : otpSent ? 'Verify OTP' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
