import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import the useAuth hook

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { isAuthenticated, loading, login } = useAuth(); // Get auth state and login function
  const navigate = useNavigate();

  // If already authenticated, redirect to homepage
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    const result = await login(username, password);

    if (result.success) {
      setMessage(result.message);
    } else {
      setIsError(true);
      setMessage(result.error);
    }
  };

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="login-page">
        <h1>Loading...</h1>
        <p>Checking authentication status.</p>
      </div>
    );
  }

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {message && <p className={`message ${isError ? 'error' : ''}`}>{message}</p>}
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
        <button type="submit">Login</button>
      </form>
      <p style={{marginTop: '20px', fontSize: '0.9em', color: '#666'}}>
        {/* (Demo Credentials: Username: `testuser`, Password: `password123`) */}
      </p>
    </div>
  );
}

export default LoginPage;
