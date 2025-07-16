import { Card, CardContent } from "packages/ui-components/src/components/card";
import { TrendingUp, AlertTriangle } from "lucide-react";

// React 19 compatibility wrappers
const AlertTriangleIcon = AlertTriangle as React.ElementType;
const TrendingUpIcon = TrendingUp as React.ElementType;

const alerts = [
	{
		id: 1,
		type: "sale",
		message: "New purchase: 'Advanced React Patterns' - $29.99",
		time: "2 minutes ago",
		urgent: false,
	},
	{
		id: 2,
		type: "clone",
		message: "Potential clone detected: 'TypeScript Best Practices'",
		time: "1 hour ago",
		urgent: true,
	},
	{
		id: 3,
		type: "sale",
		message: "New purchase: 'Node.js Security Guide' - $39.99",
		time: "3 hours ago",
		urgent: false,
	},
];

const Alerts = () => {
	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold text-white">Alerts</h2>
			<div className="space-y-3">
				{alerts.map((alert) => (
					<Card
						key={alert.id}
						className={`bg-ghost-dark/50 border ${
							alert.urgent ? "border-red-500/50" : "border-ghost-purple/30"
						} hover:shadow-md transition-shadow duration-300`}
					>
						<CardContent className="p-4">
							<div className="flex items-start gap-3">
								{alert.type === "clone" ? (
									<AlertTriangleIcon
										className={`h-4 w-4 mt-0.5 ${
											alert.urgent ? "text-red-500" : "text-ghost-neon"
										}`}
									/>
								) : (
									<TrendingUpIcon className="h-4 w-4 mt-0.5 text-green-400" />
								)}
								<div className="flex-1">
									<p className="text-sm text-white">{alert.message}</p>
									<p className="text-xs text-gray-400 mt-1">
										{alert.time}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};

export default Alerts;
