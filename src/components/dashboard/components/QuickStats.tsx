import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/components/card";
import { DollarSign, FileText, Shield } from "lucide-react";

const QuickStats = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Quick Stats</h2>
      <Card className="bg-background-secondary border-border text-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$4,231.89</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card className="bg-background-secondary border-border text-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notes Published</CardTitle>
          <FileText className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12</div>
          <p className="text-xs text-muted-foreground">+180.1% from last month</p>
        </CardContent>
      </Card>
      <Card className="bg-background-secondary border-border text-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clones Detected</CardTitle>
          <Shield className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+5</div>
          <p className="text-xs text-muted-foreground">+2 from last week</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
