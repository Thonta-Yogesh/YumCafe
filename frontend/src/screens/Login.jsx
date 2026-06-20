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
      const response = await axios.post('https://yumcafe.onrender.com/api/auth/login', {
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
      <div className="auth-form-container text-center w-100 p-5 mt-4" style={{ maxWidth: '450px', borderRadius: '24px' }}>
        {/* Title tuned to the classy theme */}
        <h1 className="fw-bold mb-3" style={{ color: 'var(--text-white)' }}>Welcome Back</h1>
        <p className="text-muted mb-4 fs-5">Login to your <span style={{ color: 'var(--accent-peach)', fontWeight: 'bold' }}>Yum</span> profile.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-start">
            <label htmlFor="exampleInputEmail1" className="form-label fw-semibold text-white">Email Address</label>
            <input 
              type="email" 
              className="form-control form-control-lg px-4" 
              style={{ borderRadius: '15px' }}
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
              className="form-control form-control-lg px-4" 
              style={{ borderRadius: '15px' }}
              name="password" 
              value={credentials.password} 
              onChange={onChange} 
              id="exampleInputPassword1" 
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="text-end mb-4 px-2">
            <Link to="/forgot-password" style={{ color: 'var(--accent-peach)', textDecoration: 'none', fontWeight: '500' }}>
              Forgot Password?
            </Link>
          </div>
          
          <button type="submit" className="btn btn-peach w-100 justify-content-center fs-5 py-3 mb-4" disabled={loading} style={{ borderRadius: '15px' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          
          <div className="d-flex align-items-center mb-4">
            <hr className="flex-grow-1" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <span className="px-3 text-muted" style={{ fontSize: '0.85rem' }}>OR</span>
            <hr className="flex-grow-1" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          </div>

          <div className="d-flex flex-column gap-3 mb-4">
            <button type="button" className="btn btn-trans w-100 d-flex align-items-center justify-content-center gap-2 py-2" style={{ borderRadius: '15px' }}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px' }} />
              Continue with Google
            </button>
            <button type="button" className="btn btn-trans w-100 d-flex align-items-center justify-content-center gap-2 py-2" style={{ borderRadius: '15px' }}>
              <img src="https://www.svgrepo.com/show/452062/microsoft.svg" alt="Outlook" style={{ width: '20px' }} />
              Continue with Outlook
            </button>
          </div>
          
          <div className="mt-4 pt-2">
            <p className="text-muted">
              Don't have an account?{' '}
              <Link to="/signup" className="text-decoration-none fw-bold" style={{ color: 'var(--text-white)' }}>
                Sign up for free
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
