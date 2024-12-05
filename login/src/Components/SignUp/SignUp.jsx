import React, { useState } from 'react';
import { AuthService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username || !email || !password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

      try {
        const registrationData  = formData;
        const response = await AuthService.register(registrationData);

        // Clear form
        setFormData({
          username: '',
          email: '',
          password: ''
        });
      } catch (error) {
        console.error("Registration Error:", error.response || error.message);
      }    
  };  

  return (
    <div className="container">
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit} className="inputs">
        <div className="input">
          <img src={user_icon} alt="" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input">
          <img src={email_icon} alt="" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="submit-container">
          <button type="submit" className={`submit ${loading ? 'loading' : ''}`}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>
      </form>
      <div className="login-link">
        Already have an account? <a href="/">Login</a>
      </div>
    </div>
  );
};

export default SignUp;
