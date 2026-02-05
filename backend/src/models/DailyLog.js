import mongoose from 'mongoose';

const { Schema } = mongoose;

const workoutSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Workout name is required'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Workout duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    type: {
      type: String,
      required: [true, 'Workout type is required'],
      enum: ['Cardio', 'Strength', 'HIIT', 'Yoga', 'Flexibility'],
    },
  },
  { _id: true }
);

const dailyLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      },
    },
    waterIntake: {
      type: Number,
      default: 0,
      min: [0, 'Water intake cannot be negative'],
    },
    calories: {
      type: Number,
      default: 0,
      min: [0, 'Calories cannot be negative'],
    },
    workouts: {
      type: [workoutSchema],
      default: [],
    },
    weight: {
      type: Number,
      required: false,
      min: [20, 'Weight must be at least 20 kg'],
      max: [500, 'Weight must be less than 500 kg'],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure each user has a unique log per day
dailyLogSchema.index({ user: 1, date: 1 }, { unique: true });

const DailyLog = mongoose.model('DailyLog', dailyLogSchema);

export default DailyLog;