import HealthProfile from '../models/HealthProfile.js';
import { calcBMI, getBMICategory, calcRecommendedCalories } from '../utils/healthUtils.js';

// @desc    Get user's health profile
// @route   GET /api/health/profile
// @access  Private
export const getHealthProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const profile = await HealthProfile.findOne({ user: userId });

    if (!profile) {
      res.status(404).json({ message: 'Health profile not found' });
      return;
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Get health profile error:', error);
    res.status(500).json({ message: 'Server error while fetching health profile' });
  }
};

// @desc    Create user's health profile
// @route   POST /api/health/profile
// @access  Private
export const createHealthProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Check if profile already exists
    const existingProfile = await HealthProfile.findOne({ user: userId });
    if (existingProfile) {
      res.status(400).json({ message: 'Health profile already exists. Use PUT to update.' });
      return;
    }

    const { age, gender, height, weight, activityLevel, goals, healthConditions } = req.body;

    // Validation
    if (!age || !gender || !height || !weight || !activityLevel || !goals) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    // Get user name from authenticated user
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId);
    const userName = user?.name || 'User';

    // Calculate BMI and related fields
    const bmi = calcBMI(height, weight);
    const bmiCategory = getBMICategory(bmi);
    const recommendedCalories = calcRecommendedCalories(activityLevel, goals);

    // Create profile
    const profile = await HealthProfile.create({
      user: userId,
      name: userName,
      age,
      gender,
      height,
      weight,
      activityLevel,
      goals,
      healthConditions: healthConditions && healthConditions.trim() ? [healthConditions.trim()] : [],
      bmi,
      bmiCategory,
      recommendedCalories,
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error('Create health profile error:', error);
    res.status(500).json({ message: 'Server error while creating health profile' });
  }
};

// @desc    Update user's health profile
// @route   PUT /api/health/profile
// @access  Private
export const updateHealthProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const profile = await HealthProfile.findOne({ user: userId });

    if (!profile) {
      res.status(404).json({ message: 'Health profile not found. Please create one first.' });
      return;
    }

    const { age, gender, height, weight, activityLevel, goals, healthConditions } = req.body;

    // Update fields if provided
    if (age !== undefined) profile.age = age;
    if (gender !== undefined) profile.gender = gender;
    if (height !== undefined) profile.height = height;
    if (weight !== undefined) profile.weight = weight;
    if (activityLevel !== undefined) profile.activityLevel = activityLevel;
    if (goals !== undefined) profile.goals = goals;
    if (healthConditions !== undefined) {
      profile.healthConditions = healthConditions && healthConditions.trim() ? [healthConditions.trim()] : [];
    }

    // Recalculate BMI and related fields
    profile.bmi = calcBMI(profile.height, profile.weight);
    profile.bmiCategory = getBMICategory(profile.bmi);
    profile.recommendedCalories = calcRecommendedCalories(profile.activityLevel, profile.goals);

    // Save updated profile
    const updatedProfile = await profile.save();

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Update health profile error:', error);
    res.status(500).json({ message: 'Server error while updating health profile' });
  }
};