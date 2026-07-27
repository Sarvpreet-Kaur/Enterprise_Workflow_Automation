import { Workflow } from "./workflow.model";
import { Pagination } from "./paginationmodel";

export interface WorkflowResponse {
    
    data: Workflow[];
    pagination: Pagination;
}
