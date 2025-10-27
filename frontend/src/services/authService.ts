import { RegisterData, LoginData, AuthResponse } from '../types';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw new Error('Registration failed');
    }
    return response.json();
}

export const verifyOtp = async (data: { email: string; otp: string }): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'OTP verification failed');
    }
    return response.json();
}

export const login = async (credentials: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        throw new Error('Authentication failed');
    }
    return response.json();
}
