import React from 'react';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import axios from 'axios';

export default function Cart() {
  const data = useCart();
  const dispatch = useDispatchCart();

  if (data.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2>The Cart is Empty!</h2>
      </div>
    );
  }

  const handleCheckOut = async () => {
    const userEmail = localStorage.getItem('userEmail');
    try {
      const response = await axios.post(
        'http://localhost:5001/api/order/place',
        {
          items: data.map(item => ({ foodId: item.id, name: item.name, quantity: item.qty, price: item.price })),
          totalAmount: totalPrice
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('authToken'),
          }
        }
      );
      if (response.data.success) {
        dispatch({ type: 'DROP' });
        alert('Checkout Successful!');
      }
    } catch(err) {
      alert("Checkout Failed. Make sure you are logged in.");
    }
  };

  const totalPrice = data.reduce((total, food) => total + food.price, 0);

  return (
    <div className="container mt-5">
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Amount</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>${food.price}</td>
                <td>
                  <button type="button" className="btn btn-danger p-1" onClick={() => { dispatch({ type: 'REMOVE', index: index }) }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div><h1 className='fs-2 mt-4'>Total Price: ${totalPrice}</h1></div>
        <div>
          <button className='btn bg-success mt-3 text-white px-4 fs-5' onClick={handleCheckOut}>Checkout</button>
        </div>
      </div>
    </div>
  );
}
