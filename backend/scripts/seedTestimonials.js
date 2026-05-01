const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Testimonial = require('../models/Testimonial');

// Load environment variables
dotenv.config();

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Wedding Planner',
    email: 'sarah.chen@example.com',
    image: 'https://res.cloudinary.com/dz7pl7mlf/image/upload/v1745251929/yzpwprwge2msh67wmvzo.jpg',
    quote: 'As a car enthusiast, I was blown away by their collection. The Ferrari 488 was perfectly maintained and the team\'s knowledge about the vehicles is impressive. Will definitely rent again!',
    rating: 5,
    isApproved: true,
    isActive: true
  },
  {
    name: 'Michael Roberts',
    role: 'Car Enthusiast',
    email: 'michael.roberts@example.com',
    image: 'https://res.cloudinary.com/dz7pl7mlf/image/upload/v1745251787/rsflbsvuxsexcdiw5vss.jpg',
    quote: 'Toyota is best car according to the budget and comfort it gives nice mileage and is fully loaded with features. Looks of the car is awesome. The pickup of the car is very nice, performance of the car is great.',
    rating: 4,
    isApproved: true,
    isActive: true
  },
  {
    name: 'James Wilson',
    role: 'Business Executive',
    email: 'james.wilson@example.com',
    image: 'https://res.cloudinary.com/dz7pl7mlf/image/upload/v1745251679/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr_ejkby9.jpg',
    quote: 'Mercedes-Benz vehicles consistently receive positive reviews, particularly for their luxury interiors, stylish designs, and advanced technology features.',
    rating: 5,
    isApproved: true,
    isActive: true
  },
  {
    name: 'Emily Johnson',
    role: 'Travel Blogger',
    email: 'emily.johnson@example.com',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    quote: 'Exceptional service and premium vehicles! I rented an Audi for my road trip and it was absolutely perfect. The booking process was smooth and the staff was very professional.',
    rating: 5,
    isApproved: true,
    isActive: true
  },
  {
    name: 'David Martinez',
    role: 'Photographer',
    email: 'david.martinez@example.com',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    quote: 'Great experience renting a BMW for my client photoshoot. The car was spotless and performed beautifully. Highly recommend EnjoyDrive for professional needs.',
    rating: 4,
    isApproved: false,
    isActive: true
  },
  {
    name: 'Lisa Thompson',
    role: 'Event Coordinator',
    email: 'lisa.thompson@example.com',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    quote: 'Perfect for special events! I rented a luxury sedan for a corporate event and it made a great impression. The service was top-notch from start to finish.',
    rating: 5,
    isApproved: false,
    isActive: true
  }
];

const seedTestimonials = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle-rentals'
    );
    console.log('Connected to MongoDB');

    // Clear existing testimonials
    await Testimonial.deleteMany({});
    console.log('Cleared existing testimonials');

    // Insert new testimonials
    const createdTestimonials = await Testimonial.insertMany(testimonials);
    console.log(`Created ${createdTestimonials.length} testimonials`);

    // Display created testimonials
    createdTestimonials.forEach((testimonial, index) => {
      console.log(`${index + 1}. ${testimonial.name} - ${testimonial.role} (${testimonial.rating} stars) - ${testimonial.isApproved ? 'Approved' : 'Pending'}`);
    });

    console.log('\nTestimonials seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    process.exit(1);
  }
};

// Run the seed function
seedTestimonials();
