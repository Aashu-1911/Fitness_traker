import express from 'express';
import { addWater, addCalories, addWorkout, addWeight, getTodayLogs, getLogsByDateRange } from '../controllers/logController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/logs/water - Add water intake
router.post('/water', addWater);

// POST /api/logs/calories - Add calories
router.post('/calories', addCalories);

// POST /api/logs/workout - Add workout
router.post('/workout', addWorkout);

// POST /api/logs/weight - Log weight
router.post('/weight', addWeight);

// GET /api/logs/today - Get today's log
router.get('/today', getTodayLogs);

// GET /api/logs/range - Get logs by date range
router.get('/range', getLogsByDateRange);

export default router;