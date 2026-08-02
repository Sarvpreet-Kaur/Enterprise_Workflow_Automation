import { Pagination } from "./paginationmodel";
import { Request } from "./request.model";

export interface RequestResponse {
    data: Request[];
    pagination: Pagination;
}
