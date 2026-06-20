import React, { useState, useEffect } from 'react';
/* Styles: uses global index.css (.res-input, .auth-form-container, .section-tag, .btn-peach) */

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [booking, setBooking] = useState({ name: '', phone: '', date: '', time: '7:00 PM', guests: '2' });

  const fetchReservations = async () => {
    const token = localStorage.getItem('smartCartAuthToken');
    if (token) {
      try {
        const response = await fetch('https://yumcafe.onrender.com/api/reservation/myreservations', {
          method: 'GET',
          headers: { 'auth-token': token }
        });
        if (response.ok) {
          const json = await response.json();
          setReservations(json);
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    } else {
      const saved = JSON.parse(localStorage.getItem('smartCartReservations') || '[]');
      setReservations(saved);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    const token = localStorage.getItem('smartCartAuthToken');
    if (token) {
      try {
        const response = await fetch(`https://yumcafe.onrender.com/api/reservation/cancel/${id}`, {
          method: 'DELETE',
          headers: { 'auth-token': token }
        });
        if (response.ok) {
          fetchReservations();
        }
      } catch (error) {
        console.error("Error cancelling reservation:", error);
      }
    } else {
      const updated = reservations.filter(r => r.id !== id);
      setReservations(updated);
      localStorage.setItem('smartCartReservations', JSON.stringify(updated));
    }
  };

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
          // If not logged in, save to local storage as well so they can see it in this session
          const existing = JSON.parse(localStorage.getItem('smartCartReservations') || '[]');
          localStorage.setItem('smartCartReservations', JSON.stringify([...existing, { ...booking, id: json.reservation._id }]));
        }
        fetchReservations();
        alert(`🎉 Table booked successfully for ${booking.name} on ${booking.date} at ${booking.time} for ${booking.guests} guests!`);
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

  return (
    <div style={{ backgroundColor: 'var(--bg-dark)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main className="container py-5" style={{ flex: 1 }}>
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="section-tag">Your Tables</span>
            <h2 className="text-white fw-bold mb-0">My Reservations</h2>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-peach">
            + Book a Table
          </button>
        </div>

        {reservations.length === 0 ? (
          <div className="cart-page-empty" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '60px 20px', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>🍽️</span>
            <h3 className="text-white">No Reservations Found</h3>
            <p className="text-white-50 mb-4">You haven't booked any tables yet.</p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-trans" style={{ padding: '10px 24px' }}>
              Book Now
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {reservations.map(res => {
              const resId = res._id || res.id;
              return (
              <div key={resId} className="col-12 col-md-6 col-lg-4">
                <div style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.08)', 
                  borderRadius: '16px', 
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Decorative background element */}
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '100px',
                    height: '100px',
                    background: 'var(--brand-peach)',
                    filter: 'blur(50px)',
                    opacity: 0.1,
                    borderRadius: '50%'
                  }}></div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge" style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '6px 12px', borderRadius: '30px' }}>Confirmed</span>
                    <span className="text-white-50 small">#{resId ? resId.toString().slice(-6) : '000000'}</span>
                  </div>
                  
                  <h4 className="text-white mb-1">{res.name}</h4>
                  <p className="text-white-50 mb-4">📞 {res.phone}</p>
                  
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
                      <div className="text-white-50 small mb-1">Date</div>
                      <div className="text-white fw-bold">{res.date}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
                      <div className="text-white-50 small mb-1">Time</div>
                      <div className="text-white fw-bold">{res.time}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
                      <div className="text-white-50 small mb-1">Guests</div>
                      <div className="text-white fw-bold">{res.guests}</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleCancel(resId)}
                    className="btn w-100" 
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            )})}
          </div>
        )}
      </main>

      {/* TABLE RESERVATION MODAL (GLASSMORPHIC) */}
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
              position: 'relative',
              background: 'rgba(25,25,25,0.95)'
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
              </div>

              <button type="submit" className="btn btn-peach w-100 mt-4 py-3 fw-bold" style={{ fontSize: '1.1rem' }}>
                Confirm Reservation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
