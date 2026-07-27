import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment';
import { Workflow } from '../models/workflow.model';
import { CreateWorkflow } from '../models/createWorkflow.model';
import { UpdateWorkflow } from '../models/updateWorkflow.model';
import { WorkflowResponse } from '../models/workflowResponse.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
    providedIn: 'root',
})
export class WorkflowService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/workflow`;

    getWorkflows(params?: { search?: string; page?: number; limit?: number }){
        let httpParams = new HttpParams();
        if (params?.search) {
            httpParams = httpParams.set('search', params.search);
        }
        if (params?.page) {
            httpParams = httpParams.set('page', params.page);
        }
        if (params?.limit) {
            httpParams = httpParams.set('limit', params.limit);
        }
        return this.http.get<WorkflowResponse>(this.apiUrl, {
            params: httpParams,
        });
    }

    createWorkflow(payload: CreateWorkflow) {
        return this.http.post<ApiResponse<Workflow>>(this.apiUrl, payload);
    }

    updateWorkflow(id: string, payload: UpdateWorkflow) {
        return this.http.put<ApiResponse<Workflow>>(`${this.apiUrl}/${id}`, payload);
    }

    deleteWorkflow(id: string) {
        return this.http.delete<ApiResponse<Workflow>>(`${this.apiUrl}/${id}`);
    }
}
