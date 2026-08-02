export interface UpdateRequest {
  title: string;

  description: string;

  workflow: string;

  priority: 'Low' | 'Medium' | 'High';

  team?: string;
}
