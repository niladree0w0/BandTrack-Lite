
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  ArchiveRestore,
  Users,
  Settings,
  UserCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  exactMatch?: boolean;
};

export const mainNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exactMatch: true },
  { href: "/dispatch", label: "Dispatch Manager", icon: Truck },
  { href: "/returns", label: "Return Logger", icon: ArchiveRestore },
  { href: "/employees", label: "Employee Roster", icon: Users },
];

export const secondaryNavItems: NavItem[] = [
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarMenu>
        {mainNavItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={item.exactMatch ? pathname === item.href : pathname.startsWith(item.href)}
                className="w-full justify-start"
                tooltip={{ children: item.label, className: "capitalize" }}
              >
                <a>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      {/* You can add a separator here if desired */}
      <SidebarMenu className="mt-auto"> 
        {secondaryNavItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={item.exactMatch ? pathname === item.href : pathname.startsWith(item.href)}
                className="w-full justify-start"
                tooltip={{ children: item.label, className: "capitalize" }}
              >
                <a>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
}
