import React, { useState } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';

export default function Card({ foodItem }) {
  const dispatch = useDispatchCart();
  const data = useCart();
  const [qty, setQty] = useState(1);
  
  const handleAddToCart = async () => {
    let food = [];
    for (const item of data) {
      if (item.id === foodItem._id) {
        food = item;
        break;
      }
    }

    if (food.length !== 0) {
      await dispatch({ type: "UPDATE", id: foodItem._id, price: foodItem.price * qty, qty: qty })
      return;
    }

    await dispatch({ type: "ADD", id: foodItem._id, name: foodItem.name, price: foodItem.price * qty, qty: qty });
  };

  return (
    <div className="card classy-card mx-auto my-3 h-100" style={{ width: '100%', maxWidth: '24rem' }}>
      <div className="card-img-wrapper">
        <img src={foodItem.imageUrl} className="card-img-top-classy" alt={foodItem.name} />
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-2">{foodItem.name}</h5>
        <p className="card-text text-muted mb-3" style={{ fontSize: '0.95rem' }}>
          {foodItem.description}
        </p>
        
        <div className="mt-auto">
          {localStorage.getItem('smartCartAuthToken') ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="card-price">${foodItem.price}</span>
                <select className="qty-select" onChange={(e) => setQty(e.target.value)}>
                  {Array.from(Array(10), (e, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              
              <div className="d-flex justify-content-between align-items-center">
                <div className="fw-bold text-dark fs-5">
                  Total: ${(foodItem.price * qty).toFixed(2)}
                </div>
                <button className="btn btn-add-cart" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>
            </>
          ) : (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="card-price fs-4">${foodItem.price}</span>
              <a href="/login" className="btn btn-outline-danger" style={{ borderRadius: '30px', padding: '8px 20px' }}>
                Login to Order
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
