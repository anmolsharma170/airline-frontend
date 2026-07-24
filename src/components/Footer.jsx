import React from 'react';
import { Plane, Mail, Phone, MapPin, Globe } from 'lucide-react';

/**
 * Footer Component
 * Renders a structured, premium footer matching our brand design.
 */
export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        {/* Brand Information Column */}
        <div className="footer-brand-col">
          <div className="footer-logo">
            <Plane className="footer-logo-icon" />
            <span>Aero<span className="logo-highlight">India</span></span>
          </div>
          <p className="footer-description">
            Connecting you to major global hubs with world-class safety standards, gourmet inflight dining, and warm Indian hospitality. Experience the future of skies.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon" title="Twitter"><Globe size={18} /></a>
          </div>
        </div>

        {/* Popular Travel Routes Column */}
        <div className="footer-links-col">
          <h4>Popular Destinations</h4>
          <ul>
            <li><a href="#">Delhi to Mumbai</a></li>
            <li><a href="#">Bengaluru to London</a></li>
            <li><a href="#">Mumbai to New York</a></li>
            <li><a href="#">Kolkata to Singapore</a></li>
          </ul>
        </div>

        {/* Support & Resources Column */}
        <div className="footer-links-col">
          <h4>Passenger Services</h4>
          <ul>
            <li><a href="#">Manage Booking</a></li>
            <li><a href="#">Refund Policy</a></li>
            <li><a href="#">Baggage Allowance</a></li>
            <li><a href="#">Flight Status</a></li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="footer-contact-col">
          <h4>Contact Us</h4>
          <div className="contact-item">
            <Phone size={16} className="contact-icon" />
            <span>+91-9463605786</span>
          </div>
          <div className="contact-item">
            <Mail size={16} className="contact-icon" />
            <span>anmosh2004@gmail.com</span>
          </div>
          <div className="contact-item">
            <MapPin size={16} className="contact-icon" />
            <span>Jalahdhar, Punjab</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} AeroMesh Airlines. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <span className="divider">|</span>
            <a href="#">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
