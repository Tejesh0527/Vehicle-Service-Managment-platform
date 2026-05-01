import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookings, updateBookingStatus } from '../services/bookingService';
import { setVehicleAvailability } from '../services/vehicleService';

// ─── Sidebar Component ────────────────────────────────────────────────────────
const AdminSidebar = ({ navigate }) => (
  <aside style={{ width: 200, background: '#2c3e50', color: '#fff', minHeight: '100vh' }} className="p-3">
    <h4 className="text-white mb-4">Admin Panel</h4>
    <ul className="nav flex-column">
      <li className="nav-item mb-2">
        <button className="btn btn-link text-white text-start w-100 p-2" onClick={() => navigate('/admin')}>
          <i className="fas fa-tachometer-alt me-2"></i> Dashboard
        </button>
      </li>
      <li className="nav-item mb-2">
        <button className="btn btn-link text-white text-start w-100 p-2" onClick={() => navigate('/admin/cars')}>
          <i className="fas fa-motorcycle me-2"></i> Vehicles
        </button>
      </li>
      <li className="nav-item mb-2">
        <button className="btn btn-link text-white text-start w-100 p-2" onClick={() => navigate('/admin/users')}>
          <i className="fas fa-users me-2"></i> Users
        </button>
      </li>
      <li className="nav-item mb-2">
        <button className="btn btn-link text-white text-start w-100 p-2 active" onClick={() => navigate('/admin/bookings')}>
          <i className="fas fa-calendar-alt me-2"></i> Bookings
        </button>
      </li>
    </ul>
  </aside>
);

// ─── Status badge helper ──────────────────────────────────────────────────────
const statusBadgeClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'pending')   return 'bg-warning text-dark';
  if (s === 'confirmed') return 'bg-success';
  if (s === 'completed') return 'bg-primary';
  if (s === 'cancelled') return 'bg-danger';
  return 'bg-secondary';
};

// ─── Extract vehicle ID from a booking object ─────────────────────────────────
const getVehicleId = (booking) =>
  booking.vehicle?._id || booking.vehicle?.id || booking.vehicleId || null;

const AllBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Fetch bookings on mount ──────────────────────────────────────────────
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getBookings();
        setBookings(data);
        setFilteredBookings(data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setBookings([]);
        setFilteredBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // ── Filter helper ────────────────────────────────────────────────────────
  const applyFilter = (list, filter) => {
    if (filter === 'All') return list;
    return list.filter(b => (b.status || '').toLowerCase() === filter.toLowerCase());
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setFilteredBookings(applyFilter(bookings, filter));
  };

  // ── Central status update with vehicle availability sync ─────────────────
  const updateStatus = async (booking, newStatus) => {
    setActionLoading(true);
    try {
      await updateBookingStatus(booking._id || booking.id, newStatus);

      // ── Vehicle availability sync ──────────────────────────────────────
      const vehicleId = getVehicleId(booking);
      if (vehicleId) {
        if (newStatus === 'confirmed') {
          // Confirmed → vehicle becomes unavailable for other users
          setVehicleAvailability(vehicleId, false);
        } else if (newStatus === 'completed' || newStatus === 'cancelled') {
          // Returned / Cancelled → vehicle becomes available again
          setVehicleAvailability(vehicleId, true);
        }
      }

      // ── Update local state ────────────────────────────────────────────
      const updatedBookings = bookings.map(b =>
        (b.id === booking.id || b._id === booking._id) ? { ...b, status: newStatus } : b
      );
      setBookings(updatedBookings);
      setFilteredBookings(applyFilter(updatedBookings, activeFilter));

      // Close modal if open
      setShowModal(false);
      setSelectedBooking(null);
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('Failed to update booking status. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="d-flex" style={{ minHeight: '100vh' }}>
        <AdminSidebar navigate={navigate} />
        <main className="flex-grow-1" style={{ background: '#ecf0f1' }}>
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading bookings...</p>
          </div>
        </main>
      </div>
    );
  }

  const FILTERS = ['All', 'pending', 'confirmed', 'completed', 'cancelled'];
  const filterColors = { All: 'primary', pending: 'warning', confirmed: 'success', completed: 'info', cancelled: 'danger' };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <AdminSidebar navigate={navigate} />

      <main className="flex-grow-1" style={{ background: '#ecf0f1' }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-4 bg-white border-bottom">
          <h2 className="mb-0">Manage Bookings</h2>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => { localStorage.removeItem('token'); navigate('/admin/login'); }}
          >
            <i className="fas fa-sign-out-alt me-1"></i> Logout
          </button>
        </div>

        <div className="p-4">
          {/* ── Filter Tabs ── */}
          <div className="mb-4 d-flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`btn btn-sm ${activeFilter === f ? `btn-${filterColors[f]}` : `btn-outline-${filterColors[f]}`}`}
                onClick={() => handleFilterChange(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* ── Bookings Table ── */}
          <div className="bg-white rounded shadow-sm">
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead style={{ background: '#f8f9fa' }}>
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Pickup</th>
                    <th className="px-4 py-3">Return</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-4 text-muted">
                        No bookings found for this filter.
                      </td>
                    </tr>
                  ) : filteredBookings.map((booking) => (
                    <tr key={booking.id || booking._id}>
                      <td className="px-4 py-3">{booking.id || booking._id}</td>
                      <td className="px-4 py-3">
                        <div>{booking.user?.name || booking.user?.email || booking.user || 'Unknown'}</div>
                        <small className="text-muted">{booking.user?.email || booking.email || ''}</small>
                      </td>
                      <td className="px-4 py-3">
                        <div>{booking.vehicle?.name || booking.car || 'Unknown Vehicle'}</div>
                        <small className="text-muted">{booking.vehicle?.category || booking.vehicle?.type || booking.model || ''}</small>
                      </td>
                      <td className="px-4 py-3">
                        {booking.pickupDate || (booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A')}
                      </td>
                      <td className="px-4 py-3">
                        {booking.returnDate || (booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A')}
                      </td>
                      <td className="px-4 py-3">${booking.totalPrice || booking.totalAmount || 'N/A'}</td>
                      <td className="px-4 py-3">
                        {/* Status dropdown with vehicle sync */}
                        <select
                          className="form-select form-select-sm"
                          value={booking.status || 'pending'}
                          disabled={actionLoading}
                          onChange={(e) => updateStatus(booking, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed (Returned)</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="btn btn-info btn-sm me-1"
                          onClick={() => { setSelectedBooking(booking); setShowModal(true); }}
                        >
                          <i className="fas fa-eye me-1"></i> View
                        </button>
                        {/* Quick action buttons */}
                        {(booking.status || '').toLowerCase() === 'pending' && (
                          <button
                            className="btn btn-success btn-sm"
                            disabled={actionLoading}
                            onClick={() => updateStatus(booking, 'confirmed')}
                            title="Confirm booking → marks vehicle unavailable"
                          >
                            <i className="fas fa-check me-1"></i> Confirm
                          </button>
                        )}
                        {(booking.status || '').toLowerCase() === 'confirmed' && (
                          <button
                            className="btn btn-primary btn-sm"
                            disabled={actionLoading}
                            onClick={() => updateStatus(booking, 'completed')}
                            title="Mark as returned → vehicle becomes available again"
                          >
                            <i className="fas fa-undo me-1"></i> Returned
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* ── Booking Detail Modal ── */}
      {showModal && selectedBooking && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Booking Details — ID: {selectedBooking.id || selectedBooking._id || 'N/A'}
                </h5>
                <button type="button" className="btn-close" onClick={() => { setShowModal(false); setSelectedBooking(null); }}></button>
              </div>
              <div className="modal-body">
                {/* Vehicle availability alert */}
                {(selectedBooking.status || '').toLowerCase() === 'confirmed' && (
                  <div className="alert alert-warning d-flex align-items-center mb-3" role="alert">
                    <i className="fas fa-car me-2"></i>
                    <strong>Vehicle is currently marked as Unavailable</strong>
                    &nbsp;— it will become available again when you click "Mark Returned".
                  </div>
                )}

                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Customer Information</h6>
                    <p><strong>Name:</strong> {
                      typeof selectedBooking.user === 'object'
                        ? (selectedBooking.user?.name || selectedBooking.user?.email || 'Unknown')
                        : (selectedBooking.user || 'Unknown')
                    }</p>
                    <p><strong>Email:</strong> {
                      typeof selectedBooking.user === 'object'
                        ? (selectedBooking.user?.email || 'No email')
                        : (selectedBooking.email || 'No email')
                    }</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Vehicle Information</h6>
                    <p><strong>Vehicle:</strong> {
                      typeof selectedBooking.vehicle === 'object'
                        ? (selectedBooking.vehicle?.name || 'Unknown')
                        : (selectedBooking.car || 'Unknown')
                    }</p>
                    <p><strong>Category:</strong> {
                      (selectedBooking.vehicle?.category || selectedBooking.vehicle?.type || selectedBooking.model || 'N/A')
                    }</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Booking Details</h6>
                    <p><strong>Pickup:</strong> {
                      selectedBooking.pickupDate || (selectedBooking.startDate ? new Date(selectedBooking.startDate).toLocaleDateString() : 'N/A')
                    }</p>
                    <p><strong>Return:</strong> {
                      selectedBooking.returnDate || (selectedBooking.endDate ? new Date(selectedBooking.endDate).toLocaleDateString() : 'N/A')
                    }</p>
                    <p><strong>Total:</strong> <span className="text-success fw-bold">${selectedBooking.totalPrice || selectedBooking.totalAmount || 'N/A'}</span></p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Status</h6>
                    <span className={`badge fs-6 ${statusBadgeClass(selectedBooking.status)}`}>
                      {selectedBooking.status || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="modal-footer flex-wrap gap-2">
                <button className="btn btn-secondary" onClick={() => { setShowModal(false); setSelectedBooking(null); }}>
                  Close
                </button>
                {/* Mark Pending */}
                <button
                  className="btn btn-warning"
                  disabled={actionLoading}
                  onClick={() => updateStatus(selectedBooking, 'pending')}
                >
                  <i className="fas fa-clock me-1"></i> Mark Pending
                </button>
                {/* Confirm → vehicle unavailable */}
                <button
                  className="btn btn-success"
                  disabled={actionLoading}
                  onClick={() => updateStatus(selectedBooking, 'confirmed')}
                  title="Vehicle becomes UNAVAILABLE when confirmed"
                >
                  <i className="fas fa-check me-1"></i> Confirm
                </button>
                {/* Mark Returned → vehicle available */}
                <button
                  className="btn btn-primary"
                  disabled={actionLoading}
                  onClick={() => updateStatus(selectedBooking, 'completed')}
                  title="Vehicle becomes AVAILABLE again when returned"
                >
                  <i className="fas fa-undo me-1"></i> Mark Returned
                </button>
                {/* Cancel → vehicle available */}
                <button
                  className="btn btn-danger"
                  disabled={actionLoading}
                  onClick={() => updateStatus(selectedBooking, 'cancelled')}
                >
                  <i className="fas fa-times me-1"></i> Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookings;
