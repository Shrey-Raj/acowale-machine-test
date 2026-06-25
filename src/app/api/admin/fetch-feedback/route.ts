import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db';
import { Feedback } from '@/models/Feedback';
import { withErrorHandler } from '@/lib/api-handler';
import { authOptions } from '../../auth/[...nextauth]/route';
import { UnauthorizedError, ValidationError } from '@/lib/api-error';
import { feedbackFilterSchema } from '@/lib/validations/feedback';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new UnauthorizedError('You must be logged in');
  }

  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const rawParams = Object.fromEntries(searchParams.entries());
  
  const cleanedParams = Object.fromEntries(
    Object.entries(rawParams).map(([key, val]) => [key, val === '' ? undefined : val])
  );

  const validation = feedbackFilterSchema.safeParse(cleanedParams);

  if (!validation.success) {
    throw new ValidationError(
      'Invalid query parameters',
      validation.error.format()
    );
  }

  const { page, limit, search, sort, category, from, to } = validation.data;

  const filter: any = {};

  if (category && category !== 'all') {
    filter.category = category;
  }

  if (search) {
    filter.comments = { $regex: search, $options: 'i' };
  }

  if (from || to) {
    filter.createdAt = {};
    
    if (from) {
      filter.createdAt.$gte = new Date(`${from}T00:00:00.000Z`);
    }
    
    if (to) {
      filter.createdAt.$lte = new Date(`${to}T23:59:59.999Z`);
    } else if (from) {
      filter.createdAt.$lte = new Date(`${from}T23:59:59.999Z`);
    }
  }

  const sortOrder: Record<string, 1 | -1> = {
    createdAt: sort === 'newest' ? -1 : 1,
  };

  const skip = (page - 1) * limit;
  const totalPipeline = [{ $match: filter }, { $count: 'total' }];

  const [feedbacks, totalResult] = await Promise.all([
    Feedback.find(filter)
      .sort(sortOrder)
      .limit(limit)
      .skip(skip)
      .select('-__v'),
    Feedback.aggregate(totalPipeline),
  ]);

  const total = totalResult.length > 0 ? totalResult[0].total : 0;

  return NextResponse.json({
    success: true,
    data: {
      feedbacks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    },
    message: 'Feedbacks fetched successfully',
  });
});