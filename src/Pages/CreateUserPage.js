import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateUserPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/users', { username, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
      navigate('/login');
    } catch (error) {
      setError('Error creating user. Please try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="w-100 w-md-50 p-4 border rounded shadow-sm bg-light">
        <h2 className="mb-4 text-center">Create New User</h2>
        {error && <div className="alert alert-danger mb-3">{error}</div>}
        <form onSubmit={handleCreateUser}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Create User</button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;