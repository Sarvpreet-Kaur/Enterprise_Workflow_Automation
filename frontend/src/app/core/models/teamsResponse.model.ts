import { Pagination } from "./paginationmodel";
import { Team } from "./teams.model";

export interface TeamResponse {
    summary: {
        totalUsers: number,
        activeUsers: number,
        inActiveUsers: number,
        admins: number
    }
    data: Team[];
    pagination: Pagination;
}
