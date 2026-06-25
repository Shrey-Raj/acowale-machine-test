import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/api-handler";
import { connectToDatabase } from "@/lib/db";
import { Feedback } from "@/models/Feedback";

export const GET = withErrorHandler(async (req: NextRequest) => {
  await connectToDatabase();

  const totalFeedbacks = await Feedback.countDocuments();

  const totalUsers = await Feedback.distinct("email").then(
    (emails) => emails.filter((e) => e).length,
  );

  const categoryAgg = await Feedback.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const categoryDistribution = categoryAgg.map((item) => ({
    name: item._id || "Uncategorized",
    value:
      totalFeedbacks > 0 ? Math.round((item.count / totalFeedbacks) * 100) : 0,
  }));

  const historicalAgg = await Feedback.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        feedbacks: { $sum: 1 },
        users: { $addToSet: "$email" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const historicalData = historicalAgg.map((item) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return {
      month: `${monthNames[item._id.month - 1]}`,
      feedbacks: item.feedbacks,
      users: item.users.filter((email: string) => email).length,
    };
  });

  let feedbackGrowth = "0.00%";

  if (historicalData.length >= 2) {
    const lastMonth = historicalData[historicalData.length - 1];
    const prevMonth = historicalData[historicalData.length - 2];

    if (prevMonth.feedbacks > 0) {
      const fbChange =
        ((lastMonth.feedbacks - prevMonth.feedbacks) / prevMonth.feedbacks) *
        100;
      feedbackGrowth = `${fbChange >= 0 ? "+" : ""}${fbChange.toFixed(2)}%`;
    } else if (lastMonth.feedbacks > 0) {
      feedbackGrowth = "+100.00%";
    }
  }

  const response = {
    totalFeedbacks,
    totalUsers,
    feedbackGrowth,
    historicalData,
    categoryDistribution,
  };

  return NextResponse.json({
    success: true,
    message: "Analytics summary processed successfully",
    data: response,
  });
});
