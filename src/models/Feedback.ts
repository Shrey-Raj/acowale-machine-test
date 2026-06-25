import mongoose, { Schema, models } from 'mongoose';

const FeedbackSchema = new Schema(
  {
    category: {
      type: String,
      enum: ['Product', 'Feature request', 'UI/UX', 'Support', 'Billing', 'Other'],
      required: true,
    },
    comments: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true, 
  }
);

export const Feedback = models.Feedback || mongoose.model('Feedback', FeedbackSchema);