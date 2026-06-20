import React, { useState, useEffect } from 'react';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export default function Cart() {
  const data = useCart();
  const dispatch = useDispatchCart();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState('Delivery'); // 'Delivery' or 'Table'
  const [tableNo, setTableNo] = useState('');
  
  // Granular Delivery Fields
  const [flatNo, setFlatNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  if (data.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty-container text-center">
            <h2 className="cart-empty-title text-white">Your Tray is Empty</h2>
            <p className="cart-empty-sub">Explore our menu and add some delicious items!</p>
            <button className="btn btn-peach mt-4 fw-bold" onClick={() => navigate('/menu')}>Explore Menu</button>
          </div>
        </div>
      </div>
    );
  }

  // Calculations
  const subTotal = data.reduce((total, food) => total + food.price * food.qty, 0);
  const discountAmount = Math.floor(subTotal * (discountPercent / 100));
  const tax = Math.floor((subTotal - discountAmount) * 0.05); // 5% GST
  const deliveryFee = orderType === 'Delivery' ? (subTotal > 500 ? 0 : 40) : 0; // Flat ₹40 or Free > ₹500
  const finalTotal = subTotal - discountAmount + tax + deliveryFee;

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === 'YUM10') {
      setDiscountPercent(10);
      alert('Coupon Applied: 10% OFF!');
    } else if (coupon.toUpperCase() === 'YUM20') {
      setDiscountPercent(20);
      alert('Coupon Applied: 20% OFF!');
    } else {
      setDiscountPercent(0);
      alert('Invalid Coupon Code');
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            if (response.data && response.data.address) {
              const addr = response.data.address;
              const building = addr.building || addr.house_number || addr.residential || '';
              const streetName = addr.road || addr.neighbourhood || addr.suburb || '';
              const city = addr.city || addr.town || addr.village || addr.county || '';
              const state = addr.state || '';
              const postcode = addr.postcode || '';
              
              setFlatNo(building);
              setStreet(streetName);
              
              const landmarkArr = [city, state, postcode].filter(Boolean);
              setLandmark(landmarkArr.join(', '));
            }
          } catch (error) {
            console.error("Error fetching location details:", error);
            alert("Could not fetch location details. Please enter manually.");
          } finally {
            setIsFetchingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Please allow location access to use this feature.");
          setIsFetchingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleCheckOut = async () => {
    let fullAddress = '';
    if (orderType === 'Delivery') {
      if (!flatNo || !street) {
        alert('Please fill in your Flat/Building and Street address.');
        return;
      }
      fullAddress = `${flatNo}, ${street}, ${landmark ? 'Landmark: ' + landmark : ''}`;
    } else if (orderType === 'Table') {
      if (!tableNo.trim()) {
        alert('Please enter your Table Number.');
        return;
      }
    }

    try {
      const response = await axios.post(
        'http://localhost:5001/api/order/place',
        {
          items: data.map(item => ({ foodId: item.id, name: item.name, quantity: item.qty, price: item.price })),
          subTotal,
          discount: discountAmount,
          tax,
          deliveryFee,
          totalAmount: finalTotal,
          orderType,
          address: fullAddress,
          tableNo: orderType === 'Table' ? tableNo : ''
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('smartCartAuthToken'),
          }
        }
      );
      if (response.data.success) {
        dispatch({ type: 'DROP' });
        navigate('/tracking', { state: { orderType, tableNo: orderType === 'Table' ? tableNo : '' } });
      }
    } catch(err) {
      console.error(err);
      alert("Checkout Failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title text-center mb-5">Checkout <span>Securely</span></h1>
        
        <div className="row g-5">
          {/* Left Column: Cart Items & Details */}
          <div className="col-lg-7">
            
            <div className="cart-checkout-card mb-4 p-4">
              <h3 className="cart-section-title">Order Type</h3>
              {/* Order Type Toggle */}
              <div className="order-type-toggle">
                <button 
                  className={`type-btn ${orderType === 'Delivery' ? 'active' : ''}`}
                  onClick={() => setOrderType('Delivery')}
                >
                  🛵 Delivery
                </button>
                <button 
                  className={`type-btn ${orderType === 'Table' ? 'active' : ''}`}
                  onClick={() => setOrderType('Table')}
                >
                  🍽️ Dine-In (Table)
                </button>
              </div>

              {/* Dynamic Input based on Order Type */}
              <div className="cart-form-group mt-4">
                {orderType === 'Delivery' ? (
                  <div className="delivery-address-form">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <label className="mb-0">Delivery Address</label>
                      <button className="btn-use-location" onClick={handleUseCurrentLocation} disabled={isFetchingLocation}>
                        {isFetchingLocation ? '📍 Fetching...' : '📍 Use My Current Location'}
                      </button>
                    </div>
                    <div className="row g-3">
                      <div className="col-12">
                        <input type="text" className="cart-input" placeholder="Flat, Housing no., Building, Apartment" value={flatNo} onChange={e => setFlatNo(e.target.value)} />
                      </div>
                      <div className="col-12">
                        <input type="text" className="cart-input" placeholder="Area, Street, Sector, Village" value={street} onChange={e => setStreet(e.target.value)} />
                      </div>
                      <div className="col-12">
                        <input type="text" className="cart-input" placeholder="Landmark (Optional)" value={landmark} onChange={e => setLandmark(e.target.value)} />
                      </div>
                    </div>
                    <div className="mt-4 p-3 eta-box">
                      <strong>⏳ Estimated Delivery Time:</strong> 30 - 45 mins
                    </div>
                  </div>
                ) : (
                  <div className="table-booking-form">
                    <label>Table Number</label>
                    <input 
                      type="text" 
                      className="cart-input" 
                      placeholder="e.g. Table 4"
                      value={tableNo}
                      onChange={(e) => setTableNo(e.target.value)}
                    />
                    <div className="mt-4 p-3 eta-box">
                      <strong>👨‍🍳 Estimated Preparation Time:</strong> 15 - 20 mins
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="cart-items-wrapper">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="cart-section-title mb-0">Order Items</h3>
                <button 
                  className="btn btn-sm p-0 border-0" 
                  onClick={() => dispatch({ type: "DROP" })}
                  style={{ fontSize: '0.9rem', color: '#ffb3a7', textDecoration: 'underline' }}
                >
                  Clear Tray
                </button>
              </div>
              {data.map((food, index) => (
                <div key={index} className="cart-item">
                  <div className="cart-item-details">
                    <h5 className="cart-item-name">{food.name}</h5>
                    <div className="cart-item-meta">
                      <span className="cart-item-qty">Qty: {food.qty}</span>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <span className="cart-item-price">₹{(food.price * food.qty).toLocaleString('en-IN')}</span>
                    <button className="cart-item-remove" onClick={() => dispatch({ type: 'REMOVE', index: index })}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Billing Summary */}
          <div className="col-lg-5">
            <div className="cart-checkout-card sticky-card">
              <h3 className="cart-section-title">Billing Details</h3>

              {/* Coupon Code */}
              <div className="cart-form-group mb-4">
                <label>Apply Coupon</label>
                <div className="coupon-wrap">
                  <input 
                    type="text" 
                    className="cart-input" 
                    placeholder="Try YUM10 or YUM20" 
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <button className="btn-coupon" onClick={handleApplyCoupon}>Apply</button>
                </div>
                {discountPercent > 0 && <small className="text-success mt-1 d-block">✅ {discountPercent}% discount applied</small>}
              </div>

              <hr className="cart-divider" />

              {/* Totals */}
              <div className="cart-totals">
                <div className="cart-total-row">
                  <span>Item Total</span>
                  <span>₹{subTotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="cart-total-row text-success">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="cart-total-row">
                  <span>GST (5%)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                
                {orderType === 'Delivery' && (
                  <div className="cart-total-row">
                    <span>Delivery Partner Fee</span>
                    <span>{deliveryFee === 0 ? <span className="text-success">Free</span> : `₹${deliveryFee}`}</span>
                  </div>
                )}
                
                <div className="cart-total-row final-total mt-3 pt-3 border-top border-secondary">
                  <span>To Pay</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="secure-checkout-badge mb-3 text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <small>🔒 Secure SSL Payment</small>
              </div>

              <button className="btn btn-peach btn-checkout w-100" onClick={handleCheckOut}>
                Place Order (₹{finalTotal.toLocaleString('en-IN')})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
