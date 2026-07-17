import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { authService } from '../services/api';

/**
 * Login Component
 * Renders the user sign-in page, validates input, calls the API Gateway authentication endpoint,
 * and sets up local session storage for auth tokens and user profile state.
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Client-side validations
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      // Call authentication microservice via API Gateway
      const res = await authService.login(email, password);
      
      // Robustly extract token and user details to handle different payload structures
      const token = res.data?.token || res.token || (typeof res.data === 'string' ? res.data : null);
      const user = res.data?.user || res.user || { email };

      if (!token) {
        throw new Error('Authentication succeeded but no security token was returned.');
      }

      // Store JWT token and user details in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Navigate to home or dashboard page
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen animate-fade-in">
      <div className="card auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to book flights, track ticket statuses, and manage your trips.</p>
        </div>

        {/* Display backend or client validation errors */}
        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email Address Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="email-input"
                type="email"
                className="form-input icon-padded"
                placeholder="passenger@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="password-input">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="password-input"
                type="password"
                className="form-input icon-padded"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary btn-auth-submit" disabled={loading}>
            {loading ? (
              <span className="btn-spinner"></span>
            ) : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
