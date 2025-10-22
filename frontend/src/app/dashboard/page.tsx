"use client";

import { Loader } from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { InterviewHistoryItem } from "@/types";
import { Briefcase, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const router = useRouter();
    const { user, token, logout } = useAuth();
    const [history, setHistory] = useState<InterviewHistoryItem[]>([]);

    useEffect(() => {
        if (!token) return router.push("/login");

        const fetchHistory = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/interviews/history`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch interview history");
                }
                const data = await response.json();
                setHistory(data);
            } catch (error) {
                console.error("Error fetching interview history:", error);
            }
        };

        fetchHistory();
    }, [token, router]);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <Loader message="Loading user data..." />
            </div>
        );
    }

    const formatInterviewType = (type: string) => {
        return type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    };

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
                            Customize your Interview to match the role
                            you&apos;re applying for.
                        </p>
                        <button
                            onClick={() => router.push("/interview/setup")}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-lg text-white font-bold transition duration-300"
                        >
                            Configure New Interview
                        </button>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-6">Your Interview History</h2>
                        {history === null ? (
                            <Loader message="Loading interview history..." />
                        ) : history.length === 0 ? (
                            <p className="text-gray-400 text-center">You have no completed interviews yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {history.map((item) => (
                                    <Link href={`/interview/feedback/${item.sessionId}`} key={item.sessionId} >
                                        <div className="bg-gray-700 p-4 hover:bg-gray-600 rounded-lg flex justify-between items-center cursor-pointer transition-colors">
                                            <div>
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <Briefcase className="w-5 h-5 text-indigo-400"/>
                                                    <p className="font-bold text-lg">{formatInterviewType(item.interviewType)}</p>
                                                </div>
                                                <div className="flex items-center space-x-3 text-sm text-gray-400">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-semibold text-indigo-300">View Feedback</span>
                                                <ChevronRight className="w-5 h-5 text-indigo-300" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
