import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import VehicleList from './components/VehicleList';
import Features from './components/Features';
import WhyChooseUs from './components/WhyChooseUs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AllBookings from './pages/AllBookings';
import ManageVehicles from './pages/ManageVehicles';
import ManageTestimonials from './pages/ManageTestimonials';
import ManageUsers from './pages/ManageUsers';
import VehicleDetail from './pages/VehicleDetail';
import Book from './pages/Book';
import Profile from './pages/Profile';
import UserBookings from './pages/UserBookings';
import NotFound from './pages/NotFound';

// Import layout components
import AdminRoute from './components/layout/AdminRoute';

import './styles/main.css';

function App() {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Navbar />
            <HeroBanner />
            <VehicleList />
            <WhyChooseUs />
            <Features />
            <Testimonials />
            <Contact />
            <Footer />
          </>
        } />

        <Route path="/login" element={
          <>
            <Navbar />
            <Login />
            <Footer />
          </>
        } />

        <Route path="/register" element={
          <>
            <Navbar />
            <Register />
            <Footer />
          </>
        } />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/vehicles/:id" element={
          <>
            <Navbar />
            <VehicleDetail />
            <Footer />
          </>
        } />

        <Route path="/book/:id" element={
          <>
            <Navbar />
            <Book />
            <Footer />
          </>
        } />

        <Route path="/profile" element={
          <>
            <Navbar />
            <Profile />
            <Footer />
          </>
        } />

        <Route path="/bookings" element={
          <>
            <Navbar />
            <UserBookings />
            <Footer />
          </>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

        <Route path="/admin/bookings" element={
          <AdminRoute>
            <AllBookings />
          </AdminRoute>
        } />

        <Route path="/admin/cars" element={
          <AdminRoute>
            <ManageVehicles />
          </AdminRoute>
        } />

        <Route path="/admin/testimonials" element={
          <AdminRoute>
            <ManageTestimonials />
          </AdminRoute>
        } />

        <Route path="/admin/users" element={
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={
          <>
            <Navbar />
            <NotFound />
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;