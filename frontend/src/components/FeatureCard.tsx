export const FeatureCard = ({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="flex justify-center mb-4 text-indigo-400">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <div className="text-gray-400">{children}</div>
        </div>
    );
};
