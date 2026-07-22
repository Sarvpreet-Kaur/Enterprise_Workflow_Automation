export interface RecentRequest {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  createdBy?: {
    firstName: string;
    lastName: string;
  };
}
