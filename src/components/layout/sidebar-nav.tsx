
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
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import type { Permission } from "@/lib/definitions"; // Import Permission type
import { hasPermission } from "@/lib/permissions"; // Import hasPermission

export type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  exactMatch?: boolean;
  requiredPermission?: Permission; // Add required permission
};

export const allMainNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exactMatch: true, requiredPermission: "viewDashboard" },
  { href: "/dispatch", label: "Dispatch Manager", icon: Truck, requiredPermission: "manageDispatch" },
  { href: "/returns", label: "Return Logger", icon: ArchiveRestore, requiredPermission: "manageReturns" },
  { href: "/employees", label: "Employee Roster", icon: Users, requiredPermission: "viewEmployees" },
];

export const allSecondaryNavItems: NavItem[] = [
  { href: "/profile", label: "Profile", icon: UserCircle, requiredPermission: "viewProfile" },
  { href: "/settings", label: "Settings", icon: Settings, requiredPermission: "manageSettings" },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth(); // Get the user from AuthContext

  const filteredMainNavItems = allMainNavItems.filter(item => 
    !item.requiredPermission || (user && hasPermission(user, item.requiredPermission))
  );

  const filteredSecondaryNavItems = allSecondaryNavItems.filter(item =>
    !item.requiredPermission || (user && hasPermission(user, item.requiredPermission))
  );

  return (
    <>
      <SidebarMenu>
        {filteredMainNavItems.map((item) => (
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
        {filteredSecondaryNavItems.map((item) => (
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
