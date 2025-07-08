import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, AlertTriangle } from "lucide-react";

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
      <h2 className="text-xl font-semibold">Alerts</h2>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <Card
            key={alert.id}
            className={`bg-ghost-gray/50 border border-ghost-purple/30 ${alert.urgent ? "border-red-500/50" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {alert.type === "clone" ? (
                  <AlertTriangle
                    className={`h-4 w-4 mt-0.5 ${alert.urgent ? "text-red-500" : "text-ghost-neon"}`}/>
                ) : (
                  <TrendingUp className="h-4 w-4 mt-0.5 text-green-400" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-200">{alert.message}</p>
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
