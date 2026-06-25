import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Feedback } from '@/models/Feedback';
import { feedbackSchema } from '@/lib/validations/feedback';
import { withErrorHandler } from '@/lib/api-handler';
import { ValidationError } from '@/lib/api-error';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();

  const result = feedbackSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError('Invalid input', result.error.issues);
  }

  await connectToDatabase();

  const feedback = await Feedback.create({
    category: result.data.category,
    comments: result.data.comments,
    email: result.data.email || undefined,
  });

  return NextResponse.json(
    {
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    },
    { status: 201 }
  );
});