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

export const resendOtp = async (email: string): Promise<void> => {
    const response = await fetch(`${API_URL}/resend-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
    if (!response.ok) {
        throw new Error('Resend OTP failed');
    }
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

export const requestPasswordReset = async (email: string): Promise<void> => {
    const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
    if (!response.ok) {
        throw new Error('Password reset request failed');
    }
}

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
    });
    if (!response.ok) {
        throw new Error('Password reset failed. Invalid or expired token.');
    }
}
