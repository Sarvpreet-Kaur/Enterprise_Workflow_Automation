export interface User {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    role: string;
    team: string;
    isActive: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        totalRecords: number;
        currentPage: number;
        totalPages: number;
        pageSize: number;
    };
}

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    department: string;
    role: string;
    team: string;
}