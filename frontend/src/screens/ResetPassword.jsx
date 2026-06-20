import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await axios.post('https://yumcafe.onrender.com/api/auth/reset-password', {
        email,
        token,
        newPassword: passwords.newPassword
      });
      if (response.data.success) {
        setMessage(response.data.message + ' Redirecting to login page...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
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

  const onChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-bg d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
      <div className="auth-form-container text-center w-100 p-5 mt-4" style={{ maxWidth: '500px' }}>
        <h1 className="fw-bold mb-3" style={{ color: 'var(--text-white)' }}>Set New Password</h1>
        <p className="text-muted mb-4 fs-6">Enter and confirm your new password below.</p>
        
        {message && <div className="alert alert-success border-0 rounded-4 p-3 shadow-sm mb-4" role="alert" style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>{message}</div>}
        {error && <div className="alert alert-danger border-0 rounded-4 p-3 shadow-sm mb-4" role="alert" style={{ fontSize: '0.95rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-start">
            <label htmlFor="newPassword" className="form-label fw-semibold text-white">New Password</label>
            <input 
              type="password" 
              className="form-control form-control-lg bg-light border-0 px-4" 
              style={{ borderRadius: '20px' }}
              id="newPassword"
              name="newPassword"
              value={passwords.newPassword}
              onChange={onChange}
              placeholder="••••••••"
              required 
              minLength="6"
            />
          </div>

          <div className="mb-4 text-start">
            <label htmlFor="confirmPassword" className="form-label fw-semibold text-white">Confirm New Password</label>
            <input 
              type="password" 
              className="form-control form-control-lg bg-light border-0 px-4" 
              style={{ borderRadius: '20px' }}
              id="confirmPassword"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={onChange}
              placeholder="••••••••"
              required 
              minLength="6"
            />
          </div>
          
          <button type="submit" className="btn btn-peach w-100 fs-5 mt-2 py-2" disabled={loading}>
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
