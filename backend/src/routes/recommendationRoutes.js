import express from 'express';
import {
  getExerciseRecommendations,
  getDietRecommendations,
  getCompleteRecommendations,
} from '../controllers/recommendationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/recommendations/exercise - Get exercise recommendations
router.get('/exercise', getExerciseRecommendations);

// GET /api/recommendations/diet - Get diet recommendations
router.get('/diet', getDietRecommendations);

// GET /api/recommendations/complete - Get complete recommendations (exercise + diet)
router.get('/complete', getCompleteRecommendations);

export default router;