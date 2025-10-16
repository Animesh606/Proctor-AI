"use client";

import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { CheckCircle, Zap, BrainCircuit } from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />

            <main>
                <div className="pt-20 pb-20 text-center">
                    <h1 className="text-5xl md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Ace Your Next Tech Interview with AI
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Practice with a realistic AI interviewer that asks
                        relevant questions, understands your answers, and
                        provides instant, actionable feedback. Stop rehearsing,
                        start conversing.
                    </p>
                    <Link
                        href="/register"
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-lg font-bold transition-transform transform hover:scale-105"
                    >
                        Start for Free
                    </Link>
                </div>
            </main>

            <section id="features" className="py-20 bg-gray-800 bg-opacity-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">
                        Why ProctorAI?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap size={40} />}
                            title="Realistic Conversations"
                        >
                            Our AI doesn't follow script. It listens,
                            understands context, and asks relevant follow-up
                            questions just like a real interviewer.
                        </FeatureCard>
                        <FeatureCard
                            icon={<BrainCircuit size={40} />}
                            title="Personalized Sessions"
                        >
                            Customize your mock interviews by tech stack
                            experience level, and duration to match the exact
                            role you're targeting.
                        </FeatureCard>
                        <FeatureCard
                            icon={<CheckCircle size={40} />}
                            title="Instant, Actionable Feedback"
                        >
                            Receive a detailed report after every session,
                            analyzing your technical skills, communication, and
                            areas for improvement with AI-powered insights.
                        </FeatureCard>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-12">
                        Get Started in 3 Easy Steps
                    </h2>
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-8">
                        <div className="flex-1">
                            <div className="text-5xl font-bold text-indigo-400 mb-2">
                                1
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                                Configure
                            </h3>
                            <p className="text-gray-400">
                                Choose your role, experience, and specific
                                topics you want to focus on.
                            </p>
                        </div>
                        <div className="text-indigo-400 text-3xl hidden md:block">
                            &rarr;
                        </div>
                        <div className="flex-1">
                            <div className="text-5xl font-bold text-indigo-400 mb-2">
                                2
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                                Converse
                            </h3>
                            <p className="text-gray-400">
                                Engage in a live, voice-based interview with our
                                conversational AI.
                            </p>
                        </div>
                        <div className="text-indigo-400 text-3xl hidden md:block">
                            &rarr;
                        </div>
                        <div className="flex-1">
                            <div className="text-5xl font-bold text-indigo-400 mb-2">
                                3
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Conquer</h3>
                            <p className="text-gray-400">
                                Analyze your detailed feedback report to
                                identify strengths and improve.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gray-800 bg-opacity-50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-4">
                        Ready to Land Your Dream Job?
                    </h2>
                    <p className="text-lg text-gray-400 mb-8">
                        The best way to get confident is to practice. Start your
                        journey with ProctorAI today.
                    </p>
                    <Link
                        href="/register"
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-lg font-bold transition-transform transform hover:scale-105"
                    >
                        Sign Up and Start Practicing
                    </Link>
                </div>
            </section>

            <footer className="py-8 text-center text-gray-500">
                <p>
                    &copy; {new Date().getFullYear()} ProctorAI. All rights
                    reserved.
                </p>
            </footer>
        </div>
    );
}
