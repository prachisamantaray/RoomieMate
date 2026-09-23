import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Map Firebase Auth error codes to user-friendly message strings
  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Incorrect email or password. Please try again.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please wait a moment and try again.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'Failed to log in. Please check your credentials.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      return setError('Please enter both email and password.');
    }

    try {
      setSubmitting(true);
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login Error:', err);
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your RoomieMatch account</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="ananya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
