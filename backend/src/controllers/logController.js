import DailyLog from '../models/DailyLog.js';
import HealthProfile from '../models/HealthProfile.js';
import { calcBMI, getBMICategory, calcRecommendedCalories } from '../utils/healthUtils.js';

/**
 * Get or create today's log for a user
 */
const getTodayLog = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let log = await DailyLog.findOne({
    user: userId,
    date: today,
  });

  if (!log) {
    log = await DailyLog.create({
      user: userId,
      date: today,
    });
  }

  return log;
};

// @desc    Add water intake to today's log
// @route   POST /api/logs/water
// @access  Private
export const addWater = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { amount } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ message: 'Please provide a valid water amount (in ml)' });
      return;
    }

    const log = await getTodayLog(userId);
    log.waterIntake += amount;
    await log.save();

    res.status(200).json({
      success: true,
      message: 'Water intake logged successfully',
      log: {
        date: log.date,
        waterIntake: log.waterIntake,
        calories: log.calories,
        workouts: log.workouts,
      },
    });
  } catch (error) {
    console.error('Add water error:', error);
    res.status(500).json({ message: 'Server error while logging water intake' });
  }
};

// @desc    Add calories to today's log
// @route   POST /api/logs/calories
// @access  Private
export const addCalories = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { amount } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ message: 'Please provide a valid calorie amount' });
      return;
    }

    const log = await getTodayLog(userId);
    log.calories += amount;
    await log.save();

    res.status(200).json({
      success: true,
      message: 'Calories logged successfully',
      log: {
        date: log.date,
        waterIntake: log.waterIntake,
        calories: log.calories,
        workouts: log.workouts,
      },
    });
  } catch (error) {
    console.error('Add calories error:', error);
    res.status(500).json({ message: 'Server error while logging calories' });
  }
};

// @desc    Add workout to today's log
// @route   POST /api/logs/workout
// @access  Private
export const addWorkout = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { name, duration, type } = req.body;

    if (!name || !duration || !type) {
      res.status(400).json({ message: 'Please provide workout name, duration, and type' });
      return;
    }

    const validTypes = ['Cardio', 'Strength', 'HIIT', 'Yoga', 'Flexibility'];
    if (!validTypes.includes(type)) {
      res.status(400).json({ 
        message: `Invalid workout type. Must be one of: ${validTypes.join(', ')}` 
      });
      return;
    }

    if (typeof duration !== 'number' || duration <= 0) {
      res.status(400).json({ message: 'Duration must be a positive number (in minutes)' });
      return;
    }

    const log = await getTodayLog(userId);
    log.workouts.push({ name, duration, type });
    await log.save();

    res.status(200).json({
      success: true,
      message: 'Workout logged successfully',
      log: {
        date: log.date,
        waterIntake: log.waterIntake,
        calories: log.calories,
        workouts: log.workouts,
      },
    });
  } catch (error) {
    console.error('Add workout error:', error);
    res.status(500).json({ message: 'Server error while logging workout' });
  }
};

// @desc    Get today's log
// @route   GET /api/logs/today
// @access  Private
export const getTodayLogs = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const log = await getTodayLog(userId);

    res.status(200).json({
      success: true,
      log: {
        date: log.date,
        waterIntake: log.waterIntake,
        calories: log.calories,
        workouts: log.workouts,
      },
    });
  } catch (error) {
    console.error('Get today logs error:', error);
    res.status(500).json({ message: 'Server error while fetching today\'s log' });
  }
};

// @desc    Get logs for a date range
// @route   GET /api/logs/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
// @access  Private
export const getLogsByDateRange = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ message: 'Please provide startDate and endDate' });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const logs = await DailyLog.find({
      user: userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    console.error('Get logs by date range error:', error);
    res.status(500).json({ message: 'Server error while fetching logs' });
  }
};

// @desc    Log weight for today
// @route   POST /api/logs/weight
// @access  Private
export const addWeight = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { weight } = req.body;

    if (!weight || typeof weight !== 'number' || weight <= 0) {
      res.status(400).json({ message: 'Please provide a valid weight (in kg)' });
      return;
    }

    if (weight < 20 || weight > 500) {
      res.status(400).json({ message: 'Weight must be between 20 and 500 kg' });
      return;
    }

    // Get or create today's log
    const log = await getTodayLog(userId);
    log.weight = weight;
    await log.save();

    // Update health profile with new weight and recalculate BMI
    const profile = await HealthProfile.findOne({ user: userId });

    if (profile) {
      profile.weight = weight;
      profile.bmi = calcBMI(profile.height, weight);
      profile.bmiCategory = getBMICategory(profile.bmi);
      profile.recommendedCalories = calcRecommendedCalories(profile.activityLevel, profile.goals);
      await profile.save();
    }

    res.status(200).json({
      success: true,
      message: 'Weight logged successfully',
      log: {
        date: log.date,
        weight: log.weight,
        waterIntake: log.waterIntake,
        calories: log.calories,
        workouts: log.workouts,
      },
      updatedProfile: profile
        ? {
            weight: profile.weight,
            bmi: profile.bmi,
            bmiCategory: profile.bmiCategory,
            recommendedCalories: profile.recommendedCalories,
          }
        : null,
    });
  } catch (error) {
    console.error('Add weight error:', error);
    res.status(500).json({ message: 'Server error while logging weight' });
  }
};