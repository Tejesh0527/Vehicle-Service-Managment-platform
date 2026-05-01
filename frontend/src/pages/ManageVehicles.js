import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle, getCategoryFeatures } from '../services/vehicleService';

const ManageVehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowModal(true);
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        setError(null);
        await deleteVehicle(vehicleId);
        console.log('Vehicle deleted successfully');
        // Refresh the vehicles list
        const updatedVehicles = await getVehicles();
        setVehicles(updatedVehicles);
        // Show success message
        setError({ type: 'success', message: 'Vehicle deleted successfully!' });
        setTimeout(() => setError(null), 3000);
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete vehicle. Please try again.';
        setError({ type: 'danger', message: errorMessage });
      }
    }
  };

  const handleSave = async (vehicleData) => {
    try {
      setError(null);
      if (editingVehicle) {
        // Update existing vehicle
        const updatedVehicle = await updateVehicle(editingVehicle._id || editingVehicle.id, vehicleData);
        console.log('Vehicle updated successfully:', updatedVehicle);
        setError({ type: 'success', message: 'Vehicle updated successfully!' });
      } else {
        // Add new vehicle
        const newVehicle = await createVehicle(vehicleData);
        console.log('Vehicle created successfully:', newVehicle);
        setError({ type: 'success', message: 'Vehicle created successfully!' });
      }

      // Refresh the vehicles list to get the latest data
      const updatedVehicles = await getVehicles();
      setVehicles(updatedVehicles);

      setShowModal(false);
      setEditingVehicle(null);

      // Clear success message after 3 seconds
      setTimeout(() => setError(null), 3000);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save vehicle. Please try again.';
      setError({ type: 'danger', message: errorMessage });
    }
  };

  useEffect(() => {
    // Fetch vehicles from backend API
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);
        const vehiclesData = await getVehicles();
        console.log('Fetched vehicles for admin:', vehiclesData);
        setVehicles(vehiclesData);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        const errorMessage = error.response?.data?.message || 'Failed to load vehicles. Please try again.';
        setError({ type: 'danger', message: errorMessage });
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="d-flex" style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside style={{ width: 200, background: '#2c3e50', color: '#fff', minHeight: '100vh' }} className="p-3">
          <h4 className="text-white mb-4">Admin Panel</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <button className="btn btn-link text-white text-start w-100 p-2" onClick={() => navigate('/admin')}>
                <i className="fas fa-tachometer-alt me-2"></i> Dashboard
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className="btn btn-link text-white text-start w-100 p-2 active" onClick={() => navigate('/admin/cars')}>
                <i className="fas fa-motorcycle me-2"></i> Vehicles
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className="btn btn-link text-white text-start w-100 p-2" onClick={() => navigate('/admin/users')}>
                <i className="fas fa-users me-2"></i> Users
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className="btn btn-link text-white text-start w-100 p-2" onClick={() => navigate('/admin/bookings')}>
                <i className="fas fa-calendar-alt me-2"></i> Bookings
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-grow-1" style={{ background: '#ecf0f1' }}>
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading vehicles...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: 200, background: '#2c3e50', color: '#fff', minHeight: '100vh' }} className="p-3">
        <h4 className="text-white mb-4">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <button className="btn btn-link text-white text-start w-100 p-2" onClick={() => navigate('/admin')}>
              <i className="fas fa-tachometer-alt me-2"></i> Dashboard
            </button>
          </li>
          <li className="nav-item mb-2">
            <button className="btn btn-link text-white text-start w-100 p-2 active" onClick={() => navigate('/admin/cars')}>
              <i className="fas fa-motorcycle me-2"></i> Vehicles
            </button>
          </li>
          <li className="nav-item mb-2">
            <button className="btn btn-link text-white text-start w-100 p-2" onClick={() => navigate('/admin/users')}>
              <i className="fas fa-users me-2"></i> Users
            </button>
          </li>
          <li className="nav-item mb-2">
            <button className="btn btn-link text-white text-start w-100 p-2" onClick={() => navigate('/admin/bookings')}>
              <i className="fas fa-calendar-alt me-2"></i> Bookings
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1" style={{ background: '#ecf0f1' }}>
        <div className="d-flex justify-content-between align-items-center p-4 bg-white border-bottom">
          <h2 className="mb-0">Manage Vehicles</h2>
          <div>
            <button 
              className="btn btn-success btn-sm me-2" 
              onClick={() => {
                setEditingVehicle(null);
                setShowModal(true);
              }}
            >
              <i className="fas fa-plus me-1"></i> Add Vehicle
            </button>
            <button className="btn btn-outline-danger btn-sm" onClick={() => { localStorage.removeItem('token'); navigate('/admin/login'); }}>
              <i className="fas fa-sign-out-alt me-1"></i> Logout
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Error/Success Messages */}
          {error && (
            <div className={`alert alert-${error.type} alert-dismissible fade show mb-4`} role="alert">
              <i className={`fas ${error.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
              {error.message}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError(null)}
                aria-label="Close"
              ></button>
            </div>
          )}

          <div className="bg-white rounded shadow-sm">
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead style={{ background: '#f8f9fa' }}>
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Price/Day</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">Fuel</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle._id || vehicle.id}>
                      <td className="px-4 py-3">{vehicle._id || vehicle.id}</td>
                      <td className="px-4 py-3">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </td>
                      <td className="px-4 py-3">{vehicle.name}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${vehicle.type === 'Bike' ? 'bg-info' : 'bg-primary'}`}>
                          {vehicle.type || vehicle.category || 'Car'}
                        </span>
                      </td>
                      <td className="px-4 py-3">${vehicle.pricePerDay || vehicle.price}</td>
                      <td className="px-4 py-3">{vehicle.year}</td>
                      <td className="px-4 py-3">{vehicle.specifications?.fuelType || vehicle.fuel || 'Gasoline'}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${vehicle.status === 'available' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => handleEdit(vehicle)}
                        >
                          <i className="fas fa-edit me-1"></i> Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(vehicle._id || vehicle.id)}
                        >
                          <i className="fas fa-trash me-1"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Vehicle Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingVehicle(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <VehicleForm
                  vehicle={editingVehicle}
                  onSave={handleSave}
                  onCancel={() => {
                    setShowModal(false);
                    setEditingVehicle(null);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Vehicle Form Component
const VehicleForm = ({ vehicle, onSave, onCancel }) => {
  const initCategory = (vehicle?.category || 'luxury').toLowerCase();
  const [formData, setFormData] = useState({
    name: vehicle?.name || '',
    type: vehicle?.type || 'Car',
    category: initCategory,
    pricePerDay: vehicle?.pricePerDay || vehicle?.price || '',
    year: vehicle?.year || new Date().getFullYear(),
    fuelType: vehicle?.specifications?.fuelType || vehicle?.fuel || 'Gasoline',
    status: vehicle?.status || 'available',
    available: vehicle?.available !== undefined ? vehicle.available : true,
    image: vehicle?.image || '',
    description: vehicle?.description || '',
    features: vehicle?.features || getCategoryFeatures(initCategory)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const catLower = formData.category.toLowerCase();
    // Structure data to match backend + localStorage expectations
    const finalData = {
      name: formData.name,
      type: formData.type,
      category: catLower,                        // always lowercase
      pricePerDay: parseInt(formData.pricePerDay),
      year: parseInt(formData.year),
      status: formData.status,
      available: formData.status === 'available', // derive from status
      image: formData.image,
      description: formData.description,
      features: getCategoryFeatures(catLower),    // auto from category
      specifications: {
        fuelType: formData.fuelType,
        transmission: 'Automatic',
        seats: formData.type === 'Bike' ? 2 : 5
      }
    };
    onSave(finalData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    // Auto-update features when category changes
    if (name === 'category') {
      updated.features = getCategoryFeatures(value.toLowerCase());
    }
    setFormData(updated);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Vehicle Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="luxury">Luxury</option>
              <option value="sports">Sports</option>
              <option value="suv">SUV</option>
              <option value="bike">Bike</option>
            </select>
            {/* Live features preview */}
            <div className="mt-2 d-flex flex-wrap gap-1">
              {formData.features.map((f, i) => (
                <span key={i} className="badge bg-light text-dark border" style={{ fontSize: '0.75rem' }}>
                  {f}
                </span>
              ))}
            </div>
            <small className="text-muted">Features auto-set by category</small>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Price per Day ($)</label>
            <input
              type="number"
              className="form-control"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>


      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Year</label>
            <input
              type="number"
              className="form-control"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="2000"
              max={new Date().getFullYear() + 1}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Fuel Type</label>
            <select
              className="form-select"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              required
            >
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              className="form-control"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="Enter vehicle description..."
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
};

export default ManageVehicles;
