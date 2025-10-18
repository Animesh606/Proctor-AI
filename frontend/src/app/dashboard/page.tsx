"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const router = useRouter();
    const { user, logout } = useAuth();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    if (!user) {
        return <p>Loading...</p>;
    }
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <nav className="bg-gray-800 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Proctor AI Dashboard</h1>
                <div>
                    <span className="mr-4">Welcome, {user.username}!</span>
                    <button
                        onClick={() => {
                            logout();
                            router.push("/login");
                        }}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                        Logout
                    </button>
                </div>
            </nav>
            <main className="p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">
                            Start a New Mock Interview
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Customize your Interview to match the role you&apos;re
                            applying for.
                        </p>
                        <button
                            onClick={() => router.push("/interview/setup")}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-lg text-white font-bold transition duration-300"
                        >
                            Configure New Interview
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
