import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './ContextReducer';

export default function Navbar() {
  const navigate = useNavigate();
  const cartItems = useCart();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg custom-navbar navbar-light">
        <div className="container-fluid">
          <Link className="navbar-brand fs-2 font-weight-bold" to="/" style={{color: '#ff6b6b'}}>HungryApp</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link fs-5 mx-3 active" aria-current="page" to="/">Home</Link>
              </li>
              {localStorage.getItem('authToken') &&
                <li className="nav-item">
                  <Link className="nav-link fs-5 mx-3 active" aria-current="page" to="/myorders">My Orders</Link>
                </li>
              }
            </ul>

            <div className="d-flex">
              {!localStorage.getItem('authToken') ?
                <div className="d-flex">
                  <Link className="btn btn-outline-primary mx-1" to="/login">Login</Link>
                  <Link className="btn btn-primary mx-1" to="/signup">Signup</Link>
                </div>
                :
                <div>
                  <Link className="btn btn-outline-success mx-1 position-relative" to="/cart">
                    My Cart
                    {cartItems.length > 0 &&
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartItems.length}
                      </span>
                    }
                  </Link>
                  <button onClick={handleLogout} className="btn btn-danger mx-1">Logout</button>
                </div>
              }
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
