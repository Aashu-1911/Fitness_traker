import HealthProfile from '../models/HealthProfile.js';
import { getExercisePlan, getDietPlan } from '../utils/recommendations.js';

// @desc    Get personalized exercise recommendations
// @route   GET /api/recommendations/exercise
// @access  Private
export const getExerciseRecommendations = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Fetch user's health profile
    const profile = await HealthProfile.findOne({ user: userId });

    if (!profile) {
      res.status(404).json({
        message: 'Health profile not found. Please create your profile first.',
      });
      return;
    }

    // Generate exercise plan
    const exercisePlan = getExercisePlan(
      profile.bmiCategory,
      profile.goals,
      profile.activityLevel
    );

    res.status(200).json({
      success: true,
      message: 'Personalized exercise plan generated',
      profile: {
        bmiCategory: profile.bmiCategory,
        goals: profile.goals,
        activityLevel: profile.activityLevel,
      },
      exercisePlan,
      recommendations: {
        totalWorkouts: exercisePlan.length,
        weeklyMinutes: exercisePlan.reduce((sum, workout) => sum + workout.duration, 0),
        tip:
          profile.goals === 'Weight Loss'
            ? 'Focus on consistency and gradually increase intensity for best results.'
            : profile.goals === 'Muscle Gain'
            ? 'Ensure proper nutrition and rest between strength training sessions.'
            : 'Maintain a balanced routine to stay healthy and fit.',
      },
    });
  } catch (error) {
    console.error('Get exercise recommendations error:', error);
    res.status(500).json({ message: 'Server error while generating exercise recommendations' });
  }
};

// @desc    Get personalized diet recommendations
// @route   GET /api/recommendations/diet?dietType=veg|nonveg
// @access  Private
export const getDietRecommendations = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Get diet type from query params (default to 'veg')
    const dietType = req.query.dietType || 'veg';

    if (dietType !== 'veg' && dietType !== 'nonveg') {
      res.status(400).json({ message: 'Invalid diet type. Use "veg" or "nonveg".' });
      return;
    }

    // Fetch user's health profile
    const profile = await HealthProfile.findOne({ user: userId });

    if (!profile) {
      res.status(404).json({
        message: 'Health profile not found. Please create your profile first.',
      });
      return;
    }

    // Generate diet plan
    const dietPlan = getDietPlan(profile.bmiCategory, profile.goals, dietType);

    res.status(200).json({
      success: true,
      message: 'Personalized diet plan generated',
      profile: {
        bmiCategory: profile.bmiCategory,
        goals: profile.goals,
        recommendedCalories: profile.recommendedCalories,
      },
      dietType,
      dietPlan,
      recommendations: {
        dailyCalories: profile.recommendedCalories,
        waterIntake: '2.5-3 liters per day',
        mealTiming: {
          breakfast: '7:00 AM - 9:00 AM',
          lunch: '12:00 PM - 2:00 PM',
          dinner: '6:00 PM - 8:00 PM',
          snacks: 'Between meals as needed',
        },
        tip:
          profile.goals === 'Weight Loss'
            ? 'Focus on portion control and avoid processed foods. Stay hydrated!'
            : profile.goals === 'Muscle Gain'
            ? 'Eat protein-rich meals and maintain a calorie surplus. Don\'t skip meals!'
            : 'Eat balanced meals with variety. Listen to your body\'s hunger cues.',
      },
    });
  } catch (error) {
    console.error('Get diet recommendations error:', error);
    res.status(500).json({ message: 'Server error while generating diet recommendations' });
  }
};

// @desc    Get complete recommendations (exercise + diet)
// @route   GET /api/recommendations/complete?dietType=veg|nonveg
// @access  Private
export const getCompleteRecommendations = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const dietType = req.query.dietType || 'veg';

    if (dietType !== 'veg' && dietType !== 'nonveg') {
      res.status(400).json({ message: 'Invalid diet type. Use "veg" or "nonveg".' });
      return;
    }

    // Fetch user's health profile
    const profile = await HealthProfile.findOne({ user: userId });

    if (!profile) {
      res.status(404).json({
        message: 'Health profile not found. Please create your profile first.',
      });
      return;
    }

    // Generate both plans
    const exercisePlan = getExercisePlan(
      profile.bmiCategory,
      profile.goals,
      profile.activityLevel
    );
    const dietPlan = getDietPlan(profile.bmiCategory, profile.goals, dietType);

    res.status(200).json({
      success: true,
      message: 'Complete personalized health plan generated',
      profile: {
        name: profile.name,
        age: profile.age,
        bmi: profile.bmi,
        bmiCategory: profile.bmiCategory,
        goals: profile.goals,
        activityLevel: profile.activityLevel,
        recommendedCalories: profile.recommendedCalories,
      },
      exercisePlan: {
        workouts: exercisePlan,
        weeklyMinutes: exercisePlan.reduce((sum, workout) => sum + workout.duration, 0),
      },
      dietPlan: {
        type: dietType,
        meals: dietPlan,
        dailyCalories: profile.recommendedCalories,
      },
      generalTips: [
        'Stay consistent with your routine',
        'Get 7-8 hours of quality sleep',
        'Stay hydrated throughout the day',
        'Track your progress regularly',
        'Listen to your body and adjust as needed',
      ],
    });
  } catch (error) {
    console.error('Get complete recommendations error:', error);
    res.status(500).json({ message: 'Server error while generating complete recommendations' });
  }
};