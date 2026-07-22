export interface DashboardResponse {
  summary: {
    drafts?: number;
    pending: number;
    approved: number;
    rejected: number;
    cancelled?: number;
  };

  recentRequests: any[];

  pendingApprovals: {
    count: number;
    requests: any[];
  } | null;

  system: {
    users: number;
    teams: number;
    workflows: number;
  } | null;

}
