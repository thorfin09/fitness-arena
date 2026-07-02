import { Schema, model } from 'mongoose';

const WorkoutSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    trainer: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true, // e.g., '45 mins', '1 hour'
    },
    intensity: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Beast Level'],
      default: 'Intermediate',
    },
    schedule: {
      type: String,
      required: true, // e.g., 'Mon, Wed, Fri - 7:00 AM'
    },
    capacity: {
      type: Number,
      required: true,
      default: 20,
    },
    bookedCount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: ['Strength', 'Cardio', 'Powerlifting', 'Yoga', 'HIIT'],
      default: 'Strength',
    },
  },
  {
    timestamps: true,
  }
);

export default model('Workout', WorkoutSchema);
