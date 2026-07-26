export interface CreateTeam {

  name: string;
  department: string;
  manager?: string
  admin?: string
  isActive: boolean;
}
