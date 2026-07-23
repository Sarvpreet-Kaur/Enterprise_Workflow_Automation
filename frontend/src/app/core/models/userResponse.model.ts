import { User } from "./user.model";
import { Pagination } from "./paginationmodel";

export interface UserResponse {
    data: User[];
    pagination: Pagination;
}
