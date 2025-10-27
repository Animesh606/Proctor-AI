"use client";

import { resetPassword } from "@/services/authService";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
    const params = useParams();
    const token = params.token as string;
    const router = useRouter();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setMessage("");
        try {
            await resetPassword(token, newPassword);
            setMessage(
                "Password has been reset successfully. Redirecting to login..."
            );
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (error) {
            setError(
                "Failed to reset password. The link may be invalid or expired."
            );
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center">
                    Reset Your Password
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <p className="text-red-500 text-center">{error}</p>
                    )}
                    {message && (
                        <p className="text-green-500 text-center">{message}</p>
                    )}
                    <div>
                        <label className="block text-sm font-medium">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !!message}
                        className="button-primary"
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
