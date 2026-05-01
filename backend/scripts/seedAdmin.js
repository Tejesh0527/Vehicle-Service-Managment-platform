const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle-rentals'
    );
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@enjoydrive.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@enjoydrive.com');
      console.log('Password: admin123');
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@enjoydrive.com',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📧 Email: admin@enjoydrive.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('');
    console.log('🚀 You can now access the admin dashboard at: /admin');

    // Also create a demo regular user if it doesn't exist
    const existingUser = await User.findOne({ email: 'john@example.com' });
    
    if (!existingUser) {
      const userPassword = await bcrypt.hash('user123', salt);
      const demoUser = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: userPassword,
        role: 'customer'
      });

      await demoUser.save();
      console.log('✅ Demo user created successfully!');
      console.log('📧 Email: john@example.com');
      console.log('🔑 Password: user123');
      console.log('👤 Role: customer');
    } else {
      console.log('Demo user already exists!');
      console.log('📧 Email: john@example.com');
      console.log('🔑 Password: user123');
    }

    console.log('');
    console.log('🎉 Setup complete! You can now login with either account.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
};

// Run the seed function
seedAdmin();
