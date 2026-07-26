export interface Team {
  _id: string;
  name: string;
  department: string;
  manager?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string
  };
  admin?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string
  };
  isActive: boolean;
  createdAt: string;
}
