interface AuthTokens {
    access: string;
    refresh: string;
    expires_in: number;
    token_type: string;
}

interface UserData {
    id: number;
    phone: string;
    is_center_manager: boolean;
}

interface CenterData {
    id: number;
    name: string;
    address: string;
    phone: string;
    latitude: number;
    longitude: number;
}

class AuthService {
    private static instance: AuthService;
    private tokenRefreshTimer: number | null = null;

    private constructor() { }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public setTokens(tokens: AuthTokens): void {
        try {
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);
            localStorage.setItem('token_type', tokens.token_type);
            localStorage.setItem('expires_in', String(tokens.expires_in));

            const expiresAt = Date.now() + (tokens.expires_in * 1000);
            localStorage.setItem('expires_at', String(expiresAt));

            this.scheduleTokenRefresh(tokens.expires_in);
        } catch (error) {
            console.error('خطا در ذخیره توکن:', error);
        }
    }

    public getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    public getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    }

    public getTokenType(): string {
        return localStorage.getItem('token_type') || 'Bearer';
    }

    public getAuthHeader(): { Authorization: string } | {} {
        const token = this.getAccessToken();
        const tokenType = this.getTokenType();
        if (token) {
            return { Authorization: `${tokenType} ${token}` };
        }
        return {};
    }

    public isTokenValid(): boolean {
        const expiresAt = localStorage.getItem('expires_at');
        if (!expiresAt) return false;

        const expiresTime = parseInt(expiresAt);
        const bufferTime = 5 * 60 * 1000;
        return Date.now() + bufferTime < expiresTime;
    }

    public async refreshToken(): Promise<boolean> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return false;

        try {
            const response = await fetch('https://nowaitapp.ir/api/v1/accounts/auth/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            const data = await response.json();

            if (response.ok && data.access) {
                const newTokens = {
                    access: data.access,
                    refresh: refreshToken,
                    expires_in: 86400,
                    token_type: 'Bearer',
                };
                this.setTokens(newTokens);
                return true;
            } else {
                this.clearTokens();
                return false;
            }
        } catch (error) {
            console.error('خطا در رفرش توکن:', error);
            return false;
        }
    }

    private scheduleTokenRefresh(expiresIn: number): void {
        if (this.tokenRefreshTimer) {
            clearTimeout(this.tokenRefreshTimer);
            this.tokenRefreshTimer = null;
        }

        const refreshTime = (expiresIn - 300) * 1000;
        if (refreshTime > 0) {
            this.tokenRefreshTimer = window.setTimeout(() => {
                this.refreshToken();
            }, refreshTime);
        }
    }

    public clearTokens(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_type');
        localStorage.removeItem('expires_in');
        localStorage.removeItem('expires_at');

        if (this.tokenRefreshTimer) {
            clearTimeout(this.tokenRefreshTimer);
            this.tokenRefreshTimer = null;
        }
    }

    public setUserData(user: UserData, center: CenterData): void {
        try {
            localStorage.setItem('user_data', JSON.stringify(user));
            localStorage.setItem('center_data', JSON.stringify(center));
        } catch (error) {
            console.error('خطا در ذخیره اطلاعات کاربر:', error);
        }
    }

    public getUserData(): UserData | null {
        try {
            const data = localStorage.getItem('user_data');
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    }

    public getCenterData(): CenterData | null {
        try {
            const data = localStorage.getItem('center_data');
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    }

    public isAuthenticated(): boolean {
        return !!this.getAccessToken() && this.isTokenValid();
    }
}

export default AuthService.getInstance();