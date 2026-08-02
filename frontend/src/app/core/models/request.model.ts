import { ApprovalHistory } from './approvalHistory.model';
import { WorkflowStep } from './workflow.model';

export interface Request {
  _id: string;

  title: string;

  description: string;

  workflow: {
    _id: string;
    name: string;
    description?: string;
    steps?: WorkflowStep[];
  };

  priority: 'Low' | 'Medium' | 'High';

  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };

  team: {
    _id: string;
    name: string;
    department?: string;
  };

  currentApprover?: {
    _id: string;
    firstName: string;
    lastName: string;
  };

  currentStep?: number;

  approvalHistory: ApprovalHistory[];

  submittedAt?: string;

  createdAt: string;

  updatedAt?: string;
}
