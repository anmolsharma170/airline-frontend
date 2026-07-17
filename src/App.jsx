import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FlightSearch from './pages/FlightSearch';
import BookingFlow from './pages/BookingFlow';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

/**
 * Helper component for protecting customer-only routes.
 * Redirects to /login if user is not authenticated.
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

/**
 * Helper component for protecting admin-only console routes.
 * Redirects to / if user is not admin or flight staff.
 */
function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const user = JSON.parse(storedUser);
    const isAdmin = user?.roles?.some(role => role.name === 'Admin') || user?.role === 'Admin';
    const isFlightCompany = user?.roles?.some(role => role.name === 'FlightCompany') || user?.role === 'FlightCompany';
    
    return (isAdmin || isFlightCompany) ? children : <Navigate to="/" replace />;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
}

/**
 * Main Application Shell
 * Configures global routing and wraps components in our brand navbar & footer.
 */
export default function App() {
  return (
    <BrowserRouter>
      {/* App wrapper for flex layout (keeps footer sticky at the bottom) */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Header navigation */}
        <Navbar />
        
        {/* Main Content Area */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<FlightSearch />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Passenger Booking Route (Protected - requires logging in) */}
            <Route 
              path="/book/:flightId" 
              element={
                <ProtectedRoute>
                  <BookingFlow />
                </ProtectedRoute>
              } 
            />
            
            {/* User Dashboard / Booking History (Protected) */}
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Management Dashboard (Admin / Flight Company staff only) */}
            <Route 
              path="/admin" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } 
            />
            
            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Footer info links */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
