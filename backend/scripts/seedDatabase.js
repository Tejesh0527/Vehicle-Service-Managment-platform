const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

const connectDB = require('../config/db');

const sampleVehicles = [
  {
    name: 'Mercedes-Benz S-Class',
    type: 'Car',
    category: 'luxury',
    description: 'Experience ultimate luxury with our premium Mercedes-Benz S-Class. Perfect for business trips and special occasions.',
    pricePerDay: 299,
    year: 2023,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: ['Leather Seats', 'GPS Navigation', 'Bluetooth', 'Premium Sound System'],
    specifications: {
      engine: '3.0L V6 Turbo',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      seats: 5
    }
  },
  {
    name: 'BMW M4 Coupe',
    type: 'Car',
    category: 'sports',
    description: 'Feel the thrill of driving with our high-performance BMW M4 Coupe. Built for speed and precision.',
    pricePerDay: 399,
    year: 2023,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: ['Sport Mode', 'Carbon Fiber Interior', 'Performance Brakes', 'Track Package'],
    specifications: {
      engine: '3.0L Twin-Turbo I6',
      transmission: 'Manual/Automatic',
      fuelType: 'Gasoline',
      seats: 4
    }
  },
  {
    name: 'Range Rover Evoque',
    type: 'Car',
    category: 'suv',
    description: 'Conquer any terrain with style in our luxurious Range Rover Evoque. Perfect for adventures and city driving.',
    pricePerDay: 249,
    year: 2023,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: ['All-Wheel Drive', 'Terrain Response', 'Panoramic Roof', 'Premium Interior'],
    specifications: {
      engine: '2.0L Turbo I4',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      seats: 5
    }
  },
  {
    name: 'Tesla Model S',
    type: 'Car',
    category: 'luxury',
    description: 'Experience the future of driving with our Tesla Model S. Zero emissions, maximum performance.',
    pricePerDay: 349,
    year: 2023,
    status: 'rented',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: ['Autopilot', 'Supercharging', 'Premium Interior', 'Over-the-Air Updates'],
    specifications: {
      engine: 'Dual Motor Electric',
      transmission: 'Single Speed',
      fuelType: 'Electric',
      seats: 5
    }
  },
  {
    name: 'Audi A4 Sedan',
    type: 'Car',
    category: 'sedan',
    description: 'Elegant and efficient, our Audi A4 offers the perfect balance of luxury and practicality.',
    pricePerDay: 179,
    year: 2023,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: ['Quattro AWD', 'Virtual Cockpit', 'Premium Sound', 'Heated Seats'],
    specifications: {
      engine: '2.0L Turbo I4',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      seats: 5
    }
  },
  {
    name: 'Porsche 911 Carrera',
    type: 'Car',
    category: 'sports',
    description: 'The iconic sports car that defines performance. Experience pure driving pleasure with our Porsche 911.',
    pricePerDay: 499,
    year: 2023,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: ['Sport Chrono Package', 'PASM', 'Sport Exhaust', 'Racing Seats'],
    specifications: {
      engine: '3.0L Twin-Turbo Flat-6',
      transmission: 'PDK Automatic',
      fuelType: 'Gasoline',
      seats: 2
    }
  }
];

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@enjoydrive.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'customer'
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Vehicle.deleteMany({});
    await User.deleteMany({});
    
    // Seed vehicles
    console.log('🚗 Seeding vehicles...');
    await Vehicle.insertMany(sampleVehicles);
    console.log(`✅ ${sampleVehicles.length} vehicles added`);
    
    // Seed users with hashed passwords
    console.log('👥 Seeding users...');
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
    }
    console.log(`✅ ${sampleUsers.length} users added`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Test credentials:');
    console.log('Admin: admin@enjoydrive.com / admin123');
    console.log('User: john@example.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
