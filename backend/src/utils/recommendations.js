/**
 * Generate personalized exercise plan based on BMI category, goals, and activity level
 */
export const getExercisePlan = (bmiCategory, goals, activityLevel) => {
  const plans = {
    // Underweight - Focus on Strength + Yoga
    Underweight: [
      {
        type: 'Strength',
        duration: 45,
        description: 'Full body strength training with compound movements (squats, deadlifts, bench press)',
      },
      {
        type: 'Yoga',
        duration: 30,
        description: 'Gentle yoga for flexibility and mind-body connection',
      },
      {
        type: 'Strength',
        duration: 40,
        description: 'Upper body focused - pull-ups, rows, shoulder press',
      },
    ],

    // Normal - Balanced routine
    Normal: [
      {
        type: 'Cardio',
        duration: 30,
        description: 'Moderate intensity cardio - jogging, cycling, or swimming',
      },
      {
        type: 'Strength',
        duration: 40,
        description: 'Full body resistance training with weights',
      },
      {
        type: 'Flexibility',
        duration: 25,
        description: 'Stretching and mobility work to prevent injuries',
      },
    ],

    // Overweight - More Cardio + HIIT
    Overweight: [
      {
        type: 'Cardio',
        duration: 40,
        description: 'Steady-state cardio - brisk walking, elliptical, or cycling',
      },
      {
        type: 'HIIT',
        duration: 25,
        description: 'High-intensity interval training - burpees, jump squats, mountain climbers',
      },
      {
        type: 'Strength',
        duration: 30,
        description: 'Circuit training with bodyweight and light weights',
      },
    ],

    // Obese - Low-impact Cardio + gradual strength
    Obese: [
      {
        type: 'Cardio',
        duration: 30,
        description: 'Low-impact cardio - walking, water aerobics, or stationary bike',
      },
      {
        type: 'Strength',
        duration: 20,
        description: 'Gentle strength training focusing on major muscle groups',
      },
      {
        type: 'Flexibility',
        duration: 20,
        description: 'Gentle stretching and chair yoga for mobility',
      },
    ],
  };

  let workouts = plans[bmiCategory] || plans.Normal;

  // Adjust based on goals
  if (goals === 'Weight Loss') {
    // Add more cardio and HIIT
    workouts = [
      ...workouts,
      {
        type: 'HIIT',
        duration: 20,
        description: 'Fat-burning HIIT session - sprint intervals or tabata training',
      },
    ];
  } else if (goals === 'Muscle Gain') {
    // Add more strength training
    workouts = [
      ...workouts,
      {
        type: 'Strength',
        duration: 50,
        description: 'Progressive overload strength training - focus on hypertrophy (8-12 reps)',
      },
    ];
  }

  // Adjust intensity based on activity level
  if (activityLevel === 'Low') {
    workouts = workouts.map((w) => ({
      ...w,
      duration: Math.round(w.duration * 0.7),
      description: `Beginner level: ${w.description}`,
    }));
  } else if (activityLevel === 'High') {
    workouts = workouts.map((w) => ({
      ...w,
      duration: Math.round(w.duration * 1.2),
      description: `Advanced level: ${w.description}`,
    }));
  }

  return workouts;
};

/**
 * Generate personalized diet plan based on BMI category, goals, and diet type
 */
