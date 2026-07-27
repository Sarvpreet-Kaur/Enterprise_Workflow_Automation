import { WorkflowStep } from "./workflow.model";

export interface CreateWorkflow {
  name: string;
  description?: string;
  isActive: boolean;
  steps: WorkflowStep[];
}