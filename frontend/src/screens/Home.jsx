import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import VariableProximity from '../components/VariableProximity';
import BlurText from '../components/BlurText';
import BorderGlow from '../components/BorderGlow';
import './Home.css';

// Your uploaded food images — saved to frontend/public/ as float1-4.jpg
const FLOATS = [
  { cls: 'hero-float--tl', src: '/float1.jpg', alt: 'tomato' },
  { cls: 'hero-float--tr', src: '/float2.png', alt: 'Ice cream' },
  { cls: 'hero-float--bl', src: '/float3.png', alt: 'Fried Chicken' },
  { cls: 'hero-float--br', src: '/float4.png', alt: 'pizza' },
];

const LEFT_MENU = [
  { name: 'Spicy Tuna Roll', price: '₹750' },
  { name: 'Dragon Roll', price: '₹890' },
  { name: 'Miso Soup', price: '₹320' },
  { name: 'Gyoza Dumplings', price: '₹480' },
  { name: 'Edamame', price: '₹250' },
  { name: 'Salmon Sashimi', price: '₹980' },
];
const RIGHT_MENU = [
  { name: 'Teriyaki Salmon', price: '₹1,200' },
  { name: 'Beef Yakitori', price: '₹850' },
  { name: 'Crispy Tempura', price: '₹690' },
  { name: 'Wagyu Sliders', price: '₹1,450' },
  { name: 'Matcha Panna Cotta', price: '₹420' },
  { name: "Chef's Ramen", price: '₹960' },
];

