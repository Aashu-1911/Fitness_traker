import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import logRoutes from './routes/logRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/challenges', challengeRoutes);

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'FitLife API',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to FitLife API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      profile: '/api/health/profile',
      logs: '/api/logs',
      recommendations: '/api/recommendations',
      analytics: '/api/analytics',
      challenges: '/api/challenges'
    }
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server and connect to database
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();