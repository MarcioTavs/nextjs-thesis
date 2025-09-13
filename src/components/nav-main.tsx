"use client";

import {
  Album,
  Clock9,
  CalendarClock,
  Bell,
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  type LucideIcon,
  Building2,
  Folders,
} from "lucide-react";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useAuth } from "./auth-context";


export function NavMain() {

const { role } = useAuth();


  return (
    role === "ADMIN" ? (
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard" className="w-full">
              <SidebarMenuButton className="cursor-pointer w-full">
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>


            <SidebarMenuItem>
            <Link href="/department" className="w-full">
              <SidebarMenuButton className="cursor-pointer w-full">
                <Building2/>
                Department
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link href="/timesheet" className="w-full">
              <SidebarMenuButton className="cursor-pointer w-full">
                <Clock9 />
                Timesheet
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/report" className="w-full">
              <SidebarMenuButton className="cursor-pointer w-full">
                <Folders />
                Report
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link href="/calendar" className="w-full">
              <SidebarMenuButton className="cursor-pointer w-full">
                <CalendarDays />
                Calendar
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>


    ) : (
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard" className="w-full">
              <SidebarMenuButton className="cursor-pointer w-full">
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/timesheet" className="w-full">
              <SidebarMenuButton className="cursor-pointer w-full">
                <Clock9 />
                Timesheet
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/calendar" className="w-full">
              <SidebarMenuButton className="cursor-pointer w-full">
                <CalendarDays />
                Calendar
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    )
  );
}
