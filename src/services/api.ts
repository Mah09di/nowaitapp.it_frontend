// src/services/api.ts
import AuthService from './auth';

class ApiService {
    private static instance: ApiService;
    private baseUrl: string = 'https://nowaitapp.ir/api/v1';

    private constructor() { }

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    private async request<T>(
        endpoint: string,
        method: string = 'GET',
        data?: any,
        requiresAuth: boolean = true
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (requiresAuth) {
            const authService = AuthService;

            // بررسی اعتبار توکن
            if (!authService.isTokenValid()) {
                // تلاش برای رفرش توکن
                const refreshed = await authService.refreshToken();
                if (!refreshed) {
                    authService.clearTokens();
                    window.location.href = '/login';
                    throw new Error('Unauthorized');
                }
            }

            const authHeader = authService.getAuthHeader();
            Object.assign(headers, authHeader);
        }

        const options: RequestInit = {
            method,
            headers,
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (response.status === 401) {
            // توکن منقضی شده
            const authService = AuthService;
            authService.clearTokens();
            window.location.href = '/login';
            throw new Error('Unauthorized');
        }

        return response.json();
    }

    public get<T>(endpoint: string, requiresAuth: boolean = true): Promise<T> {
        return this.request<T>(endpoint, 'GET', undefined, requiresAuth);
    }

    public post<T>(endpoint: string, data?: any, requiresAuth: boolean = true): Promise<T> {
        return this.request<T>(endpoint, 'POST', data, requiresAuth);
    }

    public put<T>(endpoint: string, data?: any, requiresAuth: boolean = true): Promise<T> {
        return this.request<T>(endpoint, 'PUT', data, requiresAuth);
    }

    public delete<T>(endpoint: string, requiresAuth: boolean = true): Promise<T> {
        return this.request<T>(endpoint, 'DELETE', undefined, requiresAuth);
    }
}

export default ApiService.getInstance();