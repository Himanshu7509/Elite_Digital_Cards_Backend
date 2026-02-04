import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './src/routes/auth.route.js';
import profileRoutes from './src/routes/profile.route.js';
import studentProfileRoutes from './src/routes/studentProfile.route.js';
import serviceRoutes from './src/routes/service.route.js';
import galleryRoutes from './src/routes/gallery.route.js';
import productRoutes from './src/routes/product.route.js';
import testimonialRoutes from './src/routes/testimonial.route.js';
import appointmentRoutes from './src/routes/appointment.route.js';
import passwordRoutes from './src/routes/password.route.js';
import mailRoutes from './src/routes/mail.route.js';
import inquiryRoutes from './src/routes/inquiry.route.js';
// Import new student routes
import studentSkillRoutes from './src/routes/studentSkill.route.js';
import studentEducationRoutes from './src/routes/studentEducation.route.js';
import studentExperienceRoutes from './src/routes/studentExperience.route.js';
import studentProjectRoutes from './src/routes/studentProject.route.js';
import studentAchievementRoutes from './src/routes/studentAchievement.route.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

import dbConnect from './src/config/mongodb.js';
dbConnect();
app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'https://www.elitedigitalcards.com',
  'https://elitedigitalcards.com',
  'https://www.elitedigitalcards.in',
  'https://elitedigitalcards.in',
  'https://elite-cards-admin-panel.vercel.app'
];
// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Routes
app.use('/api/auth', authRoutes);
console.log('Auth routes registered');
app.use('/api/profile', profileRoutes);
console.log('Profile routes registered');
app.use('/api/student-profile', studentProfileRoutes);
console.log('Student Profile routes registered');
app.use('/api/student-skills', studentSkillRoutes);
console.log('Student Skills routes registered');
app.use('/api/student-educations', studentEducationRoutes);
console.log('Student Educations routes registered');
app.use('/api/student-experiences', studentExperienceRoutes);
console.log('Student Experiences routes registered');
app.use('/api/student-projects', studentProjectRoutes);
console.log('Student Projects routes registered');
app.use('/api/student-achievements', studentAchievementRoutes);
console.log('Student Achievements routes registered');
app.use('/api/services', serviceRoutes);
console.log('Services routes registered');
app.use('/api/gallery', galleryRoutes);
console.log('Gallery routes registered');
app.use('/api/products', productRoutes);
console.log('Products routes registered');
app.use('/api/testimonials', testimonialRoutes);
console.log('Testimonials routes registered');
app.use('/api/appointments', appointmentRoutes);
console.log('Appointments routes registered');
app.use('/api/password', passwordRoutes);
console.log('Password routes registered');
app.use('/api/mail', mailRoutes);
console.log('Mail routes registered');
app.use('/api/inquiries', inquiryRoutes);
console.log('Inquiry routes registered');

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Elite Digital Cards Backend API is running!',
    timestamp: new Date().toISOString()
  });
});

// Debug route to check if routes are registered
app.get('/api/debug/routes', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Routes are registered',
    routes: [
      '/api/auth',
      '/api/profile',
      '/api/student-profile',
      '/api/student-skills',
      '/api/student-educations',
      '/api/student-experiences',
      '/api/student-projects',
      '/api/student-achievements',
      '/api/services',
      '/api/gallery',
      '/api/products',
      '/api/testimonials',
      '/api/appointments',
      '/api/password',
      '/api/mail',
      '/api/inquiries'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message || {}
  });
});

// 404 handler - This should be the last middleware
app.use((req, res) => {
  console.log('Route not found:', req.method, req.url);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  
  // Log all registered routes for debugging
  console.log('Registered routes:');
  app._router.stack.forEach((middleware, i) => {
    if (middleware.route) {
      console.log(`  ${middleware.route.stack[0].method.toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      console.log(`  Router middleware at path: ${middleware.regexp}`);
    }
  });
  
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});