import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVehicleById } from '../services/vehicleService';
import { createBooking } from '../services/bookingService';

const Book = () => {
  const { id } = useParams(); // Get vehicle ID from URL
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [vehicleId, setVehicleId] = useState(id || '');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Data is now managed by centralized dataService

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to make a booking');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    // Fetch vehicle from backend API if ID is provided
    const fetchData = async () => {
      try {
        if (id) {
          const vehicleData = await getVehicleById(id);
          console.log('Fetched vehicle for booking:', vehicleData);
          if (vehicleData) {
            setSelectedVehicle(vehicleData);
            setVehicleId(id);
            setVehicles([vehicleData]); // Set vehicles array with single vehicle
          }
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        setVehicles([]);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to make a booking.');
      navigate('/login');
      return;
    }

    // Validate dates
    const today = new Date().toISOString().split('T')[0];
    if (startDate < today) {
      setError('Pickup date cannot be in the past.');
      return;
    }
    if (endDate <= startDate) {
      setError('Return date must be after pickup date.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Get user info from localStorage (in a real app, this would come from auth context)
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

      // Calculate total price
      const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
      const totalPrice = days * selectedVehicle.pricePerDay;

      // Create booking data - match backend API expectations
      const bookingData = {
        vehicle: selectedVehicle._id, // Backend expects vehicle ID, not object
        startDate,
        endDate
        // totalPrice will be calculated by backend
        // user will be extracted from JWT token by backend
      };

      // Submit booking to backend API
      const result = await createBooking(bookingData);
      console.log('Booking created:', result);

      setSuccess('Booking submitted successfully! Your booking is pending confirmation.');
      setStartDate('');
      setEndDate('');

      // Redirect to bookings page after 2 seconds
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Booking failed');
    }
    setLoading(false);
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-2" style={{ fontWeight: 700 }}>Book a Vehicle</h1>
      <p className="text-center mb-4 text-muted" style={{ fontSize: '1.2rem' }}>Make your reservation today</p>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Selected Vehicle Info */}
          {selectedVehicle && (
            <div className="card mb-4">
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={selectedVehicle.image}
                    alt={selectedVehicle.name}
                    className="img-fluid rounded-start h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{selectedVehicle.name}</h5>
                    <p className="card-text">{selectedVehicle.description}</p>
                    <p className="card-text">
                      <strong className="text-primary">${selectedVehicle.pricePerDay}/day</strong>
                    </p>
                    <small className="text-muted">Year: {selectedVehicle.year}</small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking Form */}
          <div className="card">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="row mb-3">
                  <div className="col-12 mb-3">
                    <label className="form-label fw-bold">Select Vehicle</label>
                    <select
                      className="form-select"
                      value={vehicleId}
                      onChange={(e) => {
                        setVehicleId(e.target.value);
                        const vehicle = vehicles.find(v => v._id === e.target.value);
                        setSelectedVehicle(vehicle);
                      }}
                      required
                    >
                      <option value="">Choose a vehicle</option>
                      {vehicles.map(v => (
                        <option key={v._id} value={v._id}>
                          {v.name} - ${v.pricePerDay}/day
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">
                      <i className="fas fa-calendar-alt me-2"></i>Pickup Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">
                      <i className="fas fa-calendar-alt me-2"></i>Return Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                {/* Price Calculation */}
                {selectedVehicle && startDate && endDate && (
                  <div className="alert alert-info mb-3">
                    <h6 className="mb-2">Booking Summary:</h6>
                    <div className="d-flex justify-content-between">
                      <span>Duration:</span>
                      <span>{Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} days</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Rate per day:</span>
                      <span>${selectedVehicle.pricePerDay}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total:</span>
                      <span>${Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) * selectedVehicle.pricePerDay}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing Booking...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-car me-2"></i>
                      SUBMIT BOOKING
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
