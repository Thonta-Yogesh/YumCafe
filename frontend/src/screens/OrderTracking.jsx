import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OrderTracking.css';

export default function OrderTracking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);

  // Fallback to 'Delivery' if someone hits this page directly
  const orderType = location.state?.orderType || 'Delivery';
  const tableNo = location.state?.tableNo || '';

  // Simulate order progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5; // Increases 5% every 1.5 seconds for demo
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const getStatus = () => {
    if (orderType === 'Table') {
      if (progress < 30) return "Order Received! 📝";
      if (progress < 80) return "Chef is Preparing your Meal 👨‍🍳";
      return "Food is Ready to be Served! 🍽️";
    } else {
      if (progress < 25) return "Order Received & Confirmed";
      if (progress < 50) return "Food is being Prepared 🍳";
      if (progress < 90) return "Out for Delivery 🛵";
      if (progress < 100) return "Arriving in 2 mins!";
      return "Delivered! Enjoy your meal 🍽️";
    }
  };

  const getEta = () => {
    if (progress >= 100) return orderType === 'Table' ? "Served" : "Arrived";
    const minsLeft = Math.ceil((100 - progress) / (orderType === 'Table' ? 5 : 3)); 
    return `${minsLeft} mins`;
  };

  return (
    <div className="tracking-page">
      <div className="container">
        <h1 className="tracking-title text-center">
          {orderType === 'Table' ? 'Your ' : 'Track Your '} 
          <span>Order</span>
        </h1>

        <div className="tracking-card mx-auto mt-5">
          <div className="tracking-header">
            <h3>{getStatus()}</h3>
            <span className="eta-badge">
              {orderType === 'Table' ? 'Wait Time: ' : 'ETA: '} {getEta()}
            </span>
          </div>

          {orderType === 'Delivery' ? (
            <>
              <div className="tracking-map-mockup">
                {/* The moving delivery bike */}
                <div 
                  className="delivery-bike" 
                  style={{ 
                    left: `calc(${progress}% - ${progress > 0 ? 30 : 0}px)`,
                    transform: 'scaleX(-1)'
                  }}
                >
                  🛵
                </div>
                
                {/* The progress line */}
                <div className="progress-line-bg">
                  <div 
                    className="progress-line-fill" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                {/* Stop points */}
                <div className="stop-point p1" title="Restaurant">🏢</div>
                <div className="stop-point p2" title="Destination">🏠</div>
              </div>

              <div className="tracking-details mt-5">
                <div className="detail-row">
                  <span className="detail-label">Delivery Partner:</span>
                  <span className="detail-value">Alex (⭐⭐⭐⭐⭐)</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Vehicle:</span>
                  <span className="detail-value">MH 12 AB 1234</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Contact:</span>
                  <span className="detail-value text-peach">+91 98765 43210</span>
                </div>
              </div>
            </>
          ) : (
            // Dine-In Specific View
            <div className="text-center mt-4">
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                👨‍🍳🥘
              </div>
              <div className="tracking-details mt-4 text-start">
                <div className="detail-row">
                  <span className="detail-label">Order Type:</span>
                  <span className="detail-value">Dine-In</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Table Number:</span>
                  <span className="detail-value text-peach fs-5 fw-bold">{tableNo || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value">{progress < 100 ? 'In Kitchen' : 'Served'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-5">
            <button className="btn btn-peach w-100 py-2 fs-5" onClick={() => navigate('/myorders')}>
              View My Orders
            </button>
            <button className="btn btn-link text-white mt-3 text-decoration-none" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
