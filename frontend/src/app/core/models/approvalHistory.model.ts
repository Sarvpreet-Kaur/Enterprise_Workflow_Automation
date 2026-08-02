export interface ApprovalHistory {
  step: number;

  approver: {
    _id: string;
    firstName: string;
    lastName: string;
  };

  role: 'manager' | 'admin';

  action: 'Approved' | 'Rejected';

  comments: string;

  actionAt: string;
}
