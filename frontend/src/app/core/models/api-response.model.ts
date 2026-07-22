// core/models/api-response.model.ts

export interface ApiResponse<T> {
    success: string;
    data: T;
}
