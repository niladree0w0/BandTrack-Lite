
"use client"; 

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MetricCardProps } from "@/lib/definitions";
import { DollarSign, Package, Undo, Users, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/lib/permissions";

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
  const { user } = useAuth();

  if (!user || !hasPermission(user, 'viewDashboard')) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="Access Denied" 
          description="You do not have the required 'viewDashboard' permission." 
        />
        <Card className="shadow-md">
          <CardHeader className="items-center">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg font-semibold">Permission Required</p>
            <p className="text-sm text-muted-foreground">
              Please contact an administrator if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity to display yet.</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Performance Snapshot</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Performance chart coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
