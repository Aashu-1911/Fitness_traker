import mongoose, { Schema } from 'mongoose';

const healthProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [1, 'Age must be at least 1'],
      max: [150, 'Age must be less than 150'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female', 'Other'],
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
      min: [50, 'Height must be at least 50 cm'],
      max: [300, 'Height must be less than 300 cm'],
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [20, 'Weight must be at least 20 kg'],
      max: [500, 'Weight must be less than 500 kg'],
    },
    activityLevel: {
      type: String,
      required: [true, 'Activity level is required'],
      enum: ['Low', 'Moderate', 'High'],
    },
    goals: {
      type: String,
      required: [true, 'Goals are required'],
      enum: ['Weight Loss', 'Maintain', 'Muscle Gain'],
    },
    healthConditions: {
      type: [String],
      default: [],
    },
    bmi: {
      type: Number,
      required: true,
    },
    bmiCategory: {
      type: String,
      required: true,
    },
    recommendedCalories: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const HealthProfile = mongoose.model('HealthProfile', healthProfileSchema);

export default HealthProfile;