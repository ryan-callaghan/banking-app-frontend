import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import AccountListPage from './AccountListPage';
import CreateUserPage from './Pages/CreateUserPage';

function App() {
  const [username, setUsername] = useState('');
  const[id, setId] = useState('');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-user" element={<CreateUserPage />} />
        <Route path="/accounts" element={<AccountListPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;