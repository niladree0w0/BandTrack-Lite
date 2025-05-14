
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Application Settings" 
        description="Configure application preferences." 
      />
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Settings options will be available here in a future update.</p>
          {/* Placeholder for settings options */}
        </CardContent>
      </Card>
    </div>
  );
}
