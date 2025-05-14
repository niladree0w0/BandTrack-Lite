"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/icons/logo";
import { SidebarNav } from "./sidebar-nav";
import { Settings, UserCircle } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <ShellContent>{children}</ShellContent>
    </SidebarProvider>
  );
}

function ShellContent({ children }: { children: ReactNode }) {
  const { open, toggleSidebar } = useSidebar();

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
        </SidebarHeader>
        <Separator className="mb-2 group-data-[collapsible=icon]:hidden" />
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <Separator className="mt-auto group-data-[collapsible=icon]:hidden" />
        <SidebarFooter className="p-2">
           {/* Placeholder for user profile/settings */}
            <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
              <UserCircle className="h-5 w-5" />
              <span className="ml-2 group-data-[collapsible=icon]:hidden">Profile</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
              <Settings className="h-5 w-5" />
              <span className="ml-2 group-data-[collapsible=icon]:hidden">Settings</span>
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          {/* Placeholder for breadcrumbs or global actions */}
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
