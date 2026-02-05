import Challenge from '../models/Challenge.js';
import HealthProfile from '../models/HealthProfile.js';
import { generateDailyChallenge, generateWeeklyChallenge } from '../utils/challengeGenerator.js';

/**
 * Get the start of the current week (Monday)
 */
const getWeekStart = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const weekStart = new Date(today.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

// @desc    Get or create daily challenge
// @route   GET /api/challenges/daily
// @access  Private
export const getDailyChallenge = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Get today's date (normalized to start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if daily challenge exists for today
    let challenge = await Challenge.findOne({
      user: userId,
      type: 'Daily',
      dateAssigned: today,
    });

    // If no challenge exists, create a new one
    if (!challenge) {
      // Fetch user's health profile for personalization
      const profile = await HealthProfile.findOne({ user: userId });

      if (!profile) {
        res.status(404).json({
          message: 'Health profile not found. Please create your profile first.',
        });
        return;
      }

      // Generate new challenge
      const challengeData = generateDailyChallenge(profile.bmiCategory, profile.goals);

      // Save to database
      challenge = await Challenge.create({
        user: userId,
        type: 'Daily',
        title: challengeData.title,
        description: challengeData.description,
        dateAssigned: today,
      });
    }

    res.status(200).json({
      success: true,
      challenge: {
        id: challenge._id,
        type: challenge.type,
        title: challenge.title,
        description: challenge.description,
        isCompleted: challenge.isCompleted,
        dateAssigned: challenge.dateAssigned,
      },
    });
  } catch (error) {
    console.error('Get daily challenge error:', error);
    res.status(500).json({ message: 'Server error while fetching daily challenge' });
  }
};

// @desc    Get or create weekly challenge
// @route   GET /api/challenges/weekly
// @access  Private
export const getWeeklyChallenge = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Get the start of current week
    const weekStart = getWeekStart();

    // Check if weekly challenge exists for this week
    let challenge = await Challenge.findOne({
      user: userId,
      type: 'Weekly',
      dateAssigned: weekStart,
    });

    // If no challenge exists, create a new one
    if (!challenge) {
      // Fetch user's health profile for personalization
      const profile = await HealthProfile.findOne({ user: userId });

      if (!profile) {
        res.status(404).json({
          message: 'Health profile not found. Please create your profile first.',
        });
        return;
      }

      // Generate new challenge
      const challengeData = generateWeeklyChallenge(profile.bmiCategory, profile.goals);

      // Save to database
      challenge = await Challenge.create({
        user: userId,
        type: 'Weekly',
        title: challengeData.title,
        description: challengeData.description,
        dateAssigned: weekStart,
      });
    }

    res.status(200).json({
      success: true,
      challenge: {
        id: challenge._id,
        type: challenge.type,
        title: challenge.title,
        description: challenge.description,
        isCompleted: challenge.isCompleted,
        dateAssigned: challenge.dateAssigned,
      },
    });
  } catch (error) {
    console.error('Get weekly challenge error:', error);
    res.status(500).json({ message: 'Server error while fetching weekly challenge' });
  }
};

// @desc    Mark challenge as completed
// @route   PUT /api/challenges/complete/:id
// @access  Private
export const completeChallenge = async (req, res) => {
  try {
    const userId = req.user?.id;
    const challengeId = req.params.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Find challenge
    const challenge = await Challenge.findOne({
      _id: challengeId,
      user: userId,
    });

    if (!challenge) {
      res.status(404).json({ message: 'Challenge not found' });
      return;
    }

    // Check if already completed
    if (challenge.isCompleted) {
      res.status(400).json({ message: 'Challenge already completed' });
      return;
    }

    // Mark as completed
    challenge.isCompleted = true;
    await challenge.save();

    res.status(200).json({
      success: true,
      message: 'Challenge completed successfully! 🎉',
      challenge: {
        id: challenge._id,
        type: challenge.type,
        title: challenge.title,
        description: challenge.description,
        isCompleted: challenge.isCompleted,
        dateAssigned: challenge.dateAssigned,
      },
    });
  } catch (error) {
    console.error('Complete challenge error:', error);
    res.status(500).json({ message: 'Server error while completing challenge' });
  }
};

// @desc    Get challenge history
// @route   GET /api/challenges/history?days=30&type=Daily
// @access  Private
export const getChallengeHistory = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const days = parseInt(req.query.days) || 30;
    const type = req.query.type; // 'Daily', 'Weekly', or undefined for all

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const filter = {
      user: userId,
      dateAssigned: { $gte: startDate },
    };

    if (type) {
      filter.type = type;
    }

    const challenges = await Challenge.find(filter)
      .sort({ dateAssigned: -1 })
      .limit(50);

    const completedCount = challenges.filter(c => c.isCompleted).length;
    const completionRate = challenges.length > 0 ? (completedCount / challenges.length) * 100 : 0;

    res.status(200).json({
      success: true,
      challenges,
      stats: {
        total: challenges.length,
        completed: completedCount,
        pending: challenges.length - completedCount,
        completionRate: Math.round(completionRate),
      },
    });
  } catch (error) {
    console.error('Get challenge history error:', error);
    res.status(500).json({ message: 'Server error while fetching challenge history' });
  }
};