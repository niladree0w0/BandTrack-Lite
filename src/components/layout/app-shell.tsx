
"use client";

import type { ReactNode } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/icons/logo";
import { SidebarNav } from "./sidebar-nav";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // If done loading and no user, redirect to login, unless already on login page
      // This check helps prevent redirect loops if login page itself is wrapped by AppShell (it's not here)
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        router.replace("/login");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        {/* Simplified Skeleton Layout */}
        <div className="hidden md:flex flex-col w-64 border-r bg-muted/40 p-4 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full mt-auto" />
            <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
                <Skeleton className="h-8 w-8 md:hidden" /> 
                <Skeleton className="h-8 w-1/4 ml-auto" />
            </header>
            <main className="flex-1 overflow-auto p-4 sm:p-6">
                <Skeleton className="h-12 w-1/2 mb-4" />
                <Skeleton className="h-64 w-full" />
            </main>
        </div>
      </div>
    );
  }
  
  // If there's no user and we're not on the login page (though logic above should redirect),
  // prevent rendering the main app shell. This is a fallback.
  // The main redirection logic is now in useEffect.
  // If trying to access a protected route directly while not logged in, this also prevents flicker.
  if (!user && typeof window !== 'undefined' && window.location.pathname !== '/login') {
     return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Redirecting to login...</p>
        </div>
     ); // Or a loading spinner
  }
  
  // Only render the full AppShell if user is authenticated or if it's the login page itself being rendered
  // For this app, login page has its own minimal layout, so AppShell is only for authenticated routes.
  if (!user) {
    return <>{children}</>; // Allows login page to render without the shell
  }

  return (
    <SidebarProvider defaultOpen>
      <ShellContent>{children}</ShellContent>
    </SidebarProvider>
  );
}

function ShellContent({ children }: { children: ReactNode }) {
  const { open, toggleSidebar } = useSidebar(); // This hook is fine if SidebarProvider is a parent
  const { user } = useAuth(); // Get user info

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
                BandTrack Lite
              </span>
            </div>
             {user && (
                <div className="mt-1 group-data-[collapsible=icon]:hidden">
                    <span className="text-xs text-muted-foreground">
                        Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                </div>
            )}
        </SidebarHeader>
        <Separator className="mb-2 group-data-[collapsible=icon]:hidden" />
        <SidebarContent className="flex flex-col">
          <SidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          {/* Placeholder for breadcrumbs or global actions */}
          {user && <span className="ml-auto text-sm">Welcome, {user.username}!</span>}
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
