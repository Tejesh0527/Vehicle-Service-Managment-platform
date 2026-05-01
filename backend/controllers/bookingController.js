const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const { getMemoryDB } = require('../services/memoryDatabase');

// Database adapter to work with both MongoDB and memory database
const getDB = () => {
  if (process.env.USE_MEMORY_DB === 'true') {
    return getMemoryDB();
  }
  return null; // Use Mongoose models directly
};

exports.createBooking = async (req, res) => {
  try {
    const { vehicle: vehicleId, startDate, endDate } = req.body;
    const db = getDB();

    let vehicle;
    if (db) {
      // Using memory database
      vehicle = await db.getVehicleById(vehicleId);
    } else {
      // Using MongoDB
      vehicle = await Vehicle.findById(vehicleId);
    }

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check availability (different property names in memory vs MongoDB)
    // const isAvailable = db ? vehicle.status === 'available' : vehicle.availability;
    // if (!isAvailable) {
    //   return res.status(400).json({ message: 'Vehicle is not available for the selected dates' });
    // }

    // Calculate total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = days * vehicle.pricePerDay;

    let booking;
    if (db) {
      // Using memory database
      booking = await db.createBooking({
        user: req.user._id,
        vehicle: vehicleId,
        startDate,
        endDate,
        totalPrice,
        status: 'pending'
      });

      // Update vehicle status
      await db.updateVehicle(vehicleId, { status: 'rented' });
    } else {
      // Using MongoDB
      booking = new Booking({
        user: req.user._id,
        vehicle: vehicleId,
        startDate,
        endDate,
        totalPrice
      });
      await booking.save();

      // Update vehicle availability
      vehicle.availability = false;
      await vehicle.save();
    }

    res.status(201).json(booking);
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const db = getDB();
    let bookings;

    if (db) {
      // Using memory database
      const allBookings = await db.getAllBookings();
      bookings = allBookings
        .filter(booking => booking.user === req.user._id)
        .map(booking => {
          // Populate vehicle data
          const vehicle = db.vehicles.find(v => v._id === booking.vehicle);
          return {
            ...booking,
            vehicle: vehicle || null
          };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // Using MongoDB
      bookings = await Booking.find({ user: req.user._id })
        .populate('vehicle')
        .sort({ createdAt: -1 });
    }

    res.json(bookings);
  } catch (err) {
    console.error('Get user bookings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const db = getDB();
    let bookings;

    if (db) {
      // Using memory database
      const allBookings = await db.getAllBookings();
      bookings = allBookings.map(booking => {
        // Populate user and vehicle data
        const user = db.users.find(u => u._id === booking.user);
        const vehicle = db.vehicles.find(v => v._id === booking.vehicle);
        return {
          ...booking,
          user: user ? { _id: user._id, name: user.name, email: user.email } : null,
          vehicle: vehicle || null
        };
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // Using MongoDB
      bookings = await Booking.find()
        .populate('user', 'name email')
        .populate('vehicle')
        .sort({ createdAt: -1 });
    }

    res.json(bookings);
  } catch (err) {
    console.error('Get all bookings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status } = req.body;
    const db = getDB();
    let booking;

    if (db) {
      // Using memory database
      const bookingIndex = db.bookings.findIndex(b => b._id === req.params.id);
      if (bookingIndex === -1) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Update booking status
      db.bookings[bookingIndex].status = status;
      booking = db.bookings[bookingIndex];

      // If booking is completed or cancelled, make vehicle available again
      if (status === 'completed' || status === 'cancelled') {
        await db.updateVehicle(booking.vehicle, { status: 'available' });
      }
    } else {
      // Using MongoDB
      booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // If booking is completed or cancelled, make vehicle available again
      if (status === 'completed' || status === 'cancelled') {
        await Vehicle.findByIdAndUpdate(booking.vehicle, { availability: true });
      }
    }

    res.json(booking);
  } catch (err) {
    console.error('Update booking status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};