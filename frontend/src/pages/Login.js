import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

const Login = () => {
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
      localStorage.setItem('token', response.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', response.user?.role || 'user');
      // Notify Navbar to update auth buttons immediately
      window.dispatchEvent(new Event('authChanged'));

      // Redirect based on user role
      if (response.user && response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Quick admin login function
  const handleAdminLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const adminCredentials = {
        email: 'admin@enjoydrive.com',
        password: 'admin123'
      };

      const response = await login(adminCredentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', 'admin');
      navigate('/admin');
    } catch (err) {
      setError('Admin login failed. Please check if admin account exists.');
    } finally {
      setLoading(false);
    }
  };

  // Demo user login function
  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const demoCredentials = {
        email: 'john@example.com',
        password: 'user123'
      };

      const response = await login(demoCredentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', 'user');
      navigate('/');
    } catch (err) {
      setError('Demo login failed. Please check if demo account exists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
      }}></div>

      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <h1 className="h3 fw-bold mb-2" style={{ color: '#333' }}>
                    Enjoy<span style={{ color: '#007bff' }}>Drive</span>
                  </h1>
                  <p className="text-muted">Sign in to your account</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger mb-4" role="alert">
                    {error}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                      style={{
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        padding: '12px'
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                      style={{
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        padding: '12px'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 mb-3"
                    disabled={loading}
                    style={{
                      backgroundColor: '#007bff',
                      border: 'none',
                      borderRadius: '5px',
                      color: 'white',
                      fontWeight: '500',
                      padding: '12px'
                    }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>

                {/* Register Link */}
                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary text-decoration-none fw-semibold">
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-4">
              <Link to="/" className="text-white text-decoration-none">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;