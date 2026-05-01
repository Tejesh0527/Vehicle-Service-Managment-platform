import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  // ─── updateNavbar ─────────────────────────────────────────────────────────
  // Reads auth state fresh from localStorage on every call.
  // Equivalent to a global updateNavbar() function.
  const updateNavbar = () => {
    const isLogged = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (isLogged && token) {
      setIsLoggedIn(true);
      setUserRole(role || 'user');
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  };

  useEffect(() => {
    // Run on every page load
    updateNavbar();

    // Same-tab auth changes (login/logout)
    window.addEventListener('authChanged', updateNavbar);
    // Cross-tab changes
    window.addEventListener('storage', updateNavbar);

    return () => {
      window.removeEventListener('authChanged', updateNavbar);
      window.removeEventListener('storage', updateNavbar);
    };
  }, []); // eslint-disable-line


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole(null);
    window.dispatchEvent(new Event('authChanged'));
    navigate('/');
  };

  // ─── Button visibility logic ───────────────────────────────────────────────
  // ADMIN btn: visible when NOT logged in  OR  when logged in as admin
  //            hidden only when logged in as a normal user
  const showAdminBtn = !isLoggedIn || userRole === 'admin';
  // ADMIN btn destination: /admin if already admin, else admin login page
  const adminTarget = isLoggedIn && userRole === 'admin' ? '/admin' : '/admin/login';

  return (
    <header className="bg-white shadow-sm" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light py-3">

          {/* Brand */}
          <Link to="/" className="navbar-brand fw-bold" style={{ fontSize: '1.8rem', color: '#333' }}>
            Enjoy<span style={{ color: '#007bff' }}>Drive</span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-expanded={showMobileMenu}
            aria-controls="navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Nav Links + Auth */}
          <div className={`collapse navbar-collapse ${showMobileMenu ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link fw-semibold text-dark px-3">Home</Link>
              </li>
              <li className="nav-item">
                <a
                  href="#collection"
                  className="nav-link fw-semibold text-dark px-3"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('collection');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >Collection</a>
              </li>
              <li className="nav-item">
                <a
                  href="#testimonials"
                  className="nav-link fw-semibold text-dark px-3"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('testimonials');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >Testimonials</a>
              </li>
              <li className="nav-item">
                <a
                  href="#contact"
                  className="nav-link fw-semibold text-dark px-3"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >Contact</a>
              </li>
            </ul>

            {/* ── Auth Buttons ── */}
            <div className="d-flex align-items-center gap-2">

              {/* ADMIN — visible when not logged in (beside LOGIN) and when role=admin */}
              {showAdminBtn && (
                <button
                  id="admin-btn"
                  onClick={() => navigate(adminTarget)}
                  className="btn fw-semibold px-4 py-2"
                  style={{
                    backgroundColor: '#28a745',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '14px',
                    color: '#fff'
                  }}
                >
                  ADMIN
                </button>
              )}

              {isLoggedIn ? (
                <>
                  {/* MY BOOKINGS — all logged-in users */}
                  <Link
                    to="/bookings"
                    className="btn btn-outline-primary fw-semibold px-4 py-2"
                    style={{ borderRadius: '5px', fontSize: '14px' }}
                  >
                    MY BOOKINGS
                  </Link>

                  {/* LOGOUT */}
                  <button
                    id="logout-btn"
                    onClick={handleLogout}
                    className="btn text-white fw-semibold px-4 py-2"
                    style={{
                      backgroundColor: '#dc3545',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '14px'
                    }}
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <>
                  {/* LOGIN */}
                  <Link
                    id="login-btn"
                    to="/login"
                    className="btn text-white fw-semibold px-4 py-2"
                    style={{
                      backgroundColor: '#007bff',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '14px',
                      textDecoration: 'none'
                    }}
                  >
                    LOGIN
                  </Link>
                </>
              )}

            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;