export default function Home() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [booking, setBooking] = useState({ name: '', phone: '', date: '', time: '7:00 PM', guests: '2' });
  const [shrimpImg, setShrimpImg] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRevealRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    // Canvas white-bg removal for main platter only
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/shrimp_platter.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0, found = false;
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2];
          if (r > 240 && g > 240 && b > 240) { data[i + 3] = 0; }
          else { found = true; if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
        }
      }
      if (found) {
        const cw = maxX - minX + 1, ch = maxY - minY + 1;
        const crop = document.createElement('canvas');
        crop.width = cw; crop.height = ch;
        ctx.putImageData(imageData, 0, 0);
        crop.getContext('2d').drawImage(canvas, minX, minY, cw, ch, 0, 0, cw, ch);
        setShrimpImg(crop.toDataURL());
      }
    };
    img.onerror = () => console.warn('shrimp_platter.png not found');
  }, []);

  // Scroll-reveal IntersectionObserver for menu section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setMenuVisible(entry.isIntersecting); },
      { threshold: 0.15 }
    );
    if (menuRevealRef.current) observer.observe(menuRevealRef.current);
    return () => observer.disconnect();
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('smartCartAuthToken');

    try {
      const response = await fetch('https://yumcafe.onrender.com/api/reservation/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'auth-token': token })
        },
        body: JSON.stringify(booking)
      });

      const json = await response.json();
      if (json.success) {
        if (!token) {
          const existing = JSON.parse(localStorage.getItem('smartCartReservations') || '[]');
          localStorage.setItem('smartCartReservations', JSON.stringify([...existing, { ...booking, id: json.reservation._id }]));
        }
        alert(`🎉 Table booked successfully for ${booking.name} on ${booking.date} at ${booking.time} for ${booking.guests} guests! We look forward to hosting you at Yum.`);
        setBooking({ name: '', phone: '', date: '', time: '7:00 PM', guests: '2' });
        setIsModalOpen(false);
      } else {
        alert("Error booking table: " + json.error);
      }
    } catch (error) {
      console.error("Error booking:", error);
      alert("Failed to connect to server.");
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-dark)' }}>
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-v-bg"></div>

        {/* 4 floating food items — black bg removed by mix-blend-mode: screen in CSS */}
        {FLOATS.map(({ cls, src, alt }) => (
          <img key={cls} className={`hero-float ${cls}`} src={src} alt={alt} aria-hidden="true" />
        ))}

        <div className="container position-relative">
          <div className="text-center">

            <div className="hero-badge mx-auto">
              🔥 Now delivering till 2 AM
            </div>

            <h1 className="hero-title" ref={heroRef} style={{ cursor: 'default' }}>
              <VariableProximity
                label="Pan-Asian Crave"
                fromFontVariationSettings="'wght' 700"
                toFontVariationSettings="'wght' 1000"
                containerRef={heroRef}
                radius={250}
                falloff="linear"
              />
              <br />
              <VariableProximity
                label="Delivered in 30 Minutes"
                fromFontVariationSettings="'wght' 700"
                toFontVariationSettings="'wght' 1000"
                containerRef={heroRef}
                radius={250}
                falloff="linear"
                className="text-peach"
              />
              <br />
              <VariableProximity
                label="or Enjoy Here"
                fromFontVariationSettings="'wght' 700"
                toFontVariationSettings="'wght' 1000"
                containerRef={heroRef}
                radius={250}
                falloff="linear"
              />
            </h1>

            <p className="hero-subtitle mx-auto">
              Restaurant-quality sushi rolls, poke bowls &amp; bao<br />
              • Made fresh • Same kitchen for dine-in &amp; delivery
            </p>

            <div className="hero-cta-row justify-content-center">
              <button onClick={() => scrollToSection('cravings-section')} className="btn btn-peach">
                <span>🚚</span> Order Delivery Now
              </button>
              <button onClick={() => setIsModalOpen(true)} className="btn btn-trans">
                <span>🪑</span> Reserve Table
              </button>
              <button onClick={() => scrollToSection('cravings-section')} className="btn btn-trans">
                <span>🛍️</span> Order Takeaway
              </button>
            </div>

            <div className="hero-stats justify-content-center">
              <span>⭐⭐⭐⭐⭐ 4.9 (2,847 reviews)</span>
              <span className="hero-stats-divider">|</span>
              <span>🚚 Free delivery over ₹1500</span>
              <span className="hero-stats-divider">|</span>
              <span>🕒 Open till 2 AM</span>
            </div>
          </div>
        </div>


        {/* LARGE centered dish image */}
        <div className="hero-image-col">
          <div className="hero-platter-glow"></div>
          <img
            src={shrimpImg || "/shrimp_platter.png"}
            alt="Yum Premium Platter"
            className="hero-platter-img"
          />
        </div>

        {/* SCROLL-REVEAL MENU — above the 3 circles */}
        <div className="menu-reveal-section menu-reveal-in-hero" id="menu-section" ref={menuRevealRef}>
          <div className="menu-reveal-inner">

            {/* Left column */}
            <ul className={`menu-col menu-col--left ${menuVisible ? 'is-visible' : ''}`}>
              {LEFT_MENU.map((item, i) => (
                <li key={i} className="menu-reveal-item" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <span className="menu-reveal-name">{item.name}</span>
                  <span className="menu-reveal-line" />
                  <span className="menu-reveal-price">{item.price}</span>
                </li>
              ))}
            </ul>

            {/* Center CTA */}
            <div className={`menu-center-cta ${menuVisible ? 'is-visible' : ''}`}>
              <p className="menu-center-eyebrow">Explore</p>
              <button className="btn btn-peach btn-menu-view"
                onClick={() => navigate('/menu')}>
                View Full Menu
              </button>
              <p className="menu-center-sub">100+ dishes crafted fresh daily</p>
            </div>

            {/* Right column */}
            <ul className={`menu-col menu-col--right ${menuVisible ? 'is-visible' : ''}`}>
              {RIGHT_MENU.map((item, i) => (
                <li key={i} className="menu-reveal-item" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <span className="menu-reveal-price">{item.price}</span>
                  <span className="menu-reveal-line" />
                  <span className="menu-reveal-name">{item.name}</span>
                </li>
              ))}
            </ul>

          </div>
        </div>


        {/* 3 dish circles */}
        <div className="hero-mini-row">
          <div className="mini-dish-wrap">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500"
              alt="Garden Bowl"
              className="mini-dish-img"
            />
            <span className="mini-dish-label">Garden Bowl</span>
          </div>
          <div className="mini-dish-wrap">
            <img
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600"
              alt="Skewers"
              className="mini-dish-img mini-dish-img--lg"
            />
            <span className="mini-dish-label">Skewers</span>
          </div>
          <div className="mini-dish-wrap">
            <img
              src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=500"
              alt="Chef's Special"
              className="mini-dish-img"
            />
            <span className="mini-dish-label">Chef's Special</span>
          </div>
        </div>
      </section>

      {/* 2. BELIEF / OUR MISSION SECTION */}

      <section className="belief-section">
        <div className="container position-relative">
          <div className="floating-item floating-leaf-1" style={{ left: '15%', top: '0' }}>🍃</div>
          <div className="floating-item floating-leaf-2" style={{ right: '15%', bottom: '0' }}>🍃</div>
          <h2 className="belief-text">
            <BlurText text="Yum was born from a" delay={100} animateBy="words" />
            {' '}
            <span style={{ color: 'var(--accent-peach)' }}>
              <BlurText text="simple belief:" delay={100} animateBy="words" />
            </span>
            {' '}
            <BlurText text="you shouldn't have to choose between a premium dining experience and the convenience of home delivery." delay={100} animateBy="words" />       </h2>
        </div>
      </section>

      {/* 3. SIGNATURE DISHES SHOWCASE (TONIGHT'S CRAVINGS) */}
      <section id="cravings-section" className="py-5" style={{ backgroundColor: 'var(--bg-dark)' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="section-tag">Signature Dishes</span>
            <h2 className="section-title">Tonight's <span>Cravings</span></h2>
          </div>

          <div className="row g-4">
            {/* Dish 1 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="craving-card">
                <div className="craving-img-wrapper">
                  <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400" alt="Spicy Tuna Roll" className="craving-img" />
                </div>
                <div className="craving-body d-flex justify-content-between align-items-center">
                  <div className="craving-name">Spicy Tuna Roll</div>
                  <div className="craving-price">₹750</div>
                </div>
              </div>
            </div>
            {/* Dish 2 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="craving-card">
                <div className="craving-img-wrapper">
                  <img src="https://images.unsplash.com/photo-1519623286359-e9f3cbef015b?q=80&w=400" alt="Chicken Yakitori" className="craving-img" />
                </div>
                <div className="craving-body d-flex justify-content-between align-items-center">
                  <div className="craving-name">Chicken Yakitori</div>
                  <div className="craving-price">₹620</div>
                </div>
              </div>
            </div>
            {/* Dish 3 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="craving-card">
                <div className="craving-img-wrapper">
                  <img src="https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=400" alt="Salmon Sashimi" className="craving-img" />
                </div>
                <div className="craving-body d-flex justify-content-between align-items-center">
                  <div className="craving-name">Salmon Sashimi</div>
                  <div className="craving-price">₹980</div>
                </div>
              </div>
            </div>
            {/* Dish 4 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="craving-card">
                <div className="craving-img-wrapper">
                  <img src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=400" alt="Beef Ramen" className="craving-img" />
                </div>
                <div className="craving-body d-flex justify-content-between align-items-center">
                  <div className="craving-name">Spicy Beef Ramen</div>
                  <div className="craving-price">₹850</div>
                </div>
              </div>
            </div>
            {/* Dish 5 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="craving-card">
                <div className="craving-img-wrapper">
                  <img src="https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=400" alt="Pork Bao Buns" className="craving-img" />
                </div>
                <div className="craving-body d-flex justify-content-between align-items-center">
                  <div className="craving-name">Pork Bao Buns</div>
                  <div className="craving-price">₹580</div>
                </div>
              </div>
            </div>
            {/* Dish 6 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="craving-card">
                <div className="craving-img-wrapper">
                  <img src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=400" alt="Crispy Tempura" className="craving-img" />
                </div>
                <div className="craving-body d-flex justify-content-between align-items-center">
                  <div className="craving-name">Crispy Tempura</div>
                  <div className="craving-price">₹690</div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-5">
            <BorderGlow
              borderRadius={10}
              glowRadius={12}
              className="d-inline-flex p-0"
              style={{ width: 'max-content', margin: '0 auto' }}
              backgroundColor="var(--bg-dark)"
            >
              <button onClick={() => navigate('/menu')} className="btn m-0 text-peach" style={{ padding: '12px 32px', fontSize: '1.1rem', border: '2px solid rgba(253, 164, 175, 0.4)', borderRadius: '10px', fontWeight: '600' }}>
                Order Now
              </button>
            </BorderGlow>
          </div>
        </div>
      </section>

      {/* 4. CHOOSE YOUR VIBE SECTION */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-dark)' }}>
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-5 text-center text-lg-start">
              <span className="section-tag">Experience</span>
              <h2 className="section-title">Choose Your <span>Vibe</span></h2>
              <p className="text-muted fs-5" style={{ lineHeight: '1.7' }}>
                Whether you want a cozy dinner date, a quick meal on the run, or a gourmet feast delivered straight to your living room - Yum has got you covered.
              </p>
            </div>

            <div className="col-12 col-lg-7">
              <div className="row g-4">
                {/* Vibe 1 */}
                <div className="col-12">
                  <div className="vibe-card d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-4">
                    <div>
                      <span className="vibe-icon">🚚</span>
                      <h4 className="vibe-title">Order Delivery</h4>
                      <p className="vibe-desc mb-0">Your favorite pan-asian dishes delivered hot in 30 minutes.</p>
                    </div>
                    <button onClick={() => navigate('/menu')} className="btn btn-peach text-nowrap">Order Delivery</button>
                  </div>
                </div>
                {/* Vibe 2 */}
                <div className="col-12">
                  <div className="vibe-card d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-4">
                    <div>
                      <span className="vibe-icon">🪑</span>
                      <h4 className="vibe-title">Dine-in Experience</h4>
                      <p className="vibe-desc mb-0">Book a table in our moody dark-ambient dining room.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-trans text-nowrap">Book a Table</button>
                  </div>
                </div>
                {/* Vibe 3 */}
                <div className="col-12">
                  <div className="vibe-card d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-4">
                    <div>
                      <span className="vibe-icon">🛍️</span>
                      <h4 className="vibe-title">Quick Takeaway</h4>
                      <p className="vibe-desc mb-0">Order online and pick up at your convenience.</p>
                    </div>
                    <button onClick={() => navigate('/menu')} className="btn btn-trans text-nowrap">Get Takeaway</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HONEST FEEDBACK SECTION */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-dark)' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="section-tag">Reviews</span>
            <h2 className="section-title">Honest <span>Feedback</span><br />From Valued Customers</h2>
          </div>

          <div className="feedback-box mx-auto" style={{ maxWidth: '950px' }}>
            <div className="row align-items-center g-5">
              <div className="col-12 col-md-5 d-flex justify-content-center">
                <img
                  src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=400"
                  alt="Customers enjoying food"
                  className="feedback-avatar"
                />
              </div>
              <div className="col-12 col-md-7 text-center text-md-start">
                <div className="mb-3" style={{ color: 'var(--accent-peach)', fontSize: '1.4rem' }}>⭐⭐⭐⭐⭐</div>
                <blockquote className="text-white fs-4 mb-4" style={{ fontWeight: '500', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "Yum's commitment to quality, flavor and presentation is outstanding. Every delivery has exceeded our expectations, and on every occasion we felt like we were dining at a five-star restaurant. Highly recommended!"
                </blockquote>
                <h5 className="text-white fw-bold mb-1">Alex Morgan</h5>
                <span className="text-muted" style={{ fontSize: '0.9rem' }}>Dhanmondi, Dhaka</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WE DELIVER EVERYWHERE SECTION */}
      <section className="py-5 text-center" style={{ backgroundColor: 'var(--bg-dark)' }}>
        <div className="container py-5">
          <span className="section-tag">Locations</span>
          <h2 className="section-title">We Deliver <span>Everywhere</span></h2>
          <p className="text-white-50 mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
            Bringing delicious meals to neighborhoods across the city.
          </p>

          <div className="delivery-tags mx-auto" style={{ maxWidth: '800px' }}>
            <span className="delivery-tag"># Jubilee Hills</span>
            <span className="delivery-tag"># Banjara Hills</span>
            <span className="delivery-tag"># Madhapur</span>
            <span className="delivery-tag"># Hi-Tech City</span>
            <span className="delivery-tag"># Kondapur</span>
            <span className="delivery-tag"># Gachibowli</span>
            <span className="delivery-tag"># KBR Park</span>
            <span className="delivery-tag"># Film Nagar</span>
          </div>

          <div className="delivery-status-box">
            <div className="text-start">
              <span className="text-white-50 d-block" style={{ fontSize: '0.85rem' }}>DELIVERY TIME</span>
              <strong className="text-white">Within 30-40 min</strong>
            </div>
            <div style={{ height: '30px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
            <div className="text-start">
              <span className="text-white-50 d-block" style={{ fontSize: '0.85rem' }}>CHARGE</span>
              <strong className="text-white" style={{ color: 'var(--accent-peach)' }}>Free Delivery</strong>
            </div>
          </div>
        </div>
      </section>



      {/* 8. TABLE RESERVATION MODAL (GLASSMORPHIC) */}
      {isModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            zIndex: 1050
          }}
        >
          <div
            className="auth-form-container p-5 w-100"
            style={{
              maxWidth: '650px',
              borderRadius: '30px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn text-white position-absolute"
              style={{ top: '24px', right: '24px', fontSize: '1.5rem', background: 'none', border: 'none' }}
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <span className="section-tag">Reservations</span>
              <h2 className="text-white fw-bold mb-2">Book a Table</h2>
              <p className="text-muted">Avoid the queues and guarantee your cozy spot at Yum.</p>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6 d-flex flex-column text-start">
                  <label className="form-label fw-semibold text-white mb-2">Full Name</label>
                  <input
                    type="text"
                    className="form-control res-input"
                    placeholder="John Doe"
                    required
                    value={booking.name}
                    onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-6 d-flex flex-column text-start">
                  <label className="form-label fw-semibold text-white mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control res-input"
                    placeholder="+1 (555) 000-0000"
                    required
                    value={booking.phone}
                    onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-4 d-flex flex-column text-start">
                  <label className="form-label fw-semibold text-white mb-2">Date</label>
                  <input
                    type="date"
                    className="form-control res-input"
                    required
                    value={booking.date}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-4 d-flex flex-column text-start">
                  <label className="form-label fw-semibold text-white mb-2">Time Slot</label>
                  <select
                    className="form-select res-input"
                    value={booking.time}
                    onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                  >
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                    <option value="9:00 PM">9:00 PM</option>
                    <option value="10:00 PM">10:00 PM</option>
                  </select>
                </div>
                <div className="col-12 col-md-4 d-flex flex-column text-start">
                  <label className="form-label fw-semibold text-white mb-2">Number of Guests</label>
                  <select
                    className="form-select res-input"
                    value={booking.guests}
                    onChange={(e) => setBooking({ ...booking, guests: e.target.value })}
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                    <option value="5">5 People</option>
                    <option value="6">6+ People</option>
                  </select>
                </div>

                <div className="col-12 text-center mt-4 pt-2">
                  <button type="submit" className="btn btn-peach w-100 py-3 fs-5">
                    Confirm Booking
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