export const getDietPlan = (bmiCategory, goals, dietType = 'veg') => {
  // Base diet plans
  const vegPlans = {
    'Weight Loss': {
      breakfast: [
        'Oatmeal with berries and chia seeds',
        'Green smoothie with spinach, banana, and protein powder',
        'Whole grain toast with avocado and boiled eggs',
      ],
      lunch: [
        'Quinoa salad with mixed vegetables and chickpeas',
        'Brown rice with dal and steamed vegetables',
        'Whole wheat wrap with hummus, veggies, and tofu',
      ],
      dinner: [
        'Grilled paneer with roasted vegetables',
        'Vegetable stir-fry with tofu and cauliflower rice',
        'Lentil soup with a side salad',
      ],
      snacks: [
        'Greek yogurt with almonds',
        'Apple slices with peanut butter',
        'Mixed nuts and seeds (handful)',
        'Cucumber and carrot sticks with hummus',
      ],
    },
    'Maintain': {
      breakfast: [
        'Whole grain cereal with milk and banana',
        'Vegetable poha with peanuts',
        'Smoothie bowl with fruits, granola, and seeds',
      ],
      lunch: [
        'Brown rice with mixed dal and sabzi',
        'Whole wheat roti with paneer curry and salad',
        'Vegetable biryani with raita',
      ],
      dinner: [
        'Grilled vegetables with quinoa',
        'Palak paneer with brown rice',
        'Mixed vegetable curry with roti',
      ],
      snacks: [
        'Fresh fruit salad',
        'Roasted chickpeas',
        'Whole grain crackers with cheese',
        'Protein shake',
      ],
    },
    'Muscle Gain': {
      breakfast: [
        'Protein pancakes with banana and peanut butter',
        'Scrambled eggs (or tofu scramble) with whole grain toast',
        'Oatmeal with protein powder, nuts, and honey',
      ],
      lunch: [
        'Brown rice with rajma and paneer',
        'Chickpea pasta with vegetables and olive oil',
        'Quinoa bowl with beans, avocado, and tahini',
      ],
      dinner: [
        'Grilled paneer tikka with sweet potato',
        'Lentil curry with brown rice and ghee',
        'Tofu stir-fry with nuts and seeds',
      ],
      snacks: [
        'Protein shake with banana',
        'Peanut butter sandwich on whole grain bread',
        'Greek yogurt with granola and berries',
        'Trail mix with dried fruits and nuts',
      ],
    },
  };

  const nonVegPlans = {
    'Weight Loss': {
      breakfast: [
        'Scrambled eggs with spinach and whole grain toast',
        'Greek yogurt with berries and protein granola',
        'Egg white omelet with vegetables',
      ],
      lunch: [
        'Grilled chicken breast with quinoa and steamed broccoli',
        'Tuna salad with mixed greens and olive oil',
        'Turkey wrap with whole wheat tortilla and veggies',
      ],
      dinner: [
        'Baked salmon with roasted vegetables',
        'Grilled chicken with cauliflower rice',
        'Fish curry with brown rice',
      ],
      snacks: [
        'Boiled eggs',
        'Greek yogurt',
        'Chicken breast strips',
        'Protein shake',
      ],
    },
    'Maintain': {
      breakfast: [
        'Egg bhurji with whole wheat roti',
        'Chicken sausage with whole grain toast',
        'Protein smoothie with eggs and fruits',
      ],
      lunch: [
        'Chicken biryani with raita',
        'Fish curry with brown rice',
        'Grilled chicken salad with quinoa',
      ],
      dinner: [
        'Grilled fish with vegetables',
        'Chicken tikka with roti and dal',
        'Mutton curry with brown rice',
      ],
      snacks: [
        'Boiled eggs with nuts',
        'Chicken sandwich',
        'Greek yogurt with honey',
        'Protein bar',
      ],
    },
    'Muscle Gain': {
      breakfast: [
        'Scrambled eggs (4-5) with whole grain toast and avocado',
        'Protein pancakes with chicken sausage',
        'Egg and cheese omelet with hash browns',
      ],
      lunch: [
        'Grilled chicken breast with sweet potato and vegetables',
        'Beef or chicken with brown rice and beans',
        'Salmon with quinoa and avocado',
      ],
      dinner: [
        'Grilled steak with roasted potatoes',
        'Chicken curry with brown rice and ghee',
        'Fish with pasta and olive oil',
      ],
      snacks: [
        'Protein shake with whole milk',
        'Chicken breast with peanut butter',
        'Boiled eggs (3-4) with nuts',
        'Greek yogurt with granola and honey',
      ],
    },
  };

  const plans = dietType === 'veg' ? vegPlans : nonVegPlans;
  let plan = plans[goals] || plans.Maintain;

  // Adjust portions based on BMI category
  if (bmiCategory === 'Underweight' || bmiCategory === 'Obese') {
    // Add note about portion control
    plan = {
      ...plan,
      snacks: [
        ...plan.snacks,
        bmiCategory === 'Underweight'
          ? 'Note: Increase portions for weight gain'
          : 'Note: Practice portion control for weight management',
      ],
    };
  }

  return plan;
};