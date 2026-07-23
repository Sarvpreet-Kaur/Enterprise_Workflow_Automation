import { User } from "./user.model";
import { Pagination } from "./paginationmodel";

export interface UserResponse {
    summary: {
        totalUsers: number,
        activeUsers: number,
        inActiveUsers: number,
        admins: number
    }
    data: User[];
    pagination: Pagination;
}
