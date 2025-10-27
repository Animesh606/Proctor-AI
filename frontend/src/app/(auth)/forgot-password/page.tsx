"use client";

import { requestPasswordReset } from "@/services/authService";
import Link from "next/dist/client/link";
import { useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage("");
        try {
            await requestPasswordReset(email);
            setMessage(
                "Password reset instructions have been sent to your email."
            );
        } catch (error) {
            setError("Failed to send password reset email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center">
                    Forgot Your Password?
                </h1>
                <p className="text-center text-gray-400">
                    Enter your email address below, and we'll send you a link to
                    reset your password.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <p className="text-red-500 text-center">{error}</p>
                    )}
                    {message && (
                        <p className="text-green-500 text-center">{message}</p>
                    )}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="button-primary"
                    >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-400">
                    Remember your password?
                    <Link href="/login" className="link">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
