import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize the navigate function from react-router-dom
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email && password) {
      // Simulate a login request (Replace this with API logic)
      console.log('Logging in:', { email, password });

      // Example: Assuming a successful login
      const isLoginSuccessful = true; // Change this based on your logic

      if (isLoginSuccessful) {
        setErrorMessage('');
        navigate('/home'); // Navigate to Home after successful login
      } else {
        setErrorMessage('Invalid email or password.');
      }
    } else {
      setErrorMessage('Please fill in all fields.');
    }
  };

  return (
    <div className="log-cont">
      <div className="container">
        <div className="header">
          <div className="text">Login</div>
          <div className="underline"></div>

          <form onSubmit={handleSubmit} className="inputs">
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
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="forgot-password">
              Lost Password? <span>Click Here!</span>
            </div>
            <div className="submit-container">
              <button type="submit" className="submit">
                Login
              </button>
            </div>
            <div className="register-link">
              Don't have an account? <a href="/signup">Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
