
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import type { Metadata } from 'next';

// export const metadata: Metadata = { // Metadata cannot be used in client components directly
//   title: 'Settings',
// };


export default function SettingsPage() {
  const { logout, user } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Application Settings" 
        description="Manage application preferences and your session." 
      />
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Settings options will be available here in a future update.</p>
          {user && (
            <div>
              <h3 className="text-lg font-medium mb-2">Account</h3>
              <Button variant="outline" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <p className="text-xs text-muted-foreground mt-2">You are currently logged in as {user.username} ({user.role}).</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
