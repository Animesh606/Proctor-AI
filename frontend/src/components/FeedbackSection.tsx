const FeedbackSection = ({
    title,
    items,
    colorClass,
}: {
    title: string;
    items: string[];
    colorClass: string;
}) => {
    return (
        <div>
            <h2 className={`text-2xl font-semibold mb-4 ${colorClass}`}>
                {title}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
                {items && items.length > 0 ? (
                    items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))
                ) : (
                    <li>No feedback available</li>
                )}
            </ul>
        </div>
    );
};

export default FeedbackSection;
