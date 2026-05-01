import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <section
      className="hero-banner position-relative d-flex align-items-center justify-content-center text-white"
      style={{
        height: '100vh',
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80") center/cover no-repeat'
      }}
    >
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Main Heading - Matching your screenshot */}
            <h1
              className="display-3 fw-bold text-white mb-4"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em'
              }}
            >
              Masters in Car Rental Services
            </h1>

            {/* Subtitle - Matching your screenshot */}
            <p
              className="lead text-white mb-5"
              style={{
                fontSize: '1.25rem',
                opacity: '0.9',
                maxWidth: '600px',
                margin: '0 auto 3rem auto'
              }}
            >
              Drive our cars and enjoy the ride and fly into your dreams.
            </p>

            {/* Action Buttons - Matching your screenshot exactly */}
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
              {/* VIEW OUR COLLECTION Button */}
              <button
                onClick={() => {
                  const element = document.getElementById('collection');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="btn text-white fw-semibold px-4 py-3"
                style={{
                  backgroundColor: '#007bff',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                  minWidth: '200px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer'
                }}
              >
                VIEW OUR COLLECTION
              </button>

              {/* LOGIN TO BOOK Button */}
              {!isLoggedIn ? (
                <Link
                  to="/login"
                  className="btn text-white fw-semibold px-4 py-3"
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid white',
                    borderRadius: '5px',
                    fontSize: '14px',
                    textDecoration: 'none',
                    minWidth: '200px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  LOGIN TO BOOK
                </Link>
              ) : (
                <Link
                  to="/bookings"
                  className="btn text-white fw-semibold px-4 py-3"
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid white',
                    borderRadius: '5px',
                    fontSize: '14px',
                    textDecoration: 'none',
                    minWidth: '200px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  MY BOOKINGS
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Car silhouette overlay - to match the aesthetic */}
      <div
        className="position-absolute"
        style={{
          bottom: '0',
          right: '0',
          width: '50%',
          height: '60%',
          background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1000 600\'%3E%3Cpath d=\'M100 400c0-50 40-90 90-90h620c50 0 90 40 90 90v100H100v-100z\' fill=\'rgba(255,255,255,0.05)\'/%3E%3C/svg%3E") no-repeat center',
          backgroundSize: 'contain',
          opacity: '0.3',
          pointerEvents: 'none'
        }}
      />
    </section>
  );
};

export default HeroBanner;
