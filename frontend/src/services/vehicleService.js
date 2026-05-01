import axios from 'axios';

// Create axios instance with base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ─── localStorage helpers ───────────────────────────────────────────────────
const LS_KEY = 'vehicles';

const syncToStorage = (vehicles) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(vehicles));
    // Dispatch a storage event so other tabs / components can react
    window.dispatchEvent(new Event('vehiclesUpdated'));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
};

const readFromStorage = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
// ────────────────────────────────────────────────────────────────────────────

export const getVehicles = async () => {
  try {
    const res = await api.get('/vehicles');
    const data = res.data;
    // Write-through cache — keeps localStorage in sync after every fetch
    syncToStorage(data);
    return data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    // Fallback to localStorage cache when API is unavailable
    const cached = readFromStorage();
    if (cached) {
      console.warn('Using cached vehicles from localStorage');
      return cached;
    }
    throw error;
  }
};

export const getVehicleById = async (id) => {
  try {
    const res = await api.get(`/vehicles/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    // Try localStorage fallback
    const cached = readFromStorage();
    if (cached) {
      const v = cached.find(v => (v._id || v.id) === id);
      if (v) return v;
    }
    throw error;
  }
};

export const createVehicle = async (data) => {
  try {
    const res = await api.post('/vehicles', data);
    const newVehicle = res.data;
    // Append to localStorage cache
    const vehicles = readFromStorage() || [];
    vehicles.push(newVehicle);
    syncToStorage(vehicles);
    return newVehicle;
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
};

export const updateVehicle = async (id, data) => {
  try {
    const res = await api.put(`/vehicles/${id}`, data);
    const updatedVehicle = res.data;
    // Patch localStorage cache
    const vehicles = readFromStorage() || [];
    const idx = vehicles.findIndex(v => (v._id || v.id) === id);
    if (idx !== -1) {
      vehicles[idx] = updatedVehicle;
    }
    syncToStorage(vehicles);
    return updatedVehicle;
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
};

export const deleteVehicle = async (id) => {
  try {
    const res = await api.delete(`/vehicles/${id}`);
    // Remove from localStorage cache
    const vehicles = readFromStorage() || [];
    syncToStorage(vehicles.filter(v => (v._id || v.id) !== id));
    return res.data;
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    throw error;
  }
};

// ─── Availability patch (localStorage-only, instant) ────────────────────────
// Used by admin booking confirm/return to make vehicles available/unavailable
// without a full API round-trip for the available flag.
export const setVehicleAvailability = (vehicleId, available) => {
  try {
    const vehicles = readFromStorage() || [];
    const idx = vehicles.findIndex(v => (v._id || v.id) === vehicleId);
    if (idx !== -1) {
      vehicles[idx] = { ...vehicles[idx], available };
      syncToStorage(vehicles); // saves + dispatches vehiclesUpdated
    }
  } catch (e) {
    console.error('setVehicleAvailability error:', e);
  }
};

// ─── Category → Features mapping ────────────────────────────────────────────
export const getCategoryFeatures = (category) => {
  const map = {
    suv:    ['Spacious', 'Off-road', 'Family', '7 Seats', 'High Ground Clearance'],
    luxury: ['Premium', 'Comfort', 'High-end', 'Leather Interior', 'Advanced Tech'],
    sports: ['Fast', 'Performance', '2-Seater', 'Sport Exhaust', 'Low Profile'],
    bike:   ['Lightweight', 'Fuel Efficient', 'City Ride', 'Easy Parking', 'Agile'],
  };
  return map[(category || '').toLowerCase()] || ['Reliable', 'Comfortable', 'Stylish'];
};