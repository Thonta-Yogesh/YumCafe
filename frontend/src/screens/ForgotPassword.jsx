import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await axios.post('http://localhost:5001/api/auth/forgot-password', { email });
      if (response.data.success) {
        setMessage(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Server Error. Please try again later.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-bg d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
      <div className="auth-form-container text-center w-100 p-5 mt-4" style={{ maxWidth: '500px' }}>
        <h1 className="fw-bold mb-3" style={{ color: 'var(--text-white)' }}>Reset Password</h1>
        <p className="text-muted mb-4 fs-6">Enter your email address to receive a password reset link.</p>
        
        {message && <div className="alert alert-success border-0 rounded-4 p-3 shadow-sm mb-4" role="alert" style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>{message}</div>}
        {error && <div className="alert alert-danger border-0 rounded-4 p-3 shadow-sm mb-4" role="alert" style={{ fontSize: '0.95rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-start">
            <label htmlFor="forgotEmail" className="form-label fw-semibold text-white">Email Address</label>
            <input 
              type="email" 
              className="form-control form-control-lg bg-light border-0 px-4" 
              style={{ borderRadius: '20px' }}
              id="forgotEmail"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-peach w-100 fs-5 mt-2 py-2" disabled={loading}>
            {loading ? 'Sending Request...' : 'Send Reset Link'}
          </button>
          
          <div className="mt-4">
            <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: 'var(--accent-peach)' }}>
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
