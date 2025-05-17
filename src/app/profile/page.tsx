
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import type { Metadata } from 'next'; // Metadata cannot be used in client components directly

// export const metadata: Metadata = {
//   title: 'User Profile',
// };

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    // This page should ideally not be accessible if not logged in,
    // AppShell handles redirection, but this is a safeguard.
    return (
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="User Profile" 
          description="Please log in to view your profile." 
        />
         <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">You need to be logged in to view this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userInitial = user.username.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="User Profile" 
        description="View and manage your profile information." 
      />
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {/* Placeholder for actual image if available */}
              {/* <AvatarImage src="https://placehold.co/100x100.png" alt={user.username} /> */}
              <AvatarFallback className="text-xl">{userInitial}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              <CardDescription>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Username</h4>
              <p>{user.username}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">User ID</h4>
              <p>{user.id}</p>
            </div>
             <div>
              <h4 className="text-sm font-medium text-muted-foreground">Permissions</h4>
              <p className="text-sm text-muted-foreground">
                {user.role === 'admin' && 'Full access to all features, including user and permission management (to be implemented).'}
                {user.role === 'manager' && 'Access to operational features like dispatch, returns, and employee roster based on assigned permissions (permissions TBI).'}
                {user.role === 'proprietor' && 'Access to view dashboards and reports based on assigned permissions (permissions TBI).'}
              </p>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            More profile management features (like password change, etc.) are planned for future updates.
            The detailed permission system is yet to be implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
