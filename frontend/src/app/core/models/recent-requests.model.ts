export interface RecentRequest {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  submittedAt?: string;

  createdBy?: {
    _id?: string;
    firstName: string;
    lastName: string;
  };

  workflow?: {
    _id?: string;
    name: string;
  };

  team?: {
    _id?: string;
    name: string;
  };

  currentApprover?: {
    _id?: string;
    firstName: string;
    lastName: string;
  };
}
