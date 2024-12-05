import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import SignUp from './Components/SignUp/SignUp'; // Assuming you created this component
import Home from './Components/Home/Home'; // Assuming you created this component
import Admin from './Components/Admin/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin-login" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
