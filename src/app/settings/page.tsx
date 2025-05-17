
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, ShieldAlert } from "lucide-react";
import { hasPermission } from "@/lib/permissions";
// import type { Metadata } from 'next'; // Metadata cannot be used in client components directly

// export const metadata: Metadata = {
//   title: 'Settings',
// };


export default function SettingsPage() {
  const { logout, user } = useAuth();

  if (!user || !hasPermission(user, 'manageSettings')) {
     return (
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="Access Denied" 
          description="You do not have permission to access settings." 
        />
         <Card className="shadow-md">
          <CardHeader className="items-center">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </CardHeader>
          <CardContent className="text-center">
             <p className="text-lg font-semibold">Permission Required</p>
             <p className="text-sm text-muted-foreground">
                Please contact an administrator if you believe this is an error or if you are not logged in.
             </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <p className="text-sm text-muted-foreground">
            Settings options will be available here in a future update.
            Admins will eventually be able to manage roles and permissions here.
          </p>
          {user && ( // Should always be true if manageSettings permission is met, but good for safety
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
