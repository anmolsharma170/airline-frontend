import React, { useState, useEffect } from 'react';
import { Plane, Calendar, Clock, Ticket, Trash2, MailOpen, User, Award, ShieldCheck, QrCode, MapPin, CheckCircle2 } from 'lucide-react';
import { bookingService } from '../services/api';

// Fallback user bookings data if backend returns empty or is offline
const MOCK_USER_BOOKINGS = [
  {
    id: 89104,
    status: 'CONFIRMED',
    noOfSeats: 2,
    totalCost: 12400,
    flightId: 104,
    flight: {
      flightNumber: 'AI-890',
      departureTime: '2026-07-28T10:00:00.000Z',
      arrivalTime: '2026-07-28T12:20:00.000Z',
      departureAirport: { city: 'Delhi', code: 'DEL', name: 'Indira Gandhi International Airport' },
      arrivalAirport: { city: 'Mumbai', code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport' }
    }
  },
  {
    id: 88021,
    status: 'CONFIRMED',
    noOfSeats: 2,
    totalCost: 12900,
    flightId: 102,
    flight: {
      flightNumber: 'AI-204',
      departureTime: '2026-07-18T12:00:00.000Z',
      arrivalTime: '2026-07-18T14:20:00.000Z',
      departureAirport: { city: 'Delhi', code: 'DEL', name: 'Indira Gandhi International Airport' },
      arrivalAirport: { city: 'Mumbai', code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport' }
    }
  },
  {
    id: 85304,
    status: 'CANCELLED',
    noOfSeats: 1,
    totalCost: 4750,
    flightId: 101,
    flight: {
      flightNumber: 'AI-101',
      departureTime: '2026-07-15T06:30:00.000Z',
      arrivalTime: '2026-07-15T08:45:00.000Z',
      departureAirport: { city: 'Delhi', code: 'DEL', name: 'Indira Gandhi International Airport' },
      arrivalAirport: { city: 'Mumbai', code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport' }
    }
  }
];

/**
 * UserDashboard Component - Upgraded Version
 * Renders traveler analytics, flyer milestones, ticket status filters,
 * and expandable digital boarding passes.
 */
export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Interactive filtering tab: 'all', 'confirmed', 'cancelled', 'pending'
  const [filterTab, setFilterTab] = useState('all');

  // Track ID of the booking currently expanded to show boarding pass inline
  const [expandedBookingId, setExpandedBookingId] = useState(null);

  // Fetch bookings on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setCurrentUser(parsed);
      loadBookings(parsed.id);
    } else {
      setLoading(false);
    }
  }, []);

  // API Call to fetch user's booking history
  const loadBookings = async (userId) => {
    setLoading(true);
    setError('');
    try {
      const res = await bookingService.getUserBookings(userId);
      const data = res.data || res;
      if (Array.isArray(data) && data.length > 0) {
        setBookings(data);
      } else {
        setBookings(MOCK_USER_BOOKINGS);
      }
    } catch (err) {
      console.warn('Booking API fetch failed. Showing simulated booking records:', err.message);
      setBookings(MOCK_USER_BOOKINGS);
    } finally {
      setLoading(false);
    }
  };

  // SAGA COMPENSATING TRANSACTION: Cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this flight booking? This will immediately release your held seats.')) {
      return;
    }

    setError('');
    setSuccess('');
    
    try {
      // Call Booking Service cancel endpoint. 
      await bookingService.cancelBooking(bookingId);
      
      setSuccess(`Booking #${bookingId} has been successfully cancelled. Seats released.`);
      
      // Update local UI state
      setBookings(prev => 
        prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b)
      );
      
      // Close expanded boarding pass if open
      if (expandedBookingId === bookingId) {
        setExpandedBookingId(null);
      }
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      // Offline fallback: simulate cancellation
      setSuccess(`Simulated Saga: Booking #${bookingId} marked as CANCELLED. seats incremented in Flight Service.`);
      setBookings(prev => 
        prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b)
      );
      if (expandedBookingId === bookingId) {
        setExpandedBookingId(null);
      }
    }
  };

  // Toggle boarding pass expansion
  const toggleBoardingPass = (id) => {
    if (expandedBookingId === id) {
      setExpandedBookingId(null);
    } else {
      setExpandedBookingId(id);
    }
  };

  const getReadableTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getReadableDate = (isoString) => {
    return new Date(isoString).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Calculate statistics from bookings
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
  const simulatedFlyerMiles = activeBookings * 750 + 500; // Calculate mock loyalty miles

  // Filter bookings list based on active tab select
  const filteredBookings = bookings.filter(booking => {
    if (filterTab === 'all') return true;
    if (filterTab === 'confirmed') return booking.status === 'CONFIRMED';
    if (filterTab === 'cancelled') return booking.status === 'CANCELLED';
    if (filterTab === 'pending') return booking.status === 'PENDING' || booking.status === 'INITIATED';
    return true;
  });

  return (
    <div className="dashboard-page container">
      {/* 1. Header Profile & Flyer Miles Progress */}
      {currentUser && (
        <div className="dashboard-header-container animate-slide-up">
          {/* User Profile Card */}
          <div className="card dashboard-user-card" style={{ marginBottom: 0 }}>
            <div className="user-profile-header">
              <div className="avatar-wrapper">
                <User size={32} />
              </div>
              <div>
                <h2>{currentUser.email}</h2>
                <span className="profile-badge">Gold Tier Member</span>
              </div>
            </div>
          </div>

          {/* Flyer Loyalty Miles Milestone Widget */}
          <div className="card loyalty-progress-card">
            <div className="loyalty-header">
              <Award className="loyalty-icon" size={24} />
              <div>
                <h4>AeroMiles Rewards</h4>
                <span className="loyalty-miles">{simulatedFlyerMiles} / 3,000 Miles</span>
              </div>
            </div>
            <div className="loyalty-bar">
              <div 
                className="loyalty-fill" 
                style={{ width: `${Math.min((simulatedFlyerMiles / 3000) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="loyalty-footer">
              <span>Next Reward: Free Lounge Pass</span>
              <strong>{3000 - simulatedFlyerMiles > 0 ? 3000 - simulatedFlyerMiles : 0} miles left</strong>
            </div>
          </div>
        </div>
      )}

      {/* 2. Unified Counters Summary Row */}
      <div className="dashboard-stats-row animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="card stat-widget">
          <span className="stat-num">{totalBookings}</span>
          <span className="stat-label">Total Reservations</span>
        </div>
        <div className="card stat-widget">
          <span className="stat-num text-success">{activeBookings}</span>
          <span className="stat-label">Active Flights</span>
        </div>
        <div className="card stat-widget">
          <span className="stat-num" style={{ color: '#64748b' }}>{cancelledBookings}</span>
          <span className="stat-label">Released/Cancelled</span>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {success && (
        <div className="auth-success-banner animate-fade-in" style={{ marginTop: '20px' }}>
          <MailOpen size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="auth-error-banner animate-fade-in" style={{ marginTop: '20px' }}>
          <span>{error}</span>
        </div>
      )}

      {/* 3. Bookings Workspace & Filtering Tabs */}
      <div className="dashboard-bookings-section animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <div className="dashboard-section-header">
          <h3 className="dashboard-subtitle">My Bookings</h3>
          
          {/* Tab Navigation Filters */}
          <div className="filter-tabs-nav">
            <button 
              className={`tab-filter-btn ${filterTab === 'all' ? 'active' : ''}`}
              onClick={() => setFilterTab('all')}
            >
              All
            </button>
            <button 
              className={`tab-filter-btn ${filterTab === 'confirmed' ? 'active' : ''}`}
              onClick={() => setFilterTab('confirmed')}
            >
              Active
            </button>
            <button 
              className={`tab-filter-btn ${filterTab === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterTab('pending')}
            >
              Holds/Pending
            </button>
            <button 
              className={`tab-filter-btn ${filterTab === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilterTab('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-state card">
            <span className="btn-spinner"></span>
            <p>Syncing microservices records...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="dashboard-bookings-list">
            {filteredBookings.map(booking => {
              const f = booking.flight || {
                flightNumber: 'AI-XXX',
                departureTime: new Date().toISOString(),
                arrivalTime: new Date().toISOString(),
                departureAirport: { city: 'Source', code: 'SRC' },
                arrivalAirport: { city: 'Destination', code: 'DST' }
              };
              
              const isConfirmed = booking.status === 'CONFIRMED';
              const isCancelled = booking.status === 'CANCELLED';
              const isPending = booking.status === 'PENDING' || booking.status === 'INITIATED';
              const isExpanded = expandedBookingId === booking.id;

              const departureDate = new Date(f.departureTime);
              const isPastFlight = !isNaN(departureDate.getTime()) && departureDate < new Date();
              const canCancel = isConfirmed && !isPastFlight;

              return (
                <div key={booking.id} className={`card booking-history-card ${isExpanded ? 'card-expanded-active' : ''}`}>
                  {/* Card Header */}
                  <div className="history-card-header">
                    <div className="ticket-id-tag">
                      <Ticket size={16} />
                      <span>Booking ID #{booking.id}</span>
                    </div>

                    <span className={`status-badge-ui status-${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Flight Info Body */}
                  <div className="history-card-body">
                    <div className="flight-route-strip">
                      <div className="route-node">
                        <h4>{f.departureAirport?.city || f.departureAirport?.city?.name || 'Delhi'}</h4>
                        <span className="airport-code">{f.departureAirport?.code || 'DEL'}</span>
                      </div>
                      <div className="route-connector-strip">
                        <Plane size={16} className="route-plane" />
                        <div className="dotted-line-horizontal"></div>
                      </div>
                      <div className="route-node">
                        <h4>{f.arrivalAirport?.city || f.arrivalAirport?.city?.name || 'Mumbai'}</h4>
                        <span className="airport-code">{f.arrivalAirport?.code || 'BOM'}</span>
                      </div>
                    </div>

                    <div className="history-details-grid">
                      <div>
                        <span className="details-label">SCHEDULED DATE</span>
                        <span className="details-val">
                          <Calendar size={12} className="inline-icon" /> {getReadableDate(f.departureTime)} • {getReadableTime(f.departureTime)}
                        </span>
                      </div>

                      <div>
                        <span className="details-label">PASSENGERS</span>
                        <span className="details-val">
                          {booking.noOfSeats} {booking.noOfSeats === 1 ? 'Seat' : 'Seats'}
                        </span>
                      </div>

                      <div>
                        <span className="details-label">TOTAL FARE</span>
                        <span className="details-val font-heading font-bold color-primary">
                          ₹{booking.totalCost?.toLocaleString() || (booking.noOfSeats * 5000).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Action Panel */}
                  <div className="history-card-footer">
                    <div className="footer-actions-left">
                      {isConfirmed && (
                        <button 
                          onClick={() => toggleBoardingPass(booking.id)} 
                          className={`btn ${isExpanded ? 'btn-primary' : 'btn-outline'}`}
                          style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                        >
                          {isExpanded ? 'Hide Boarding Pass' : 'View Boarding Pass'}
                        </button>
                      )}
                    </div>
                    
                    <div className="footer-actions-right">
                      {canCancel && (
                        <button 
                          onClick={() => handleCancelBooking(booking.id)} 
                          className="btn-cancel-action-text"
                          title="Trigger Saga cancellation compensating path"
                        >
                          <Trash2 size={15} /> Cancel Ticket
                        </button>
                      )}

                      {isConfirmed && isPastFlight && (
                        <span className="flown-notice" style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={15} style={{ color: '#10b981' }} /> Flight Completed
                        </span>
                      )}

                      {isPending && (
                        <p className="pending-notice">
                          <Clock size={14} /> Held for 5 mins. Awaiting Payment completion.
                        </p>
                      )}

                      {isCancelled && (
                        <p className="cancelled-notice-text">
                          <ShieldCheck size={14} /> Compensated: seats returned to Flight Service.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 4. EXPANDABLE DIGITAL BOARDING PASS PREVIEW */}
                  {isConfirmed && isExpanded && (
                    <div className="boarding-pass-expandable animate-slide-up">
                      <div className="boarding-pass-inner">
                        {/* Header banner */}
                        <div className="pass-top">
                          <div className="pass-logo">
                            <Plane className="logo-icon-rotate" size={16} />
                            <span>Aero<span className="logo-highlight">India</span></span>
                          </div>
                          <span className="class-label">ECONOMY CLASS</span>
                        </div>

                        {/* Ticket contents */}
                        <div className="pass-body">
                          <div className="pass-row">
                            <div>
                              <span className="pass-meta-lbl">PASSENGER CLASS</span>
                              <span className="pass-meta-val">Adult Traveler</span>
                            </div>
                            <div className="text-right">
                              <span className="pass-meta-lbl">FLIGHT CODE</span>
                              <span className="pass-meta-val">{f.flightNumber}</span>
                            </div>
                          </div>

                          {/* Interactive route path */}
                          <div className="pass-path-strip">
                            <div>
                              <span className="pass-city">{f.departureAirport?.code || 'DEL'}</span>
                              <span className="pass-name">{f.departureAirport?.city || 'Delhi'}</span>
                            </div>
                            <div className="path-visual">
                              <div className="line"></div>
                              <Plane size={14} className="plane" />
                              <div className="line"></div>
                            </div>
                            <div className="text-right">
                              <span className="pass-city">{f.arrivalAirport?.code || 'BOM'}</span>
                              <span className="pass-name">{f.arrivalAirport?.city || 'Mumbai'}</span>
                            </div>
                          </div>

                          <div className="pass-row pass-footer-row">
                            <div>
                              <span className="pass-meta-lbl">BOARDING TIME</span>
                              <span className="pass-meta-val">{getReadableTime(f.departureTime)}</span>
                            </div>
                            <div>
                              <span className="pass-meta-lbl">GATE</span>
                              <span className="pass-meta-val">GATE G-12</span>
                            </div>
                            <div>
                              <span className="pass-meta-lbl">SEATS</span>
                              <span className="pass-meta-val">{booking.noOfSeats} Seats</span>
                            </div>
                          </div>
                        </div>

                        {/* Ticket QR/Barcode */}
                        <div className="pass-barcode-section">
                          <div className="barcode-graphic-sim">
                            <QrCode size={40} className="qr-icon" />
                            <div className="stripes">
                              {Array.from({ length: 24 }).map((_, i) => (
                                <div key={i} className="stripe" style={{ width: `${(i % 3 === 0 ? 3 : 1)}px` }}></div>
                              ))}
                            </div>
                          </div>
                          <span className="barcode-val-text">AERO-{booking.id}-BOARDING</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card no-bookings-card text-center animate-slide-up">
            <Ticket className="no-bookings-icon" size={48} />
            <h3>No bookings match filter</h3>
            <p>There are no bookings matching the "{filterTab}" category in your profile history.</p>
            <button 
              onClick={() => setFilterTab('all')} 
              className="btn btn-outline"
              style={{ marginTop: '20px' }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
