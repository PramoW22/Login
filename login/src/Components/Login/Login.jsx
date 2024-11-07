import React, { useState } from 'react';
import './Login.css';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeButton, setActiveButton] = useState('login');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (username && email && password) {
      console.log('Logging in:', { username, email, password });
      setErrorMessage('');
    } else {
      setErrorMessage('Please fill in all fields.');
    }
  };

  return (
    <div className='log-cont'>
    <div className='container'>
      <div className="header">
        <div className="text">GroceryGo</div>
        <div className="underline"></div>
      
      <form onSubmit={handleSubmit} className="inputs">
        <div className="input">
          <img src={user_icon} alt=""/>
          <input 
            type="text" 
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input">
          <img src={email_icon} alt=""/>
          <input 
            type="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt=""/>
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="forgot-password">Lost Password? <span>Click Here!</span></div>
        <div className="submit-container">
          <button
            type="button"
            className={`submit ${activeButton === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveButton('signup')}
          >
            Sign Up
          </button>
          <button
            type="submit"
            className={`submit ${activeButton === 'login' ? 'active' : ''}`}
          >
            Login
          </button>
        </div>
      </form>
    </div>
    </div>
    </div>
  );
};

export default Login;
