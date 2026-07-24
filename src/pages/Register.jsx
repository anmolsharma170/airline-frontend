import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { authService } from '../services/api';

/**
 * Register Component
 * Renders the signup page, performs initial password validation,
 * sends registration requests to the Gateway, and redirects users to Login.
 */
export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validations
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // Call register API via Gateway
      await authService.register(email, password);
      
      setSuccess('Account created successfully! Redirecting to login page...');
      
      // Clear inputs
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. This email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen animate-fade-in">
      <div className="card auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join AeroMesh to access exclusive flight fares, track points, and fly seamless.</p>
        </div>

        {/* Display Success Notification */}
        {success && (
          <div className="auth-success-banner">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Display Error Notification */}
        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email Address Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="register-email"
                type="email"
                className="form-input icon-padded"
                placeholder="passenger@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || !!success}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password (min 6 chars)</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="register-password"
                type="password"
                className="form-input icon-padded"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || !!success}
                minLength={6}
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="confirm-password"
                type="password"
                className="form-input icon-padded"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading || !!success}
              />
            </div>
          </div>

          {/* Register Button */}
          <button type="submit" className="btn btn-primary btn-auth-submit" disabled={loading || !!success}>
            {loading ? (
              <span className="btn-spinner"></span>
            ) : (
              <>
                <UserPlus size={18} /> Register
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign In here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
