import { NextRequest, NextResponse } from 'next/server';
import { formatErrorResponse, ApiError } from './api-error';

type RouteHandler = (req: NextRequest, context?: any) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      const formatted = formatErrorResponse(error);
      const status = error instanceof ApiError ? error.statusCode : 500;
      return NextResponse.json(formatted, { status });
    }
  };
}