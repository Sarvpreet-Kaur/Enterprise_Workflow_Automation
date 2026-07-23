export interface User {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    teams?: {
      _id?: string;
      name?: string;
      department?: string
    };
    isActive: boolean;
    createdAt: string
}

