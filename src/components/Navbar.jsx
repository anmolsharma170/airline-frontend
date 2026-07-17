import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plane, User, LogOut, Menu, X, Shield, Calendar, BookOpen } from 'lucide-react';

/**
 * Navbar Component
 * Renders a sticky glassmorphic navigation bar.
 * Adapts links based on whether a user is authenticated and their specific role (Admin, FlightCompany, Customer).
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load user status from localStorage on mount and route changes
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user data', e);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsOpen(false);
    navigate('/login');
  };

  // Close mobile menu on click link
  const closeMenu = () => setIsOpen(false);

  // Check user privileges
  const isAdmin = user?.roles?.some(role => role.name === 'Admin') || user?.role === 'Admin';
  const isFlightCompany = user?.roles?.some(role => role.name === 'FlightCompany') || user?.role === 'FlightCompany';

  return (
    <nav className="navbar-container">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-icon-wrapper">
            <Plane className="logo-icon" />
          </div>
          <span className="logo-text">
            Aero<span className="logo-highlight">India</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="navbar-links-desktop">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Search Flights
          </Link>
          
          {user && (
            <Link to="/bookings" className={`nav-link ${location.pathname === '/bookings' ? 'active' : ''}`}>
              My Bookings
            </Link>
          )}

          {/* Admin Dashboard link visible to admins or flight company staff */}
          {(isAdmin || isFlightCompany) && (
            <Link to="/admin" className={`nav-link nav-link-admin ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
              <Shield size={16} /> Admin Console
            </Link>
          )}
        </div>

        {/* User Auth Buttons / Profile Panel */}
        <div className="navbar-auth-desktop">
          {user ? (
            <div className="user-profile-badge">
              <User size={16} className="user-icon" />
              <span className="user-email">{user.email?.split('@')[0]}</span>
              <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login-text">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm-nav">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button className="mobile-menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="navbar-menu-mobile animate-fade-in">
          <div className="mobile-links">
            <Link to="/" className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMenu}>
              Search Flights
            </Link>
            
            {user && (
              <Link to="/bookings" className={`mobile-nav-link ${location.pathname === '/bookings' ? 'active' : ''}`} onClick={closeMenu}>
                My Bookings
              </Link>
            )}

            {(isAdmin || isFlightCompany) && (
              <Link to="/admin" className="mobile-nav-link mobile-nav-link-admin" onClick={closeMenu}>
                Admin Console
              </Link>
            )}

            <div className="mobile-auth-divider"></div>

            {user ? (
              <div className="mobile-user-panel">
                <div className="mobile-user-info">
                  <User size={18} />
                  <span>{user.email}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-outline mobile-btn-logout">
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            ) : (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="btn btn-outline" onClick={closeMenu}>Sign In</Link>
                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
