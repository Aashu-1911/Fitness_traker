import DailyLog from '../models/DailyLog.js';

// @desc    Get weight trend data for charts
// @route   GET /api/analytics/weight-trend?days=30
// @access  Private
export const getWeightTrend = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Get number of days from query (default 30)
    const days = parseInt(req.query.days) || 30;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Fetch logs with weight data
    const logs = await DailyLog.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
      weight: { $exists: true, $ne: null },
    })
      .select('date weight')
      .sort({ date: 1 });

    // Format data for charts
    const dates = logs.map((log) => log.date.toISOString().split('T')[0]);
    const weights = logs.map((log) => log.weight);

    // Calculate trend statistics
    const weightChange =
      weights.length >= 2 ? weights[weights.length - 1] - weights[0] : 0;
    const avgWeight =
      weights.length > 0
        ? weights.reduce((sum, w) => sum + (w || 0), 0) / weights.length
        : 0;

    res.status(200).json({
      success: true,
      data: {
        dates,
        weights,
      },
      stats: {
        dataPoints: logs.length,
        startWeight: weights[0] || null,
        currentWeight: weights[weights.length - 1] || null,
        weightChange: Math.round(weightChange * 10) / 10,
        averageWeight: Math.round(avgWeight * 10) / 10,
        trend: weightChange > 0 ? 'increasing' : weightChange < 0 ? 'decreasing' : 'stable',
      },
    });
  } catch (error) {
    console.error('Get weight trend error:', error);
    res.status(500).json({ message: 'Server error while fetching weight trend' });
  }
};

// @desc    Get water intake trend
// @route   GET /api/analytics/water-trend?days=30
// @access  Private
export const getWaterTrend = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const days = parseInt(req.query.days) || 30;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const logs = await DailyLog.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    })
      .select('date waterIntake')
      .sort({ date: 1 });

    const dates = logs.map((log) => log.date.toISOString().split('T')[0]);
    const waterIntakes = logs.map((log) => log.waterIntake);

    const avgWater =
      waterIntakes.length > 0
        ? waterIntakes.reduce((sum, w) => sum + w, 0) / waterIntakes.length
        : 0;
    const totalWater = waterIntakes.reduce((sum, w) => sum + w, 0);

    res.status(200).json({
      success: true,
      data: {
        dates,
        waterIntakes,
      },
      stats: {
        dataPoints: logs.length,
        averageDaily: Math.round(avgWater),
        totalIntake: totalWater,
        goal: 2500, // 2.5 liters in ml
      },
    });
  } catch (error) {
    console.error('Get water trend error:', error);
    res.status(500).json({ message: 'Server error while fetching water trend' });
  }
};

// @desc    Get calorie intake trend
// @route   GET /api/analytics/calorie-trend?days=30
// @access  Private
export const getCalorieTrend = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const days = parseInt(req.query.days) || 30;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const logs = await DailyLog.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    })
      .select('date calories')
      .sort({ date: 1 });

    const dates = logs.map((log) => log.date.toISOString().split('T')[0]);
    const calories = logs.map((log) => log.calories);

    const avgCalories =
      calories.length > 0 ? calories.reduce((sum, c) => sum + c, 0) / calories.length : 0;
    const totalCalories = calories.reduce((sum, c) => sum + c, 0);

    res.status(200).json({
      success: true,
      data: {
        dates,
        calories,
      },
      stats: {
        dataPoints: logs.length,
        averageDaily: Math.round(avgCalories),
        totalIntake: totalCalories,
      },
    });
  } catch (error) {
    console.error('Get calorie trend error:', error);
    res.status(500).json({ message: 'Server error while fetching calorie trend' });
  }
};

// @desc    Get workout summary
// @route   GET /api/analytics/workout-summary?days=30
// @access  Private
export const getWorkoutSummary = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const days = parseInt(req.query.days) || 30;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const logs = await DailyLog.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    })
      .select('date workouts')
      .sort({ date: 1 });

    const workoutData = {
      totalWorkouts: 0,
      totalMinutes: 0,
      workoutDays: 0,
      byType: {},
      dates: [],
      dailyMinutes: [],
    };

    logs.forEach((log) => {
      const dayWorkouts = log.workouts || [];
      const dayMinutes = dayWorkouts.reduce((sum, w) => sum + w.duration, 0);

      workoutData.dates.push(log.date.toISOString().split('T')[0]);
      workoutData.dailyMinutes.push(dayMinutes);

      if (dayWorkouts.length > 0) {
        workoutData.workoutDays++;
        workoutData.totalWorkouts += dayWorkouts.length;
        workoutData.totalMinutes += dayMinutes;

        dayWorkouts.forEach((workout) => {
          if (!workoutData.byType[workout.type]) {
            workoutData.byType[workout.type] = { count: 0, minutes: 0 };
          }
          workoutData.byType[workout.type].count++;
          workoutData.byType[workout.type].minutes += workout.duration;
        });
      }
    });

    res.status(200).json({
      success: true,
      data: {
        dates: workoutData.dates,
        dailyMinutes: workoutData.dailyMinutes,
      },
      summary: {
        totalWorkouts: workoutData.totalWorkouts,
        totalMinutes: workoutData.totalMinutes,
        workoutDays: workoutData.workoutDays,
        averagePerDay: workoutData.workoutDays > 0 
          ? Math.round(workoutData.totalMinutes / workoutData.workoutDays) 
          : 0,
        workoutsByType: workoutData.byType,
        consistency: Math.round((workoutData.workoutDays / days) * 100),
      },
    });
  } catch (error) {
    console.error('Get workout summary error:', error);
    res.status(500).json({ message: 'Server error while fetching workout summary' });
  }
};

// @desc    Get complete dashboard analytics
// @route   GET /api/analytics/dashboard?days=30
// @access  Private
export const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const days = parseInt(req.query.days) || 30;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const logs = await DailyLog.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    const analytics = {
      totalDays: days,
      loggedDays: logs.length,
      averageCalories: 0,
      averageWater: 0,
      totalWorkouts: 0,
      workoutDays: 0,
      currentStreak: 0,
      longestStreak: 0,
    };

    if (logs.length > 0) {
      // Calculate averages
      analytics.averageCalories = Math.round(
        logs.reduce((sum, log) => sum + log.calories, 0) / logs.length
      );
      analytics.averageWater = Math.round(
        logs.reduce((sum, log) => sum + log.waterIntake, 0) / logs.length
      );

      // Calculate workout stats
      logs.forEach((log) => {
        if (log.workouts && log.workouts.length > 0) {
          analytics.workoutDays++;
          analytics.totalWorkouts += log.workouts.length;
        }
      });

      // Calculate streaks (consecutive workout days)
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      // Check from most recent backwards for current streak
      for (let i = logs.length - 1; i >= 0; i--) {
        if (logs[i].workouts && logs[i].workouts.length > 0) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Calculate longest streak
      logs.forEach((log) => {
        if (log.workouts && log.workouts.length > 0) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      });

      analytics.currentStreak = currentStreak;
      analytics.longestStreak = longestStreak;
    }

    res.status(200).json({
      success: true,
      analytics,
      chartData: {
        dates: logs.map(log => log.date.toISOString().split('T')[0]),
        calories: logs.map(log => log.calories),
        water: logs.map(log => log.waterIntake),
        workouts: logs.map(log => (log.workouts || []).length),
      },
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard analytics' });
  }
};