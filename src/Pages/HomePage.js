import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleCreateUser = () => {
    navigate('/create-user');
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center mb-4">
        <h1 className="display-4 mb-3">Test Bank, Incorporated</h1>
        <p className="lead">Your trusted partner in financial management.</p>
      </div>
      <div className="d-flex flex-column align-items-center">
        <button className="btn btn-primary btn-lg mb-3" onClick={handleLogin}>Login</button>
        <button className="btn btn-success btn-lg" onClick={handleCreateUser}>Create User</button>
      </div>
    </div>
  );
};

export default HomePage;
