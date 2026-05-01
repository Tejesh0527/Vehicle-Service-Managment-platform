import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(form);

      // Check if user is admin
      if (response.user && response.user.role === 'admin') {
        localStorage.setItem('token', response.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', 'admin');
        // Notify Navbar to update auth buttons immediately
        window.dispatchEvent(new Event('authChanged'));
        navigate('/admin');
      } else {
        setError('Access denied. Admin credentials required.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
      style={{
        backgroundImage: `url('/images/back.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(2px)'
        }}
      />
      {/* Back to Site Link */}
      <Link
        to="/"
        className="position-absolute text-decoration-none d-flex align-items-center"
        style={{
          top: '25px',
          left: '25px',
          fontSize: '14px',
          color: '#ffffff',
          opacity: '0.9',
          fontWeight: '400',
          zIndex: 2
        }}
      >
        <i className="fas fa-arrow-left me-2"></i>
        Back to Site
      </Link>

      {/* Login Card */}
      <div
        className="card border-0 shadow-lg"
        style={{
          width: '380px',
          height: 'auto',
          borderRadius: '15px',
          backgroundColor: '#ffffff',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div className="card-body d-flex flex-column justify-content-center" style={{ padding: '40px 35px' }}>
          {/* Header */}
          <div className="text-center mb-4">
            <h2
              className="mb-0"
              style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#2c3e50',
                letterSpacing: '-0.5px'
              }}
            >
              Admin Login
            </h2>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              className="alert alert-danger mb-4 d-flex align-items-center"
              role="alert"
              style={{
                fontSize: '14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '12px 16px'
              }}
            >
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Username"
                required
                disabled={loading}
                style={{
                  height: '50px',
                  borderRadius: '8px',
                  border: '1px solid #e1e5e9',
                  padding: '0 18px',
                  fontSize: '15px',
                  backgroundColor: '#f8f9fa',
                  color: '#495057',
                  transition: 'all 0.3s ease',
                  boxShadow: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#007bff';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e5e9';
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                disabled={loading}
                style={{
                  height: '50px',
                  borderRadius: '8px',
                  border: '1px solid #e1e5e9',
                  padding: '0 18px',
                  fontSize: '15px',
                  backgroundColor: '#f8f9fa',
                  color: '#495057',
                  transition: 'all 0.3s ease',
                  boxShadow: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#007bff';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e5e9';
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
              />
            </div>

            <button
              type="submit"
              className="btn w-100"
              disabled={loading}
              style={{
                height: '50px',
                backgroundColor: '#2c3e50',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(44, 62, 80, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#34495e';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(44, 62, 80, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#2c3e50';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(44, 62, 80, 0.3)';
                }
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Logging in...
                </>
              ) : 'Login'}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
