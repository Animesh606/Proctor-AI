const ScoreCircle = ({ score, label }: { score: number; label: string }) => {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="relative w-32 h-32 rounded-full flex items-center justify-center bg-gray-700 border-4 border-indigo-500">
                <p className="text-4xl font-bold text-white">
                    {score}
                    <span className="text-xl text-gray-400">/10</span>
                </p>
            </div>
            <p className="mt-3 text-lg font-semibold">{label}</p>
        </div>
    );
};

export default ScoreCircle;
