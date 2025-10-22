"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OptionCard from "@/components/OptionCard";

export default function InterviewSetupPage() {
    const router = useRouter();
    const { token } = useAuth();
    const [interviewType, setInterviewType] = useState("TECHNICAL");
    const [experienceLevel, setExperienceLevel] = useState("FRESHER");
    const [duration, setDuration] = useState(15);
    const [customRequirements, setCustomRequirements] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/interviews`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        interviewType,
                        experienceLevel,
                        durationMinutes: duration,
                        customRequirements,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create interview session");
            }

            const data = await response.json();
            router.push(`/interview/${data.sessionId}`);
        } catch (error) {
            console.error(error);
            alert("Error creating interview session. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            router.push("/login");
        }
    }, [token, router]);

    if (!token) {
        return <p>Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-2 text-center">
                    Customer Your Interview
                </h1>
                <p className="text-gray-400 mb-8 text-center">
                    Tailor the session to your needs
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <OptionCard label="Tech Stack / Role">
                            <select
                                value={interviewType}
                                onChange={(e) =>
                                    setInterviewType(e.target.value)
                                }
                                className="w-full p-2 rounded bg-gray-600"
                            >
                                <option value="TECHNICAL">
                                    Choose Tech Stack
                                </option>
                                <option value="JAVA_BACKEND">
                                    Java Backend
                                </option>
                                <option value="SPRING">Spring Framework</option>
                                <option value="MERN_STACK">MERN Stack</option>
                                <option value="REACT">React</option>
                                <option value="NODE_JS">Node.js</option>
                                <option value="NEXT_JS">Next.js</option>
                                <option value="FLASK">Flask</option>
                                <option value="DATA_SCIENCE">
                                    Data Science
                                </option>
                                <option value="TYPESCRIPT">TypeScript</option>
                                <option value="PYTHON">Python</option>
                                <option value="GO">Go</option>
                                <option value="JAVASCRIPT">JavaScript</option>
                                <option value="C_SHARP">C#</option>
                                <option value="PHP">PHP</option>
                                <option value="RUBY">Ruby</option>
                                <option value="SWIFT">Swift</option>
                                <option value="KOTLIN">Kotlin</option>
                                <option value="DART">Dart</option>
                                <option value="GRAPHQL">GraphQL</option>
                                <option value="WEB_DEVELOPMENT">
                                    Web Development
                                </option>
                                <option value="DOCKER">Docker</option>
                                <option value="KUBERNETES">Kubernetes</option>
                                <option value="AWS">AWS</option>
                                <option value="DEVOPS">Devops</option>
                                <option value="DATA_STRUCTURES">
                                    Data Structures & Algos
                                </option>
                                <option value="BEHAVIORAL">Behavioral</option>
                            </select>
                        </OptionCard>

                        <OptionCard label="Experience Level">
                            <select
                                value={experienceLevel}
                                onChange={(e) =>
                                    setExperienceLevel(e.target.value)
                                }
                                className="w-full p-2 rounded bg-gray-600"
                            >
                                <option value="FRESHER">
                                    Fresher (0-1 years)
                                </option>
                                <option value="MID_LEVEL">
                                    Mid Level (2-5 years)
                                </option>
                                <option value="SENIOR">
                                    Senior (5+ years)
                                </option>
                            </select>
                        </OptionCard>
                    </div>

                    <OptionCard label="Session Duration">
                        <select
                            value={duration}
                            onChange={(e) =>
                                setDuration(Number(e.target.value))
                            }
                            className="w-full p-2 rounded bg-gray-600"
                        >
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>1 hour</option>
                        </select>
                    </OptionCard>

                    <OptionCard label="Specific Requirements (Optional)">
                        <textarea
                            value={customRequirements}
                            onChange={(e) =>
                                setCustomRequirements(e.target.value)
                            }
                            className="w-full p-2 rounded bg-gray-600"
                            rows={3}
                            placeholder="e.g., Focus on system design, algorithms, etc."
                        />
                    </OptionCard>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-lg text-white font-bold transition duration-300 disabled:bg-gray-500"
                    >
                        {isLoading ? "Starting Session..." : "Start Interview"}
                    </button>
                </form>
            </div>
        </div>
    );
}
