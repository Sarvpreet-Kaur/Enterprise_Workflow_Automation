export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  teams: string[];
  isActive: boolean;
}
