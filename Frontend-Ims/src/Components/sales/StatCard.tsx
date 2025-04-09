interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
  sinceText: string;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  sinceText,
}: StatCardProps) {
  const isPositive = !change.startsWith("-");
  const changeColor = isPositive ? "text-green-600" : "text-red-600";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-600 font-medium">{title}</h3>
        <span className="text-gray-500">{icon}</span>
      </div>
      <div className="flex items-baseline">
        <h2 className="text-3xl font-bold">{value}</h2>
        <span className={`ml-2 ${changeColor} text-xs`}>
          {change} {sinceText}
        </span>
      </div>
    </div>
  );
}

export default StatCard;
