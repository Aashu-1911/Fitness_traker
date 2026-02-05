import express from 'express';
import { getHealthProfile, createHealthProfile, updateHealthProfile } from '../controllers/healthController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/health/profile - Get user's health profile
router.get('/profile', getHealthProfile);

// POST /api/health/profile - Create user's health profile  
router.post('/profile', createHealthProfile);

// PUT /api/health/profile - Update user's health profile
router.put('/profile', updateHealthProfile);

export default router;