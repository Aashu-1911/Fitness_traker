import express from 'express';
import {
  getWeightTrend,
  getWaterTrend,
  getCalorieTrend,
  getWorkoutSummary,
  getDashboardAnalytics,
} from '../controllers/analyticsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/analytics/weight-trend - Get weight trend data
router.get('/weight-trend', getWeightTrend);

// GET /api/analytics/water-trend - Get water intake trend
router.get('/water-trend', getWaterTrend);

// GET /api/analytics/calorie-trend - Get calorie intake trend
router.get('/calorie-trend', getCalorieTrend);

// GET /api/analytics/workout-summary - Get workout summary
router.get('/workout-summary', getWorkoutSummary);

// GET /api/analytics/dashboard - Get complete dashboard analytics
router.get('/dashboard', getDashboardAnalytics);

export default router;