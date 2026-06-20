import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="premium-footer">
      <div className="container">

        {/* 5-column grid */}
        <div className="row g-5 pb-5">

          {/* Brand */}
          <div className="col-12 col-lg-3">
            <div className="footer-brand">Yum</div>
            <p className="text-white-50" style={{ lineHeight: '1.7', fontSize: '0.9rem' }}>
              A premium culinary experience delivering the finest street flavors of Asia straight to your home or table. Made fresh, served with love.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social-icon" title="Instagram">📸</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-social-icon" title="Twitter">🐦</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-icon" title="Facebook">🌐</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer-social-icon" title="YouTube">▶️</a>
            </div>
          </div>

          {/* Explore */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="footer-col-heading">Explore</h6>
            <ul className="list-unstyled footer-link-list">
              <li><span onClick={() => navigate('/menu')} className="footer-link" style={{ cursor: 'pointer' }}>🍽 Menu</span></li>
              <li><span onClick={() => navigate('/reservations')} className="footer-link" style={{ cursor: 'pointer' }}>📅 Reservations</span></li>
              <li><span onClick={() => navigate('/myorders')} className="footer-link" style={{ cursor: 'pointer' }}>📦 My Orders</span></li>
              <li><span onClick={() => navigate('/')} className="footer-link" style={{ cursor: 'pointer' }}>🏠 Home</span></li>
            </ul>
          </div>

          {/* Contact and Location */}
          <div className="col-6 col-md-3 col-lg-3">
            <h6 className="footer-col-heading">Contact Us</h6>
            <ul className="list-unstyled footer-contact-list">
              <li>
                <span className="footer-contact-icon">📍</span>
                <span>12, Food Street, Banjara Hills,<br />Hyderabad — 500 034</span>
              </li>
              <li>
                <span className="footer-contact-icon">📞</span>
                <a href="tel:+919876543210" className="footer-link">+91 98765 43210</a>
              </li>
              <li>
                <span className="footer-contact-icon">✉️</span>
                <a href="mailto:hello@yumcafe.in" className="footer-link">hello@yumcafe.in</a>
              </li>
              <li>
                <span className="footer-contact-icon">🕐</span>
                <span>Mon–Thu: 11 AM – 11 PM<br />Fri–Sat: 11 AM – 2 AM<br />Sun: 12 PM – 10 PM</span>
              </li>
            </ul>
          </div>

          {/* Help and Support */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="footer-col-heading">Help &amp; Support</h6>
            <ul className="list-unstyled footer-link-list">
              <li><a href="#faq" className="footer-link">❓ FAQs</a></li>
              <li><span onClick={() => navigate('/tracking')} className="footer-link" style={{ cursor: 'pointer' }}>🛵 Track My Order</span></li>
              <li><a href="mailto:support@yumcafe.in" className="footer-link">🎧 Customer Support</a></li>
              <li><a href="mailto:hello@yumcafe.in" className="footer-link">💬 Give Feedback</a></li>
              <li><a href="#refund" className="footer-link">↩️ Refund Policy</a></li>
              <li><a href="#privacy" className="footer-link">🔒 Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="footer-col-heading">Stay Updated</h6>
            <p className="text-white-50 mb-3" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
              Get exclusive deals, new menus and seasonal specials in your inbox.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); alert('Subscribed! Watch your inbox.'); e.target.reset(); }}
              className="footer-newsletter-form"
            >
              <input
                type="email"
                className="res-input footer-newsletter-input"
                placeholder="your@email.com"
                required
              />
              <button type="submit" className="btn btn-peach footer-newsletter-btn">
                Subscribe
              </button>
            </form>
            <p className="footer-newsletter-note">No spam. Unsubscribe anytime.</p>
          </div>

        </div>

        <hr className="m-0" style={{ opacity: 0.1 }} />

        {/* Bottom bar */}
        <div className="footer-bottom-bar">
          <span>© {new Date().getFullYear()} Yum Cafe &amp; Restaurant. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#terms" className="footer-link">Terms of Service</a>
            <span className="footer-bottom-dot">·</span>
            <a href="#privacy" className="footer-link">Privacy Policy</a>
            <span className="footer-bottom-dot">·</span>
            <a href="mailto:hello@yumcafe.in" className="footer-link">Contact</a>
          </div>
        </div>

      </div>

      {/* Rotating platter art (Full Width) */}
      <div className="footer-platter-container">
        <img
          src="footer.png"
          alt="Footer rotating centerpiece"
          className="footer-platter-img"
        />
      </div>
    </footer>
  );
}
