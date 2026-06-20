import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useCart } from './ContextReducer';
import BorderGlow from './BorderGlow';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useCart();

  const [showNav, setShowNav] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          // Scrolling down & past 100px threshold
          setShowNav(false);
        } else {
          // Scrolling up or at the top
          setShowNav(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('smartCartAuthToken');
    navigate('/login');
  };

  const scrollToMenu = () => {
    const element = document.getElementById('menu-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('menu-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg custom-navbar navbar-dark ${showNav ? 'nav-visible' : 'nav-hidden'}`}>
      <div className="container">
        {/* Brand Name */}
        <Link className="navbar-brand" to="/">Yum</Link>

        <div className="d-flex align-items-center ms-auto d-lg-none">
          {localStorage.getItem('smartCartAuthToken') && (
            <Link className="btn-cart-dark me-3" style={{ width: '38px', height: '38px' }} to="/cart" title="View Cart" onClick={() => setMobileMenuOpen(false)}>
              <span style={{ fontSize: '0.9rem' }}>🛒</span>
              {cartItems.length > 0 && (
                <span className="badge-green">
                  {cartItems.length}
                </span>
              )}
            </Link>
          )}
          <button 
            className="navbar-toggler border-0 p-0" 
            type="button" 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className={`collapse navbar-collapse navbar-collapse-drawer ${mobileMenuOpen ? 'open' : ''}`} id="navbarNav">
          {/* Close button for mobile menu */}
          <button 
            className="btn-close-menu d-lg-none" 
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>

          {/* Centered Navigation Links */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-4 gap-xl-5">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            </li>
            <li className="nav-item">
              <span className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => { navigate('/menu'); setMobileMenuOpen(false); }}>Menu</span>
            </li>
            <li className="nav-item">
              <span className={`nav-link ${location.pathname === '/reservations' ? 'active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => { navigate('/reservations'); setMobileMenuOpen(false); }}>Reservations</span>
            </li>
            {localStorage.getItem('smartCartAuthToken') &&
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/myorders' ? 'active' : ''}`} to="/myorders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
              </li>
            }
          </ul>

          {/* Right Action Buttons */}
          <div className="d-flex align-items-center gap-3">
            <BorderGlow
              borderRadius={10}
              glowRadius={12}
              className="d-none d-lg-inline-flex p-0"
              style={{ width: 'max-content', padding: '2px' }}
              backgroundColor="var(--bg-dark)"
            >
              <button onClick={() => { scrollToMenu(); setMobileMenuOpen(false); }} className="btn m-0 text-peach" style={{ padding: '8px 20px', border: '2px solid rgba(253, 164, 175, 0.4)', borderRadius: '10px', fontWeight: '600' }}>
                Order Now
              </button>
            </BorderGlow>
            {!localStorage.getItem('smartCartAuthToken') ? (
              <>
                <Link className="btn btn-trans" to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link className="btn btn-peach" to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </>
            ) : (
              <>
                <Link className="btn-cart-dark d-none d-lg-flex" to="/cart" title="View Cart" onClick={() => setMobileMenuOpen(false)}>
                  <span>🛒</span>
                  {cartItems.length > 0 && (
                    <span className="badge-green">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn btn-trans" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Overlay for mobile drawer */}
        {mobileMenuOpen && (
          <div 
            className="mobile-menu-overlay d-lg-none" 
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
}
