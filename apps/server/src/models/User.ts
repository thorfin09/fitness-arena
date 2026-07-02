import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['member', 'admin', 'trainer'],
      default: 'member',
    },
    membership: {
      plan: {
        type: String,
        enum: ['None', 'Beast Starter', 'Power Lifter', 'Olympian Pro'],
        default: 'None',
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'inactive',
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default model('User', UserSchema);
