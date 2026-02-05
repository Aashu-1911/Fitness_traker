/**
 * Generate a daily fitness challenge based on user's BMI category and goals
 */
export const generateDailyChallenge = (bmiCategory, goals) => {
  const challenges = {
    'Weight Loss': [
      {
        title: '10,000 Steps Challenge',
        
        description: 'Walk or run 10,000 steps today. Track your progress and stay active throughout the day!',
      },
      {
        title: '20-Minute HIIT Workout',
        description: 'Complete a 20-minute High-Intensity Interval Training session. Push yourself with burpees, jump squats, and mountain climbers!',
      },
      {
        title: 'No Sugar Day',
        description: 'Avoid all added sugars today. Opt for natural sweeteners like fruits and stay hydrated!',
      },
      {
        title: 'Cardio Blast',
        description: 'Do 30 minutes of continuous cardio - running, cycling, or swimming. Keep your heart rate elevated!',
      },
    ],
    'Muscle Gain': [
      {
        title: '100 Push-ups Challenge',
        description: 'Complete 100 push-ups throughout the day (can be broken into sets). Focus on proper form!',
      },
      {
        title: '50 Squats with Weight',
        description: 'Perform 50 weighted squats today. Use dumbbells or a barbell. Build those legs!',
      },
      {
        title: 'Protein Power Day',
        description: 'Consume at least 1.5g of protein per kg of body weight today. Track your protein intake!',
      },
      {
        title: 'Upper Body Strength',
        description: 'Complete 5 sets of pull-ups, rows, and shoulder presses. Maximum muscle engagement!',
      },
    ],
    'Maintain': [
      {
        title: 'Balanced Workout Day',
        description: '30 minutes cardio + 20 minutes strength training. Keep your fitness balanced!',
      },
      {
        title: 'Flexibility Focus',
        description: 'Complete a 30-minute yoga or stretching session. Improve your flexibility and mobility!',
      },
      {
        title: 'Hydration Challenge',
        description: 'Drink at least 3 liters of water today. Set reminders and carry a water bottle!',
      },
      {
        title: 'Active Recovery',
        description: 'Go for a gentle 45-minute walk or bike ride. Keep moving at a comfortable pace!',
      },
    ],
  };

  // Special adaptations for BMI categories
  if (bmiCategory === 'Obese') {
    return {
      title: 'Low-Impact Cardio Session',
      description: '20-30 minutes of low-impact cardio like walking, swimming, or cycling. Listen to your body and maintain a steady pace.',
    };
  }

  if (bmiCategory === 'Underweight') {
    return {
      title: 'Gentle Strength & Flexibility',
      description: '30 minutes of light resistance training combined with yoga. Focus on building strength gradually.',
    };
  }

  // Select based on goals
  const goalChallenges = challenges[goals] || challenges['Maintain'];
  const randomIndex = Math.floor(Math.random() * goalChallenges.length);
  return goalChallenges[randomIndex];
};

/**
 * Generate a weekly fitness challenge based on user's BMI category and goals
 */
export const generateWeeklyChallenge = (bmiCategory, goals) => {
  const challenges = {
    'Weight Loss': [
      {
        title: '5-Day Cardio Streak',
        description: 'Complete at least 30 minutes of cardio for 5 days this week. Track your daily sessions!',
      },
      {
        title: '50,000 Steps This Week',
        description: 'Accumulate 50,000 steps over the next 7 days. Average 7,000+ steps daily!',
      },
      {
        title: 'Clean Eating Week',
        description: 'Follow your diet plan strictly for 7 days. No processed foods, track every meal!',
      },
      {
        title: 'Calorie Deficit Challenge',
        description: 'Maintain a healthy calorie deficit every day this week. Log all your meals and stay within your target!',
      },
    ],
    'Muscle Gain': [
      {
        title: '500 Push-ups This Week',
        description: 'Complete 500 total push-ups across 7 days. Break into manageable sets daily!',
      },
      {
        title: 'Progressive Overload Week',
        description: 'Increase your weights by 5-10% on all strength exercises this week. Track your progress!',
      },
      {
        title: 'Protein-Packed Week',
        description: 'Hit your daily protein target (1.6g/kg body weight) for all 7 days. Meal prep is key!',
      },
      {
        title: 'Full Body Split',
        description: 'Complete 4 full-body strength training sessions this week with progressive resistance!',
      },
    ],
    'Maintain': [
      {
        title: 'Balanced Week Challenge',
        description: 'Complete 3 cardio sessions and 2 strength sessions this week. Keep your routine balanced!',
      },
      {
        title: 'Daily Movement Streak',
        description: 'Be active for at least 30 minutes every single day for 7 days. No rest days!',
      },
      {
        title: 'Mindful Eating Week',
        description: 'Practice portion control and mindful eating for 7 consecutive days. No distractions during meals!',
      },
      {
        title: 'Flexibility & Strength',
        description: 'Alternate between yoga/stretching and strength training for 6 sessions this week!',
      },
    ],
  };

  // Special adaptations for BMI categories
  if (bmiCategory === 'Obese') {
    return {
      title: 'Consistency Week',
      description: 'Complete at least 20 minutes of low-impact exercise for 5 days this week. Build a sustainable routine!',
    };
  }

  if (bmiCategory === 'Underweight') {
    return {
      title: 'Strength Building Week',
      description: 'Complete 4 light resistance training sessions this week. Focus on form and gradual progression!',
    };
  }

  // Select based on goals
  const goalChallenges = challenges[goals] || challenges['Maintain'];
  const randomIndex = Math.floor(Math.random() * goalChallenges.length);
  return goalChallenges[randomIndex];
};