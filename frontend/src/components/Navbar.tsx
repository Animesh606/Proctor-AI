"use client";

import Link from "next/link";

export const Navbar = () => {
    return (
        <nav className="bg-gray-900 bg-opacity-50 backdrop-blur-md p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="text-white text-2xl font-bold">
                    Proctor<span className="text-indigo-400">AI</span>
                </Link>
                <div className="space-x-4">
                    <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
};