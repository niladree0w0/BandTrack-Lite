
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Profile',
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="User Profile" 
        description="Manage your profile information." 
      />
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Profile management features are coming soon.</p>
          {/* Placeholder for profile form or display */}
        </CardContent>
      </Card>
    </div>
  );
}
