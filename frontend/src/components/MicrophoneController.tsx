"use client";

interface MicrophoneControllerProps {
    isListening: boolean;
    startListening: () => void;
}

export const MicrophoneController = ({
    isListening,
    startListening,
}: MicrophoneControllerProps) => {
    return (
        <div className="flex justify-center items-center relative w-20 h-20">
            <button
                onClick={startListening}
                disabled={isListening}
                className={`relative w-full h-full rounded-full transition-colors duration-300 ease-in-out ${
                    isListening
                        ? "bg-red-500 animate-pulse"
                        : "bg-indigo-600 hover:bg-indigo-700"
                } flex items-center justify-center text-white focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-900`}
            >
                {isListening && (
                    <span className="absolute h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                )}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative h-10 w-10"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 017 8a1 1 0 10-2 0 7.001 7.001 0 006 6.93V17H9a1 1 0 100 2h2a1 1 0 100-2v-2.07z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    );
};
