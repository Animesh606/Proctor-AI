"use client";

import { useAuth } from "@/context/AuthContext";
import { register, verifyOtp, resendOtp } from "@/services/authService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RegistrationStep = "DETAILS" | "OTP";

export default function Register() {
    const [step, setStep] = useState<RegistrationStep>("DETAILS");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { login: authLogin, user } = useAuth();
    const router = useRouter();
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(60);
    const [isCooldownActive, setIsCooldownActive] = useState(false);

    if (user) {
        router.push("/dashboard");
    }

    const handleRegistrationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage("");

        try {
            const data = await register({ username, email, password });
            setMessage(data.message || "OTP sent to your email.");
            setStep("OTP");
        } catch (error) {
            setError("Registration failed. Email might already exist.");
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const data = await verifyOtp({ email, otp });
            authLogin(data.token);
            router.push("/dashboard");
        } catch (error) {
            setError("Invalid or expired OTP. Please try again.");
        }
    };

    const handleResendOtp = async () => {
        if (isCooldownActive) return;

        setError(null);
        setMessage("");
        setIsResending(true);
        setIsCooldownActive(true);
        setResendCooldown(60);
        try {
            await resendOtp(email);
            setMessage("OTP resent successfully.");
        } catch (error) {
            setError("Failed to resend OTP.");
            setIsCooldownActive(false);
            setResendCooldown(0);
        } finally {
            setIsResending(false);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isCooldownActive && resendCooldown > 0) {
            interval = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        } else if (resendCooldown === 0) {
            setIsCooldownActive(false);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isCooldownActive, resendCooldown]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
                {step === "DETAILS" && (
                    <>
                        <h1 className="text-2xl font-bold text-center">
                            Register for Proctor AI
                        </h1>
                        <form
                            onSubmit={handleRegistrationSubmit}
                            className="space-y-6"
                        >
                            {error && (
                                <p className="text-red-500 text-center">
                                    {error}
                                </p>
                            )}
                            <div>
                                <label className="block text-sm font-medium">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    className="input-field"
                                />
                            </div>
                            <button type="submit" className="button-primary">
                                Register
                            </button>
                        </form>
                        <p className="text-center text-sm text-gray-400">
                            Already have an account?
                            <Link href="/login" className="link">
                                Login here
                            </Link>
                        </p>
                    </>
                )}

                {step === "OTP" && (
                    <>
                        <h1 className="text-2xl font-bold text-center">
                            Verify Your Email
                        </h1>
                        <p className="text-center text-gray-400">{message}</p>
                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            {error && (
                                <p className="text-red-500 text-center">
                                    {error}
                                </p>
                            )}
                            <div>
                                <label className="block text-sm font-medium">
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength={6}
                                    className="input-field text-center tracking-[1em]" // Style for OTP input
                                />
                            </div>
                            <button type="submit" className="button-primary">
                                Verify OTP & Login
                            </button>
                        </form>
                        <div className="text-center text-sm text-gray-400">
                            Didn't receive the OTP?
                            <button
                                onClick={handleResendOtp}
                                className="link disabled:text-gray-500 disabled:cursor-not-allowed"
                                disabled={isResending || isCooldownActive}
                            >
                                {isResending ? "Sending..." : isCooldownActive
                                    ? `Resend OTP in ${resendCooldown}s`
                                    : "Resend OTP"}
                            </button>
                        </div>
                        <p className="text-center text-sm text-gray-400">
                            Entered wrong email?
                            <button
                                onClick={() => setStep("DETAILS")}
                                className="link"
                            >
                                Go Back
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
