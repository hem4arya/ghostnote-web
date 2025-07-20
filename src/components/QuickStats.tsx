import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/components/card";
import { DollarSign, FileText, Shield } from "lucide-react";

const QuickStats = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Quick Stats</h2>
      <Card className="bg-ghost-dark/50 border border-ghost-purple/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-ghost-neon" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$4,231.89</div>
          <p className="text-xs text-gray-400">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card className="bg-ghost-dark/50 border border-ghost-purple/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notes Published</CardTitle>
          <FileText className="h-4 w-4 text-ghost-neon" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12</div>
          <p className="text-xs text-gray-400">+180.1% from last month</p>
        </CardContent>
      </Card>
      <Card className="bg-ghost-dark/50 border border-ghost-purple/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clones Detected</CardTitle>
          <Shield className="h-4 w-4 text-ghost-neon" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+5</div>
          <p className="text-xs text-gray-400">+2 from last week</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
