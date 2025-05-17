
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
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Get reactive pathname

  useEffect(() => {
    // Only redirect if NOT loading, no user, AND not already on the login page.
    if (!isLoading && !user && pathname !== "/login") {
      router.replace("/login");
    }
  }, [user, isLoading, router, pathname]); // Added pathname to dependency array

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
  
  // If user is not authenticated
  if (!user) {
    if (pathname === "/login") {
      // If on the login page, render children (LoginPage) without the main app shell
      return <>{children}</>;
    } else {
      // If not on the login page, useEffect will redirect. Show a loading indicator.
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      );
    }
  }
  
  // If we reach here, user is authenticated and not loading
  // Render the full AppShell for authenticated users.
  return (
    <SidebarProvider defaultOpen>
      <ShellContent>{children}</ShellContent>
    </SidebarProvider>
  );
}

function ShellContent({ children }: { children: ReactNode }) {
  const { open, toggleSidebar } = useSidebar(); 
  const { user } = useAuth(); 

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
          {user && <span className="ml-auto text-sm">Welcome, {user.username}!</span>}
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
