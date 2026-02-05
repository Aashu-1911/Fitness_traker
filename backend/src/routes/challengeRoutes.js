import express from 'express';
import {
  getDailyChallenge,
  getWeeklyChallenge,
  completeChallenge,
  getChallengeHistory,
} from '../controllers/challengeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/challenges/daily - Get or create daily challenge
router.get('/daily', getDailyChallenge);

// GET /api/challenges/weekly - Get or create weekly challenge
router.get('/weekly', getWeeklyChallenge);

// PUT /api/challenges/complete/:id - Mark challenge as completed
router.put('/complete/:id', completeChallenge);

// GET /api/challenges/history - Get challenge history
router.get('/history', getChallengeHistory);

export default router;