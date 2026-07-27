import { WorkflowStep } from "./workflow.model";

export interface UpdateWorkflow {
  name: string;
  description?: string;
  isActive: boolean;
  steps: WorkflowStep[];
}