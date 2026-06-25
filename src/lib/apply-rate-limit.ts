import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";

export async function applyRateLimit(
  req: NextRequest,
  limiter: Ratelimit
) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "anonymous";

  const { success } = await limiter.limit(ip);

  if (!success) {
    return NextResponse.json(
      { success: false, message: "Too many requests" },
      { status: 429 }
    );
  }

  return null;
}