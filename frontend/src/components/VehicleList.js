import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVehicles } from '../services/vehicleService';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  // ── Normalize category to lowercase to prevent "SUV" vs "suv" mismatches ──
  const normalizeVehicle = (v) => ({
    ...v,
    category: (v.category || v.type || '').toLowerCase(),
  });

  // ── Filter logic (plain function, no stale closure) ────────────────────────
  const applyFilter = (list, filter) => {
    if (filter === 'all') return list;
    return list.filter(v => {
      const cat = (v.category || '').toLowerCase();
      const typ = (v.type || '').toLowerCase();
      return cat === filter || typ === filter;
    });
  };

  // ── renderVehicles equivalent: load list into state and re-filter ──────────
  const renderVehicles = (rawList) => {
    const normalized = rawList.map(normalizeVehicle);
    setVehicles(normalized);
    setActiveFilter(prev => {
      setFilteredVehicles(applyFilter(normalized, prev));
      return prev;
    });
  };

  // ── Filter button click ────────────────────────────────────────────────────
  const handleFilter = (filterValue) => {
    const f = filterValue.toLowerCase();
    setActiveFilter(f);
    setFilteredVehicles(applyFilter(vehicles, f));
  };

  // ── Book / Details ─────────────────────────────────────────────────────────
  const handleBookNow = (vehicleId) => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    navigate(`/book/${vehicleId}`);
  };

  const handleViewDetails = (vehicleId) => navigate(`/vehicles/${vehicleId}`);

  // ── On mount: load from API (writes localStorage) then listen for updates ──
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getVehicles(); // also syncs to localStorage["vehicles"]
        renderVehicles(data);
      } catch (err) {
        console.error('API fetch failed, trying localStorage cache:', err);
        try {
          const raw = localStorage.getItem('vehicles');
          if (raw) {
            renderVehicles(JSON.parse(raw));
          } else {
            setError('Failed to load vehicles. Please refresh the page.');
            setVehicles([]);
            setFilteredVehicles([]);
          }
        } catch {
          setError('Failed to load vehicles. Please refresh the page.');
          setVehicles([]);
          setFilteredVehicles([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();

    // Real-time updates from admin panel (dispatched by vehicleService)
    const onVehiclesUpdated = () => {
      try {
        const raw = localStorage.getItem('vehicles');
        if (raw) renderVehicles(JSON.parse(raw));
      } catch (e) {
        console.error('vehiclesUpdated sync error:', e);
      }
    };

    window.addEventListener('vehiclesUpdated', onVehiclesUpdated);
    return () => window.removeEventListener('vehiclesUpdated', onVehiclesUpdated);
  }, []); // eslint-disable-line


  // ── Filter buttons definition ──────────────────────────────────────────────
  const FILTERS = [
    { label: 'All',    value: 'all'    },
    { label: 'Luxury', value: 'luxury' },
    { label: 'Sports', value: 'sports' },
    { label: 'SUV',    value: 'suv'    },
    { label: 'Bike',   value: 'bike'   },
  ];

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>{error}
          </div>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            <i className="fas fa-sync me-2"></i>Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <section id="collection" className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <h2 className="section-title">Our Collection</h2>
        <p className="section-subtitle">Explore our collection of premium vehicles and bikes</p>

        {/* ── Filter Buttons — each has data-filter for consistency ── */}
        <div className="filter-buttons">
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              data-filter={value}
              className={`filter-btn ${activeFilter === value ? 'active' : ''}`}
              onClick={() => handleFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Vehicle Grid — each card has data-category (lowercase) ── */}
        <div className="row g-4">
          {filteredVehicles.map((vehicle) => {
            const catLower = (vehicle.category || vehicle.type || '').toLowerCase();
            const vehicleId = vehicle._id || vehicle.id;
            return (
              <div
                key={vehicleId}
                className="col-lg-4 col-md-6"
                data-category={catLower}
              >
                <div className="vehicle-card">
                  <div className="vehicle-image-container">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="vehicle-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x220/e9ecef/495057?text=' + encodeURIComponent(vehicle.name || 'Vehicle');
                      }}
                    />
                    <div className="price-tag">
                      ${vehicle.pricePerDay || vehicle.price}/day
                    </div>
                    <div className="category-badge">{catLower.toUpperCase()}</div>
                  </div>
                  <div className="vehicle-info">
                    <h3 className="vehicle-name">{vehicle.name}</h3>
                    <p className="vehicle-description" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {vehicle.description}
                    </p>
                    
                    {/* Features List */}
                    {(vehicle.features && vehicle.features.length > 0) && (
                      <div className="mb-3 d-flex flex-wrap gap-1">
                        {vehicle.features.slice(0, 3).map((f, i) => (
                          <span key={i} className="badge bg-light text-dark border" style={{ fontSize: '0.75rem' }}>
                            {f}
                          </span>
                        ))}
                        {vehicle.features.length > 3 && (
                          <span className="badge bg-light text-muted border" style={{ fontSize: '0.75rem' }}>
                            +{vehicle.features.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                      <span className={vehicle.available !== false ? 'status-available' : 'status-rented'}>
                        {vehicle.available !== false ? '✔ Available' : '✖ Not Available'}
                      </span>
                    </div>
                    <div className="vehicle-actions">
                      <button
                        className="btn btn-primary"
                        disabled={vehicle.available === false}
                        onClick={() => handleBookNow(vehicleId)}
                      >
                        {vehicle.available !== false ? 'Book Now' : 'Not Available'}
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleViewDetails(vehicleId)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Empty state ── */}
        {filteredVehicles.length === 0 && !loading && (
          <div className="text-center py-5">
            <i className="fas fa-car fa-3x text-muted mb-3 d-block"></i>
            <h4>No vehicles found</h4>
            <p className="text-muted">Try selecting a different category or check back later.</p>
            <button className="btn btn-outline-primary mt-2" onClick={() => handleFilter('all')}>
              Show All Vehicles
            </button>
          </div>
        )}
      </div>

      <style>{`
        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #333;
        }
        .section-subtitle {
          text-align: center;
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 3rem;
        }
        .filter-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }
        .filter-btn {
          padding: 0.7rem 1.5rem;
          border: 2px solid #007bff;
          background: white;
          color: #007bff;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.9rem;
        }
        .filter-btn:hover, .filter-btn.active {
          background: #007bff;
          color: white;
          box-shadow: 0 4px 12px rgba(0,123,255,0.3);
          transform: translateY(-2px);
        }
        .vehicle-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
        }
        .vehicle-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        .vehicle-image-container {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        .vehicle-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .vehicle-card:hover .vehicle-image {
          transform: scale(1.05);
        }
        .price-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #007bff;
          color: white;
          padding: 0.35rem 0.85rem;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.85rem;
        }
        .category-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(0,0,0,0.6);
          color: #fff;
          padding: 0.2rem 0.7rem;
          border-radius: 10px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 1.2px;
        }
        .vehicle-info { padding: 1.4rem; }
        .vehicle-name {
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 0.4rem;
          color: #333;
        }
        .vehicle-description {
          color: #666;
          margin-bottom: 0.9rem;
          line-height: 1.5;
          font-size: 0.9rem;
        }
        .status-available { color: #28a745; font-weight: 600; font-size: 0.85rem; }
        .status-rented, .status-maintenance { color: #dc3545; font-weight: 600; font-size: 0.85rem; }
        .vehicle-actions { display: flex; gap: 0.5rem; }
        .vehicle-actions .btn {
          flex: 1;
          padding: 0.65rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        .btn-primary { background: #007bff; border: none; color: white; }
        .btn-primary:hover:not(:disabled) { background: #0056b3; transform: translateY(-1px); }
        .btn-primary:disabled { background: #6c757d; cursor: not-allowed; }
        .btn-secondary { background: transparent; border: 2px solid #6c757d; color: #6c757d; }
        .btn-secondary:hover { background: #6c757d; color: white; transform: translateY(-1px); }
        @media (max-width: 768px) {
          .section-title { font-size: 2rem; }
          .filter-buttons { gap: 0.5rem; }
          .filter-btn { padding: 0.5rem 1rem; font-size: 0.82rem; }
        }
      `}</style>
    </section>
  );
};

export default VehicleList;
