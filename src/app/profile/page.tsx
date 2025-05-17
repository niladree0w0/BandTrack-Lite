
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShieldAlert } from "lucide-react";
import { hasPermission } from "@/lib/permissions";

// export const metadata: Metadata = { // Metadata cannot be used in client components directly
//   title: 'User Profile',
// };

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user || !hasPermission(user, 'viewProfile')) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="Access Denied" 
          description="You do not have permission to view this page." 
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
              <h4 className="text-sm font-medium text-muted-foreground">Username (Email)</h4>
              <p>{user.username}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">User ID</h4>
              <p>{user.id}</p>
            </div>
             <div>
              <h4 className="text-sm font-medium text-muted-foreground">Assigned Role</h4>
              <p>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Effective Permissions</h4>
              {user.permissions.length > 0 ? (
                <ul className="list-disc list-inside text-sm">
                  {user.permissions.map(p => <li key={p}>{p}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No specific permissions assigned.</p>
              )}
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            More profile management features (like password change, etc.) are planned for future updates.
            The detailed permission system is managed via Firestore roles.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
