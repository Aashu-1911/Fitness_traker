import mongoose from 'mongoose';

const { Schema } = mongoose;

const challengeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: [true, 'Challenge type is required'],
      enum: ['Daily', 'Weekly'],
    },
    title: {
      type: String,
      required: [true, 'Challenge title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Challenge description is required'],
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    dateAssigned: {
      type: Date,
      default: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique challenge per user + type + dateAssigned
challengeSchema.index({ user: 1, type: 1, dateAssigned: 1 }, { unique: true });

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;