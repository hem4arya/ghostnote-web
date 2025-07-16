import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import React from "react";

// React 19 compatible icon wrappers
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";

// React 19 compatibility wrappers
const AlertTriangleIcon = AlertTriangle as React.ElementType;
const CheckCircleIcon = CheckCircle as React.ElementType;
const InfoIcon = Info as React.ElementType;
const XIcon = X as React.ElementType;

interface Alert {
  id: string;
  type: "warning" | "success" | "info" | "error";
  title: string;
  message: string;
  timestamp: string;
}

const sampleAlerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    title: "Content Review Required",
    message: 'Your note "Advanced JavaScript Concepts" is pending review.',
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "success",
    title: "Payment Received",
    message: 'You received $15.99 for "React Best Practices".',
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    type: "info",
    title: "New Feature Available",
    message: "Check out our new search enhancement features.",
    timestamp: "1 day ago",
  },
];

const getAlertIcon = (type: Alert["type"]) => {
  switch (type) {
    case "warning":
    case "error":
      return AlertTriangleIcon;
    case "success":
      return CheckCircleIcon;
    case "info":
    default:
      return InfoIcon;
  }
};

const getAlertColor = (type: Alert["type"]) => {
  switch (type) {
    case "warning":
      return "text-orange-500";
    case "error":
      return "text-red-500";
    case "success":
      return "text-green-500";
    case "info":
    default:
      return "text-blue-500";
  }
};

const Alerts: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sampleAlerts.map((alert) => {
              const IconComponent = getAlertIcon(alert.type);
              const colorClass = getAlertColor(alert.type);

              return (
                <div
                  key={alert.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg"
                >
                  <IconComponent className={`h-5 w-5 ${colorClass} mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {alert.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.timestamp}
                    </p>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
            {sampleAlerts.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No alerts at this time.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;
