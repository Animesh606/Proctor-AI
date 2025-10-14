const OptionCard = ({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) => (
    <div className="bg-gray-700 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
        </label>
        {children}
    </div>
);

export default OptionCard;
