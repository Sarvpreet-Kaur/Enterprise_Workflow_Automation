import { RecentRequest } from "./recent-requests.model";

export interface DashboardResponse {
  summary: {
    drafts?: number;
    pending: number;
    approved: number;
    rejected: number;
    cancelled?: number;
  };

  recentRequests: RecentRequest[];

  pendingApprovals: {
    count: number;
    requests: RecentRequest[];
  } | null;

  system: {
    users: number;
    teams: number;
    workflows: number;
  } | null;

}
