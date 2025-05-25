export default function DashboardPage() {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
            <p className="text-gray-600 dark:text-gray-300">
            Welcome to your dashboard overview. Here you can see all your important statistics and metrics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="font-medium">Metric {item}</h3>
                <p className="text-2xl font-bold">1,234</p>
                </div>
            ))}
            </div>
        </div>
        )
    }
