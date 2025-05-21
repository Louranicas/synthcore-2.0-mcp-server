import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import ItemList from './components/ItemList';
import api from './api'; // We will create this next

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // To store user info if needed
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Ideally, you would verify the token with the backend and get user info
      // For this example, we'll assume the token is valid if it exists
      api.setAuthToken(token);
      // Fetch user data here if needed
      // For now, just setting a placeholder user
      setUser({ username: 'AuthenticatedUser' }); 
    } else {
      setUser(null);
      api.setAuthToken(null);
    }
  }, [token]);

  const handleLogin = async (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    // Fetch user data or set user based on login response
    setUser({ username: 'AuthenticatedUser' }); // Placeholder
    navigate('/items');
  };

  const handleRegister = async (newToken) => {
    // For this app, registration doesn't automatically log in the user
    // Or, if it does, handle it like login:
    // localStorage.setItem('token', newToken); // If backend returns token on register
    // setToken(newToken);
    // setUser({ username: 'NewlyRegisteredUser' });
    navigate('/login'); // Redirect to login after registration
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {token ? (
            <>
              <li><Link to="/items">Items</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
        {user && <p>Welcome, {user.username}!</p>}
      </nav>
      <Routes>
        <Route path="/" element={<h1>Welcome to the Item Manager</h1>} />
        <Route 
          path="/login" 
          element={!token ? <AuthForm mode="login" onAuthSuccess={handleLogin} /> : <Navigate to="/items" />} 
        />
        <Route 
          path="/register" 
          element={!token ? <AuthForm mode="register" onAuthSuccess={handleRegister} /> : <Navigate to="/items" />} 
        />
        <Route 
          path="/items" 
          element={token ? <ItemList /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
};

export default App;
