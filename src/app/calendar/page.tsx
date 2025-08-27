"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar"; // Adjust if needed
import { useAuth } from "@/components/auth-context"; // Adjust path
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CalendarDemo } from "@/components/calendar";
import { Button } from "@/components/ui/button";
import { CirclePlay, Coffee, Square } from "lucide-react";

export default function Page() {
  const { role, loading } = useAuth(); // Includes loading from context
  const router = useRouter();

  console.log("User role in Calendar:", role);

  useEffect(() => {
    if (!loading && !role) { // Only redirect if loading is done and no role
      router.push("/login"); // Or "/register" if preferred
    }
  }, [role, loading, router]);

  if (loading) {
    return <div>Loading page...</div>; // Show loading while checking localStorage
  }

  if (!role) {
    return <div>Redirecting...</div>; // Brief message during redirect
  }

  return role === "ADMIN" ? (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/calendar">Calendar</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl">
              <CalendarDemo />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  ) : (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 justify-between transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/calendar">Calendar</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* clock buttons to log time in and out */}
          
          <div className="flex items-center gap-2 px-4"> {/* Buttons on the right */}
            <Button>
              <CirclePlay />
            </Button>
            <Button>
              <Coffee />
            </Button>
            <Button>
              <Square />
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-blue-600 aspect-video rounded-xl">
              <CalendarDemo />
            </div>
            <div className="bg-blue-600 aspect-video rounded-xl" />
            <div className="bg-blue-600 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
