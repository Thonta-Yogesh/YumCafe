import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyOrders() {
  const [orderData, setOrderData] = useState([]);

  const fetchMyOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/order/myorders', {
        headers: {
          'auth-token': localStorage.getItem('authToken'),
        }
      });
      setOrderData(response.data);
    } catch (error) {
      console.log('Error fetching orders:', error.message);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Orders History</h2>
      {orderData.length !== 0 ? orderData.map((order) => {
        return (
          <div key={order._id} className="card mb-4 shadow-sm">
            <div className="card-header bg-light d-flex justify-content-between">
              <strong>Order Date: {new Date(order.date).toLocaleString()}</strong>
              <span className="badge bg-success">Total: ${order.totalAmount}</span>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {order.items.map((item, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    {item.name} x {item.quantity}
                    <span>${item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      }) : (
        <h4>No orders found!</h4>
      )}
    </div>
  );
}
