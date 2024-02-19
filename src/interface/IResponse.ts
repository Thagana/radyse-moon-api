export interface LoginResponse {
    success: boolean;
    token?: string;
    message?: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    errors?: {message: string}[];
    token?: string
}