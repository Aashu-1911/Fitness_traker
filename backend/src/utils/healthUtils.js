/**
 * Calculate BMI (Body Mass Index)
 * Formula: weight (kg) / (height (m))^2
 */
export const calcBMI = (heightCm, weightKg) => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10; // Round to 1 decimal place
};

/**
 * Get BMI Category based on BMI value
 */
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal';
  } else if (bmi >= 25 && bmi < 30) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
};

/**
 * Calculate recommended daily calories based on activity level and goals
 */
export const calcRecommendedCalories = (activityLevel, goals) => {
  // Base calories based on activity level
  const baseCalories = {
    Low: 1800,
    Moderate: 2200,
    High: 2600,
  };

  let calories = baseCalories[activityLevel];

  // Adjust based on goals
  if (goals === 'Weight Loss') {
    // Reduce calories by 12.5% (average of 10-15%)
    calories = calories * 0.875;
  } else if (goals === 'Muscle Gain') {
    // Increase calories by 15% (average of 10-20%)
    calories = calories * 1.15;
  }
  // For 'Maintain', keep base calories

  return Math.round(calories); // Return rounded integer
};