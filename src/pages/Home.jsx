import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, AlertCircle, Plane, ArrowRight, Shield, Award, Landmark, Car, HelpCircle, Gift } from 'lucide-react';
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
 * Upgraded Home Page Component
 * Modeled directly on the Air India interface to deliver a premium, feature-rich aviation layout.
 */
export default function Home() {
  const navigate = useNavigate();
  
  // Tab states matching Air India's search widget
  const [activeWidgetTab, setActiveWidgetTab] = useState('search'); // 'search', 'manage', 'checkin', 'status'

  // Search form fields
  const [departureQuery, setDepartureQuery] = useState('');
  const [arrivalQuery, setArrivalQuery] = useState('');
  const [departureAirport, setDepartureAirport] = useState(null);
  const [arrivalAirport, setArrivalAirport] = useState(null);
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState(1);
  const [cabinClass, setCabinClass] = useState('Economy');
  
  // API suggestions state
  const [airports, setAirports] = useState([]);
  const [depSuggestions, setDepSuggestions] = useState([]);
  const [arrSuggestions, setArrSuggestions] = useState([]);
  
  // Dropdown states
  const [showDepDropdown, setShowDepDropdown] = useState(false);
  const [showArrDropdown, setShowArrDropdown] = useState(false);
  
  // Alert/Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dropdown close helpers
  const depRef = useRef();
  const arrRef = useRef();

  // Vanta.js Clouds Background Effect
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);
  const [isNightMode, setIsNightMode] = useState(() => {
    return localStorage.getItem('theme') === 'night';
  });

  useEffect(() => {
    function handleThemeChange(e) {
      setIsNightMode(e.detail === 'night');
    }
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  useEffect(() => {
    if (vantaEffectRef.current) {
      vantaEffectRef.current.destroy();
      vantaEffectRef.current = null;
    }

    if (window.VANTA) {
      const vantaConfig = isNightMode ? {
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        backgroundColor: 0x050510,
        skyColor: 0x070b19,
        cloudColor: 0x1e1b4b,
        cloudShadowColor: 0x020617,
        sunColor: 0x38bdf8,
        sunGlareColor: 0x818cf8,
        sunlightColor: 0x60a5fa,
        speed: 1.00
      } : {
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        backgroundColor: 0xffffff,
        skyColor: 0x68b8d7,
        cloudColor: 0xadc1de,
        cloudShadowColor: 0x183550,
        sunColor: 0xff9919,
        sunGlareColor: 0xff6633,
        sunlightColor: 0xff9933,
        speed: 1.00
      };

      vantaEffectRef.current = window.VANTA.CLOUDS(vantaConfig);
    }

    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, [isNightMode]);

  // Load Airports on Mount
  useEffect(() => {
    async function loadAirports() {
      try {
        const res = await flightService.getAirports();
        const data = res.data || res;
        if (Array.isArray(data) && data.length > 0) {
          setAirports(data);
        } else {
          setAirports(FALLBACK_AIRPORTS);
        }
      } catch (err) {
        console.warn('Using fallback airport dataset:', err.message);
        setAirports(FALLBACK_AIRPORTS);
      } finally {
        setLoading(false);
      }
    }
    loadAirports();
  }, []);

  // Click outside suggestion list closer
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

  // Filter Departure Suggestions
  const handleDepartureChange = (e) => {
    const val = e.target.value;
    setDepartureQuery(val);
    setDepartureAirport(null);
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

  // Filter Arrival Suggestions
  const handleArrivalChange = (e) => {
    const val = e.target.value;
    setArrivalQuery(val);
    setArrivalAirport(null);
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

  const selectDeparture = (airport) => {
    setDepartureAirport(airport);
    const cityName = airport.city?.name || airport.city || '';
    setDepartureQuery(`${cityName} (${airport.code})`);
    setShowDepDropdown(false);
  };

  const selectArrival = (airport) => {
    setArrivalAirport(airport);
    const cityName = airport.city?.name || airport.city || '';
    setArrivalQuery(`${cityName} (${airport.code})`);
    setShowArrDropdown(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!departureAirport) {
      setError('Please select a departure airport from suggestions.');
      return;
    }
    if (!arrivalAirport) {
      setError('Please select an arrival airport from suggestions.');
      return;
    }
    if (departureAirport.id === arrivalAirport.id) {
      setError('Departure and destination airports cannot match.');
      return;
    }
    if (!date) {
      setError('Please select a travel date.');
      return;
    }

    const params = new URLSearchParams({
      srcAirportId: departureAirport.id,
      destAirportId: arrivalAirport.id,
      date,
      seats
    });
    navigate(`/flights?${params.toString()}`);
  };

  return (
    <div className="home-container" style={{ backgroundColor: '#fdfdfd' }}>
      
      {/* BACKGROUND BANNER IMAGE */}
      <header className="hero-section" ref={vantaRef} style={{ height: '360px', backgroundColor: isNightMode ? '#070b19' : '#68b8d7', position: 'relative', overflow: 'hidden' }}>
        <div className="container hero-content animate-slide-up" style={{ paddingBottom: '30px', position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: '2.5rem', color: isNightMode ? '#ffffff' : '#0f172a', fontWeight: '800', textShadow: isNightMode ? '0 0 20px rgba(56, 189, 248, 0.6)' : '0 2px 12px rgba(255,255,255,0.8)' }}>Fly Majesty. Fly AeroMesh.</h1>
          <p style={{ fontSize: '1rem', opacity: '0.95', color: isNightMode ? '#e2e8f0' : '#1e293b', fontWeight: '600', textShadow: isNightMode ? '0 0 10px rgba(0,0,0,0.8)' : '0 1px 8px rgba(255,255,255,0.7)' }}>Discover direct paths across the globe with gourmet dining and warm hospitality.</p>
        </div>
      </header>

      {/* DYNAMIC HORIZONTAL SEARCH WIDGET CARD */}
      <section className="search-widget-container container" style={{ marginTop: '-45px' }}>
        <div className="card search-card animate-slide-up" style={{ padding: '24px 30px', boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}>
          {/* Sub Navigation menu for Booking card */}
          <div className="widget-tab-row" style={{ display: 'flex', gap: '24px', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '12px', marginBottom: '20px' }}>
            <button 
              className={`widget-tab-btn ${activeWidgetTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveWidgetTab('search')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: '700', paddingBottom: '8px', position: 'relative' }}
            >
              SEARCH FLIGHTS
            </button>
            <button 
              className={`widget-tab-btn ${activeWidgetTab === 'manage' ? 'active' : ''}`}
              onClick={() => navigate('/bookings')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: '700', paddingBottom: '8px', position: 'relative', opacity: 0.6 }}
            >
              MANAGE BOOKINGS
            </button>
            <button 
              className={`widget-tab-btn ${activeWidgetTab === 'checkin' ? 'active' : ''}`}
              onClick={() => setActiveWidgetTab('checkin')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: '700', paddingBottom: '8px', position: 'relative', opacity: 0.6 }}
            >
              CHECK-IN
            </button>
            <button 
              className={`widget-tab-btn ${activeWidgetTab === 'status' ? 'active' : ''}`}
              onClick={() => setActiveWidgetTab('status')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: '700', paddingBottom: '8px', position: 'relative', opacity: 0.6 }}
            >
              FLIGHT STATUS
            </button>
          </div>

          {error && (
            <div className="search-error-banner">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Upgraded Air India Segmented Layout */}
          <form onSubmit={handleSearchSubmit} className="air-india-search-form-layout">
            
            {/* FROM FIELD */}
            <div className="search-field-segment" ref={depRef}>
              <span className="segment-lbl">FROM</span>
              <input
                type="text"
                className="segment-input font-bold"
                placeholder="Origin Airport"
                value={departureQuery}
                onChange={handleDepartureChange}
                onFocus={() => setShowDepDropdown(depSuggestions.length > 0)}
                required
              />
              <span className="segment-sub">{departureAirport ? departureAirport.name : 'Select origin'}</span>
              
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

            <div className="segment-connector-arrow">➔</div>

            {/* TO FIELD */}
            <div className="search-field-segment" ref={arrRef}>
              <span className="segment-lbl">TO</span>
              <input
                type="text"
                className="segment-input font-bold"
                placeholder="Destination Airport"
                value={arrivalQuery}
                onChange={handleArrivalChange}
                onFocus={() => setShowArrDropdown(arrSuggestions.length > 0)}
                required
              />
              <span className="segment-sub">{arrivalAirport ? arrivalAirport.name : 'Select destination'}</span>
              
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

            {/* DATE FIELD */}
            <div className="search-field-segment">
              <span className="segment-lbl">DEPART DATE</span>
              <input
                type="date"
                className="segment-input"
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <span className="segment-sub">Outbound trip</span>
            </div>

            {/* PASSENGERS & CABIN CLASS */}
            <div className="search-field-segment">
              <span className="segment-lbl">TRAVELLERS & CLASS</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  className="segment-select-inner font-bold"
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <select
                  className="segment-select-inner font-bold"
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value)}
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium</option>
                  <option value="Business">Business</option>
                </select>
              </div>
              <span className="segment-sub">Select count and class</span>
            </div>

            {/* SEARCH SUBMIT BUTTON */}
            <button type="submit" className="btn btn-primary air-india-search-btn">
              <Search size={18} /> Search
            </button>
          </form>
        </div>
      </section>

      {/* EXCLUSIVE DEALS CAROUSEL */}
      <section className="container section-padding exclusive-deals-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 className="air-india-section-title">EXCLUSIVE DEALS</h2>
            <p className="air-india-section-subtitle">Uncover discounts and premium rewards curated for your journeys.</p>
          </div>
          <button onClick={() => navigate('/flights')} className="btn-outline btn-sm-nav" style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--color-primary)' }}>View All Deals</button>
        </div>

        <div className="grid grid-4 deals-row-layout">
          <div className="card deal-card" style={{ background: 'linear-gradient(135deg, #101c38 0%, #1e3a8a 100%)', color: 'white' }}>
            <span className="deal-badge-accent">BANK OFFER</span>
            <h3>Get up to ₹10,000* instant discount</h3>
            <p>Save on global flight bookings using credit cards. Limited period.</p>
          </div>

          <div className="card deal-card" style={{ background: 'linear-gradient(135deg, #1e3b32 0%, #065f46 100%)', color: 'white' }}>
            <span className="deal-badge-accent">MEMBERS ONLY</span>
            <h3>Enjoy up to 15% off convenience fees</h3>
            <p>Exclusively for logged-in Maharaja Loyalty Club members.</p>
          </div>

          <div className="card deal-card" style={{ background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)', color: 'white' }}>
            <span className="deal-badge-accent">POINTS MULTIPLIER</span>
            <h3>Earn 10X points rewards</h3>
            <p>Earn points multipliers on scheduling flights this week.</p>
          </div>

          <div className="card deal-card" style={{ background: 'linear-gradient(135deg, #7c2d12 0%, #b45309 100%)', color: 'white' }}>
            <span className="deal-badge-accent">CABIN UPGRADE</span>
            <h3>Business Class Upgrade</h3>
            <p>Complimentary lounge access and seat upgrade credits.</p>
          </div>
        </div>
      </section>

      {/* QUICK LINK SERVICES STRIP */}
      <section className="container quick-services-strip animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <div className="services-bar-row">
          <div className="service-link-card">
            <span className="service-icon-wrapper">🏨</span>
            <div className="service-details">
              <h4>HOTELS</h4>
              <p>Book stays globally ➔</p>
            </div>
          </div>
          <div className="service-link-card">
            <span className="service-icon-wrapper">🚗</span>
            <div className="service-details">
              <h4>CAR BOOKING</h4>
              <p>Secure premium rentals ➔</p>
            </div>
          </div>
          <div className="service-link-card">
            <span className="service-icon-wrapper">🛡️</span>
            <div className="service-details">
              <h4>INSURANCE</h4>
              <p>Travel protection plans ➔</p>
            </div>
          </div>
          <div className="service-link-card">
            <span className="service-icon-wrapper">🎁</span>
            <div className="service-details">
              <h4>GIFT CARD</h4>
              <p>Gift absolute freedom ➔</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOYALTY BANNER GRAPHIC */}
      <section className="container section-padding loyalty-banner-container animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="card loyalty-banner-card" style={{ padding: '50px', background: 'linear-gradient(135deg, #101c38 0%, var(--color-primary) 100%)', color: 'white', display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '30px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '14px', fontFamily: 'var(--font-heading)' }}>Earn & Redeem Maharaja Rewards</h2>
            <p style={{ opacity: 0.9, lineHeight: 1.6, marginBottom: '24px' }}>
              Sign up as a loyalty program member to unlock reward flights, priority premium check-ins, complementary dining points, and baggage allowances. Experience flight comfort at its peak.
            </p>
            <button className="btn btn-secondary pulse-gold">Register Member Account</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontSize: '7rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>👑</span>
          </div>
        </div>
      </section>

      {/* POPULAR TRAVEL DESTINATIONS */}
      <section className="container section-padding destinations-container animate-slide-up" style={{ animationDelay: '0.25s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 className="air-india-section-title">BOOK NONSTOP DIRECT FLIGHTS</h2>
            <p className="air-india-section-subtitle">Connecting city nodes seamlessly with direct airline paths.</p>
          </div>
          <button onClick={() => navigate('/flights')} className="btn-outline btn-sm-nav" style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--color-primary)' }}>View All Destinations</button>
        </div>

        <div className="grid grid-4 destinations-row-layout">
          <div className="card destination-card animate-slide-up" style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%), url('https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=500&q=80')` }}>
            <div className="dest-info">
              <h3>DELHI</h3>
              <p>Indira Gandhi Int'l Airport (DEL)</p>
            </div>
          </div>

          <div className="card destination-card animate-slide-up" style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%), url('https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=500&q=80')` }}>
            <div className="dest-info">
              <h3>SHANGHAI</h3>
              <p>Pudong International Airport (PVG)</p>
            </div>
          </div>

          <div className="card destination-card animate-slide-up" style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80')` }}>
            <div className="dest-info">
              <h3>GOA</h3>
              <p>Dabolim International Airport (GOI)</p>
            </div>
          </div>

          <div className="card destination-card animate-slide-up" style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%), url('https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=500&q=80')` }}>
            <div className="dest-info">
              <h3>SYDNEY</h3>
              <p>Kingsford Smith Airport (SYD)</p>
            </div>
          </div>
        </div>
      </section>

      {/* AWARDS ROW */}
      <section className="container section-padding awards-container text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="air-india-section-title">AWARDS</h2>
        <div className="grid grid-4 awards-row-layout" style={{ marginTop: '40px' }}>
          <div className="award-card">
            <span className="award-star">★ ★ ★</span>
            <div className="laurel-crown">🏆</div>
            <h4>World's Improved Airline</h4>
            <p className="award-date">Apex Award 2026</p>
          </div>
          <div className="award-card">
            <span className="award-star">★ ★ ★ ★</span>
            <div className="laurel-crown">🏆</div>
            <h4>Four Star Global Airline</h4>
            <p className="award-date">Apex Award 2026</p>
          </div>
          <div className="award-card">
            <span className="award-star">★ ★ ★</span>
            <div className="laurel-crown">🏆</div>
            <h4>Up and Coming Program</h4>
            <p className="award-date">Freddie Award 2026</p>
          </div>
          <div className="award-card">
            <span className="award-star">★ ★ ★ ★</span>
            <div className="laurel-crown">🏆</div>
            <h4>Experience Maker of the Year</h4>
            <p className="award-date">Adobe Award 2026</p>
          </div>
        </div>
      </section>
    </div>
  );
}
