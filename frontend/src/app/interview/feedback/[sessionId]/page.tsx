"use client";

import FeedbackSection from "@/components/FeedbackSection";
import { Loader } from "@/components/Loader";
import ScoreCircle from "@/components/ScoreCircle";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FeedbackPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;
    const { token } = useAuth();
    const [report, setReport] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token || !sessionId) return;

        const fetchReport = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/feedback/${sessionId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    data.strengths = JSON.parse(data.strengths);
                    data.areasForImprovement = JSON.parse(
                        data.areasForImprovement
                    );
                    setReport(data);
                    setIsLoading(false);
                    return true;
                }
                if (response.status === 404) {
                    console.error("Error fetching report:", response.statusText);
                }
                return false;
            } catch (error) {
                console.error("Failed to fetch feedback report:", error);
                return false;
            }
        };

        const intervalId = setInterval(async () => {
            const success = await fetchReport();
            if (success) clearInterval(intervalId);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [token, sessionId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
                <Loader message="Our AI is analyzing your performance, This may take a moment.." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="max-w-4xl font-bold text-center mb-4">
                    Interview Feedback Report
                </h1>
                <p className="text-center mb-10 bg-gray-400">
                    Here's a summary of your interview performance:
                </p>

                <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                    <div className="flex flex-col md:flex-row justify-around items-center mb-10 gap-8">
                        <ScoreCircle
                            score={report.technicalScore}
                            label="Technical Skills"
                        />
                        <ScoreCircle
                            score={report.communicationScore}
                            label="Communication"
                        />
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-3">
                            Overall Summary
                        </h2>
                        <p className="text-gray-300 leading-relaxed">{report.overallSummary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FeedbackSection
                            title="Strengths"
                            items={report.strengths}
                            colorClass="text-green-400"
                        />
                        <FeedbackSection
                            title="Areas for Improvement"
                            items={report.areasForImprovement}
                            colorClass="text-yellow-400"
                        />
                    </div>

                    <div className="text-center mt-12">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition duration-300"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
