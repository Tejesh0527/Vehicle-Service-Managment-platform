import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate terms acceptance
    if (!acceptedTerms) {
      setError('You must accept the Terms and Conditions to register');
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { name, email, password } = form;
      const response = await register({ name, email, password });
      localStorage.setItem('token', response.token);
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
                  <p className="text-muted">Create your account</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger mb-4" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                {/* Success Alert */}
                {success && (
                  <div className="alert alert-success mb-4" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    {success}
                  </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                      disabled={loading}
                      style={{
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        padding: '12px'
                      }}
                    />
                  </div>

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

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                      disabled={loading}
                      minLength="6"
                      style={{
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        padding: '12px'
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                      disabled={loading}
                      style={{
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        padding: '12px'
                      }}
                    />
                  </div>

                  {/* Terms and Conditions Checkbox */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="acceptTerms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        disabled={loading}
                        required
                      />
                      <label className="form-check-label" htmlFor="acceptTerms">
                        <small>
                          I agree to the{' '}
                          <a
                            href="#"
                            className="text-primary text-decoration-none"
                            onClick={(e) => {
                              e.preventDefault();
                              // You can add a modal or redirect to terms page here
                              alert('Terms and Conditions:\n\n1. You must be 18+ years old to rent vehicles\n2. Valid driving license required\n3. Security deposit may be required\n4. Damage to vehicle will be charged\n5. Late returns incur additional fees\n\nBy using our service, you agree to these terms.');
                            }}
                          >
                            Terms and Conditions
                          </a>
                        </small>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 mb-4"
                    disabled={loading || !acceptedTerms}
                    style={{
                      backgroundColor: acceptedTerms ? '#007bff' : '#6c757d',
                      border: 'none',
                      borderRadius: '5px',
                      color: 'white',
                      fontWeight: '500',
                      padding: '12px',
                      cursor: acceptedTerms ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;