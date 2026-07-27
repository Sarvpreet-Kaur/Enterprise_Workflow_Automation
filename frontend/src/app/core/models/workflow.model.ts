export interface WorkflowStep {
  order: number;
  approverRole: 'manager' | 'admin';
  canReject: boolean;
}

export interface Workflow {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  steps: WorkflowStep[];
  createdAt: string;
}
