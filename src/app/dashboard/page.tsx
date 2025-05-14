import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MetricCardProps } from "@/lib/definitions";
import { DollarSign, Package, Undo, Users } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const metrics: MetricCardProps[] = [
  {
    title: "Total Dispatched",
    value: "1,250 units",
    icon: Package,
    description: "Across all subcontractors",
  },
  {
    title: "Total Returns",
    value: "1,180 units",
    icon: Undo,
    description: "95% return rate",
  },
  {
    title: "Subcontractor Payments",
    value: "$15,200",
    icon: DollarSign,
    description: "Paid this month",
  },
  {
    title: "Active Subcontractors",
    value: "3",
    icon: Users,
    description: "Currently working on projects",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Dashboard" 
        description="Overview of your operational metrics." 
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.description && (
                <p className="text-xs text-muted-foreground pt-1">
                  {metric.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
       {/* Placeholder for future charts or more detailed sections */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity to display yet.</p>
            {/* Placeholder for activity feed */}
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Performance Snapshot</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Performance chart coming soon.</p>
            {/* Placeholder for a chart */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
