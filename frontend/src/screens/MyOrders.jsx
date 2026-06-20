import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Cart.css'; /* shared cart UI: .cart-page, .my-order-card, .cart-totals, etc. */

export default function MyOrders() {
  const [orderData, setOrderData] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const navigate = useNavigate();

  const fetchMyOrders = async () => {
    try {
      const response = await axios.get('https://yumcafe.onrender.com/api/order/myorders', {
        headers: {
          'auth-token': localStorage.getItem('smartCartAuthToken'),
        }
      });
      setOrderData(response.data);
    } catch (error) {
      console.log('Error fetching orders:', error.message);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('smartCartAuthToken')) {
      navigate('/login');
    } else {
      fetchMyOrders();
    }
  }, [navigate]);

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title text-center mb-5">My <span>Orders</span></h1>
        
        {orderData.length > 0 && (
          <div className="order-type-toggle mx-auto mb-5" style={{ maxWidth: '500px' }}>
            <button 
              className={`type-btn ${filterType === 'All' ? 'active' : ''}`}
              onClick={() => setFilterType('All')}
            >
              All Orders
            </button>
            <button 
              className={`type-btn ${filterType === 'Delivery' ? 'active' : ''}`}
              onClick={() => setFilterType('Delivery')}
            >
              🛵 Delivery
            </button>
            <button 
              className={`type-btn ${filterType === 'Table' ? 'active' : ''}`}
              onClick={() => setFilterType('Table')}
            >
              🍽️ Dine-In
            </button>
          </div>
        )}

        {orderData.length === 0 ? (
          <div className="cart-empty-container text-center">
            <h2 className="cart-empty-title">No Orders Yet</h2>
            <p className="cart-empty-sub">Looks like you haven't ordered anything yet.</p>
            <button className="btn btn-peach mt-4" onClick={() => navigate('/menu')}>Explore Menu</button>
          </div>
        ) : (
          <div className="row g-4">
            {orderData.filter((order) => {
              if (filterType === 'All') return true;
              return (order.orderType || 'Delivery') === filterType;
            }).map((order) => {
              const orderDate = new Date(order.date);
              const formattedDate = orderDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
              const formattedTime = orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              const type = order.orderType || 'Delivery';

              return (
                <div key={order._id} className="col-lg-6 col-md-12">
                  <div className="my-order-card overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-bottom border-secondary d-flex justify-content-between align-items-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div>
                        <h5 className="mb-1 text-white fw-bold" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '1px' }}>
                          ORDER #{order._id.substring(order._id.length - 6).toUpperCase()}
                        </h5>
                        <span className="d-block mt-2" style={{ color: '#ffb3a7', fontSize: '0.9rem', fontWeight: '500' }}>
                          📅 {formattedDate} <span className="mx-1">|</span> 🕒 {formattedTime}
                        </span>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-peach text-dark fs-6 rounded-pill px-3 py-2 fw-bold" style={{ letterSpacing: '0.5px' }}>
                          {type === 'Table' ? '🍽️ Dine-In Order' : '🛵 Delivery Order'}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex-grow-1 d-flex flex-column">
                      <div className="row mb-4">
                        <div className="col-sm-12 mb-3 mb-sm-0">
                          <strong className="d-block mb-2 text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {type === 'Table' ? 'Table Number:' : 'Delivery Address:'}
                          </strong>
                          <p className="text-muted mb-0">
                            {type === 'Table' 
                              ? (order.tableNo ? `Table ${order.tableNo}` : 'Table not specified')
                              : (order.address || 'Address not provided')}
                          </p>
                        </div>
                      </div>

                      <div className="cart-items-wrapper p-3 mb-4 flex-grow-1">
                        <strong className="d-block mb-3 text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Items Ordered</strong>
                        {order.items.map((item, index) => (
                          <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-secondary last-border-none">
                            <div className="text-white">
                              <span className="text-peach fw-bold me-2">{item.quantity}x</span> 
                              {item.name}
                            </div>
                            <div className="text-white fw-bold">₹{item.price * item.quantity}</div>
                          </div>
                        ))}
                      </div>

                      <div className="cart-totals pt-2 mb-0 mt-auto">
                        <div className="cart-total-row">
                          <span>Subtotal</span>
                          <span>₹{order.subTotal || order.totalAmount}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="cart-total-row text-success">
                            <span>Discount</span>
                            <span>-₹{order.discount}</span>
                          </div>
                        )}
                        {order.tax > 0 && (
                          <div className="cart-total-row text-muted">
                            <span>GST (5%)</span>
                            <span>₹{order.tax}</span>
                          </div>
                        )}
                        {type !== 'Table' && typeof order.deliveryFee !== 'undefined' && (
                          <div className="cart-total-row text-muted">
                            <span>Delivery Fee</span>
                            <span>{order.deliveryFee === 0 ? <span className="text-success">Free</span> : `₹${order.deliveryFee}`}</span>
                          </div>
                        )}
                        <div className="cart-total-row final-total mt-3 pt-3 border-top border-secondary">
                          <span>Total Paid</span>
                          <span className="text-peach">₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {orderData.filter((order) => {
              if (filterType === 'All') return true;
              return (order.orderType || 'Delivery') === filterType;
            }).length === 0 && (
              <div className="text-center w-100 mt-4">
                <p className="text-muted fs-5">No {filterType === 'Delivery' ? 'Delivery' : 'Dine-In'} orders found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
