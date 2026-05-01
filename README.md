# Enjoy-Drive: Vehicle Rentals Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for vehicle rentals. Enjoy-Drive allows users to browse available vehicles, make bookings, and leave testimonials, while providing an administrative area to manage users, vehicles, and bookings.

## Project Structure

- `backend/` — Node.js, Express, MongoDB API
- `frontend/` — React.js client

## Features & Functionality

### Frontend
- **User Interface**: Browse vehicles, view details, make bookings, and submit testimonials.
- **Authentication**: User registration, login, and secure sessions.
- **Admin Dashboard**: Manage users, vehicles, bookings, and approve/reject testimonials.
- **Responsive Design**: Tailwind CSS styling for a mobile-friendly layout.

### Backend
- **RESTful API**: Endpoints for users, vehicles, bookings, and testimonials.
- **Database**: MongoDB integration using Mongoose for schema validation.
- **Authentication**: JWT-based secure routing (middleware in `auth.js`).
- **Data Seed Scripts**: Easily populate the database with initial vehicles, users, and admin accounts.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI (Atlas or local)

### MongoDB Setup

Create a `.env` file in the `backend/` directory and add your MongoDB connection string:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key
```

### Installation & Setup Commands

You can set up and run everything using the following commands:

**1. Install Backend Dependencies:**
```bash
cd backend
npm install
```

**2. Install Frontend Dependencies:**
```bash
cd frontend
npm install
```

**3. Run the complete application concurrently:**
From the root directory, if you have a combined script or using separate terminals:

*Terminal 1 (Backend)*
```bash
cd backend
npm run start  # or npm run dev
```

*Terminal 2 (Frontend)*
```bash
cd frontend
npm start
```

*(Note: Ensure your backend entry point is correctly set up as `server.js` or `app.js` in `package.json` depending on your setup)*
 
