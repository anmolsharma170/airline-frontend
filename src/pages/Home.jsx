import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, AlertCircle, Plane } from 'lucide-react';
import { flightService } from '../services/api';
import heroImage from '../assets/hero.png';

// Fallback airports list used if the backend microservice is offline or empty.
const FALLBACK_AIRPORTS = [
  { id: 1, name: 'Indira Gandhi International Airport', code: 'DEL', city: 'Delhi' },
  { id: 2, name: 'Chhatrapati Shivaji Maharaj International Airport', code: 'BOM', city: 'Mumbai' },
  { id: 3, name: 'Kempegowda International Airport', code: 'BLR', city: 'Bengaluru' },
  { id: 4, name: 'John F. Kennedy International Airport', code: 'JFK', city: 'New York' },
  { id: 5, name: 'Heathrow Airport', code: 'LHR', city: 'London' },
  { id: 6, name: 'Singapore Changi Airport', code: 'SIN', city: 'Singapore' },
];

/**
 * Home Page Component
 * Renders the brand landing page and flight search widget.
 * Features auto-suggest input fields for departure and destination airports.
 */
export default function Home() {
  const navigate = useNavigate();
  
  // Search inputs states
  const [departureQuery, setDepartureQuery] = useState('');
  const [arrivalQuery, setArrivalQuery] = useState('');
  const [departureAirport, setDepartureAirport] = useState(null);
  const [arrivalAirport, setArrivalAirport] = useState(null);
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState(1);
  
  // API and Suggestion lists
  const [airports, setAirports] = useState([]);
  const [depSuggestions, setDepSuggestions] = useState([]);
  const [arrSuggestions, setArrSuggestions] = useState([]);
  
  // Dropdown visibility states
  const [showDepDropdown, setShowDepDropdown] = useState(false);
  const [showArrDropdown, setShowArrDropdown] = useState(false);
  
  // UI feedback states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Refs for closing dropdowns when clicking outside
  const depRef = useRef();
  const arrRef = useRef();

  // Fetch airports on load
  useEffect(() => {
    async function loadAirports() {
      try {
        const res = await flightService.getAirports();
        // Standardize response extraction
        const data = res.data || res;
        if (Array.isArray(data) && data.length > 0) {
          setAirports(data);
        } else {
          setAirports(FALLBACK_AIRPORTS);
        }
      } catch (err) {
        console.warn('Could not fetch airports from backend, using fallback dataset:', err.message);
        setAirports(FALLBACK_AIRPORTS);
      } finally {
        setLoading(false);
      }
    }
    loadAirports();
  }, []);

  // Handle outside clicks to close dropdown lists
  useEffect(() => {
    function handleClickOutside(event) {
      if (depRef.current && !depRef.current.contains(event.target)) {
        setShowDepDropdown(false);
      }
      if (arrRef.current && !arrRef.current.contains(event.target)) {
        setShowArrDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter autocomplete list for departure queries
  const handleDepartureChange = (e) => {
    const val = e.target.value;
    setDepartureQuery(val);
    setDepartureAirport(null); // Reset selection
    
    if (val.trim() === '') {
      setDepSuggestions([]);
      return;
    }

    const filtered = airports.filter(airport => 
      airport.name.toLowerCase().includes(val.toLowerCase()) ||
      airport.code.toLowerCase().includes(val.toLowerCase()) ||
      (airport.city?.name || airport.city || '').toLowerCase().includes(val.toLowerCase())
    );
    setDepSuggestions(filtered);
    setShowDepDropdown(true);
  };

  // Filter autocomplete list for arrival queries
  const handleArrivalChange = (e) => {
    const val = e.target.value;
    setArrivalQuery(val);
    setArrivalAirport(null); // Reset selection
    
    if (val.trim() === '') {
      setArrSuggestions([]);
      return;
    }

    const filtered = airports.filter(airport => 
      airport.name.toLowerCase().includes(val.toLowerCase()) ||
      airport.code.toLowerCase().includes(val.toLowerCase()) ||
      (airport.city?.name || airport.city || '').toLowerCase().includes(val.toLowerCase())
    );
    setArrSuggestions(filtered);
    setShowArrDropdown(true);
  };

  // Select a departure airport from suggestions
  const selectDeparture = (airport) => {
    setDepartureAirport(airport);
    const cityName = airport.city?.name || airport.city || '';
    setDepartureQuery(`${cityName} (${airport.code})`);
    setShowDepDropdown(false);
  };

  // Select an arrival airport from suggestions
  const selectArrival = (airport) => {
    setArrivalAirport(airport);
    const cityName = airport.city?.name || airport.city || '';
    setArrivalQuery(`${cityName} (${airport.code})`);
    setShowArrDropdown(false);
  };

  // Execute Flight Search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!departureAirport) {
      setError('Please select a valid departure airport from the suggestion dropdown.');
      return;
    }
    if (!arrivalAirport) {
      setError('Please select a valid arrival airport from the suggestion dropdown.');
      return;
    }
    if (departureAirport.id === arrivalAirport.id) {
      setError('Departure and Destination airports cannot be the same.');
      return;
    }
    if (!date) {
      setError('Please select a departure travel date.');
      return;
    }

    // Build query params for search results page
    const params = new URLSearchParams({
      srcAirportId: departureAirport.id,
      destAirportId: arrivalAirport.id,
      date,
      seats
    });

    navigate(`/flights?${params.toString()}`);
  };

  return (
    <div className="home-container">
      {/* Premium Hero Section */}
      <header className="hero-section" style={{ backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.4), rgba(17, 24, 39, 0.75)), url(${heroImage})` }}>
        <div className="container hero-content animate-slide-up">
          <div className="hero-badge">
            <Plane size={14} className="hero-badge-icon" /> Welcome to AeroIndia
          </div>
          <h1>Experience Majestic Journeys</h1>
          <p>Book flights across the globe. Seamless reservations, automated seat release protection, and real-time flight notifications.</p>
        </div>
      </header>

      {/* Flight Search Section */}
      <section className="search-widget-container container">
        <div className="card card-glass search-card animate-slide-up">
          {error && (
            <div className="search-error-banner">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSearchSubmit} className="search-form-layout">
            {/* Departure Field */}
            <div className="form-group search-group" ref={depRef}>
              <label className="form-label"><MapPin size={16} /> From (Departure)</label>
              <input
                type="text"
                className="form-input search-input"
                placeholder="City or Airport (e.g. DEL)"
                value={departureQuery}
                onChange={handleDepartureChange}
                onFocus={() => setShowDepDropdown(depSuggestions.length > 0)}
                required
              />
              {showDepDropdown && depSuggestions.length > 0 && (
                <ul className="suggestion-dropdown">
                  {depSuggestions.map(airport => (
                    <li key={airport.id} onClick={() => selectDeparture(airport)}>
                      <span className="code-badge">{airport.code}</span>
                      <div className="airport-details">
                        <span className="city-name">{airport.city?.name || airport.city}</span>
                        <span className="airport-name">{airport.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Swap Button visual or placeholder */}
            <div className="search-divider-arrow">✈</div>

            {/* Destination Field */}
            <div className="form-group search-group" ref={arrRef}>
              <label className="form-label"><MapPin size={16} /> To (Destination)</label>
              <input
                type="text"
                className="form-input search-input"
                placeholder="City or Airport (e.g. BOM)"
                value={arrivalQuery}
                onChange={handleArrivalChange}
                onFocus={() => setShowArrDropdown(arrSuggestions.length > 0)}
                required
              />
              {showArrDropdown && arrSuggestions.length > 0 && (
                <ul className="suggestion-dropdown">
                  {arrSuggestions.map(airport => (
                    <li key={airport.id} onClick={() => selectArrival(airport)}>
                      <span className="code-badge">{airport.code}</span>
                      <div className="airport-details">
                        <span className="city-name">{airport.city?.name || airport.city}</span>
                        <span className="airport-name">{airport.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Date Field */}
            <div className="form-group search-group">
              <label className="form-label"><Calendar size={16} /> Travel Date</label>
              <input
                type="date"
                className="form-input search-input"
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Passengers Field */}
            <div className="form-group search-group">
              <label className="form-label"><Users size={16} /> Passengers</label>
              <select
                className="form-input search-input"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Traveller' : 'Travellers'}</option>
                ))}
              </select>
            </div>

            {/* Search Submit Button */}
            <button type="submit" className="btn btn-primary btn-search-flights">
              <Search size={18} /> Search Flights
            </button>
          </form>
        </div>
      </section>

      {/* Brand Value Previews */}
      <section className="container section-padding brand-values">
        <h2 className="text-center section-title">Why Fly AeroIndia</h2>
        <p className="text-center section-subtitle">Premium services engineered to provide you with the most comfortable flights.</p>
        
        <div className="grid grid-3">
          <div className="card value-card">
            <span className="value-icon">🍴</span>
            <h3>Gourmet Dining</h3>
            <p>Savor Michelin-inspired menus curated by world-class chefs, showcasing rich local spices and global cuisines.</p>
          </div>
          
          <div className="card value-card">
            <span className="value-icon">⏱️</span>
            <h3>Priority Boarding</h3>
            <p>Skip lines with priority check-in, premium lounge accessibility, and dedicated fast-track security lanes.</p>
          </div>
          
          <div className="card value-card">
            <span className="value-icon">🛡️</span>
            <h3>Seat Release Protection</h3>
            <p>Our background system automatically monitors booking checkouts, unlocking seats instantly on abandoned reservations.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
