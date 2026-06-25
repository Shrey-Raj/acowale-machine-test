export interface Feedback {
  _id: string;
  category: string;
  comments: string;
  email?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalFeedbacks: number;
  totalUsers: number;
  feedbackGrowth: string;
  historicalData: Array<{ month: string; feedbacks: number; users: number }>;
  categoryDistribution: Array<{ name: string; value: number }>;
}

export interface Props {
  activeTab: "overview" | "feedbacks";
  setActiveTab: (tab: "overview" | "feedbacks") => void;
}
