import React, { useState } from 'react';
import api from '../api';

const AuthForm = ({ mode, onAuthSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required.');
      setMessage(''); // Ensure message is also cleared on validation failure
      return;
    }

    // Proceed with login/registration if validation passes
    setError(''); 
    setMessage(''); 
    try {
      let response;
      if (mode === 'login') {
        response = await api.login({ username, password });
        if (response.token) { // Adjusted based on simulated token in api.js
          onAuthSuccess(response.token);
        } else {
          setError(response.message || 'Login failed. Please check your credentials.');
        }
      } else { // register
        response = await api.register({ username, password });
        if (response.message === 'User registered successfully') {
          setMessage('Registration successful! Please login.');
          onAuthSuccess(); // Notify App.js to navigate to login
        } else {
          setError(response.message || 'Registration failed.');
        }
      }
    } catch (err) {
      setError(`An error occurred: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  return (
    <div>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }} data-testid="error-message">{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
      </form>
    </div>
  );
};

export default AuthForm;
