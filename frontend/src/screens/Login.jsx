import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data.success) {
        localStorage.setItem('smartCartAuthToken', response.data.authToken);
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.data && typeof error.response.data === 'object' && error.response.data.success === false) {
        alert(error.response.data.error || "Login failed. Please check your credentials.");
      } else {
        alert("Server Error. Please try again later.");
      }
    }
    setLoading(false);
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-bg d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
      <div className="auth-form-container text-center w-100 p-5 mt-4">
        {/* Title tuned to the classy theme */}
        <h1 className="fw-bold mb-3" style={{ color: 'var(--text-white)' }}>Welcome Back</h1>
        <p className="text-muted mb-4 fs-5">Login to your <span style={{ color: 'var(--accent-peach)', fontWeight: 'bold' }}>Yum</span> profile.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-start">
            <label htmlFor="exampleInputEmail1" className="form-label fw-semibold text-white">Email Address</label>
            <input 
              type="email" 
              className="form-control form-control-lg bg-light border-0 px-4" 
              style={{ borderRadius: '20px' }}
              name="email" 
              value={credentials.email} 
              onChange={onChange} 
              id="exampleInputEmail1" 
              placeholder="name@example.com"
              required 
            />
          </div>
          <div className="mb-4 text-start">
            <label htmlFor="exampleInputPassword1" className="form-label fw-semibold text-white">Password</label>
            <input 
              type="password" 
              className="form-control form-control-lg bg-light border-0 px-4" 
              style={{ borderRadius: '20px' }}
              name="password" 
              value={credentials.password} 
              onChange={onChange} 
              id="exampleInputPassword1" 
              required
            />
          </div>
          
          <div className="text-end mb-4 px-2">
            <Link to="/forgot-password" style={{ color: 'var(--accent-peach)', textDecoration: 'none', fontWeight: '500' }}>
              Forgot Password?
            </Link>
          </div>
          
          <button type="submit" className="btn btn-peach w-100 fs-5 mt-3 py-2" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          
          <div className="mt-4 pt-2">
            <p className="text-muted">
              Don't have an account?{' '}
              <Link to="/signup" className="text-decoration-none fw-bold" style={{ color: 'var(--accent-peach)' }}>
                Join now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
