import { z } from 'zod';

export const feedbackSchema = z.object({
  category: z.enum(['Product', 'Feature request', 'UI/UX', 'Support', 'Billing', 'Other']),
  comments: z.string().min(1, 'Comments are required').max(1000, 'Comments are too long'),
  email: z.email({ error: "Invalid email format" }).optional().or(z.literal("")),
});

export const feedbackFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sort: z.enum(['newest', 'oldest']).default('newest'),
  category: z.string().optional(),
  // date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (use YYYY-MM-DD)').optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid format (use YYYY-MM-DD)").optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid format (use YYYY-MM-DD)").optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type FeedbackFilterInput = z.infer<typeof feedbackFilterSchema>;