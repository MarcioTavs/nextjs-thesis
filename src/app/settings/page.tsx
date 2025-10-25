"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/components/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlay, Coffee, Square } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Tabs } from "@/components/ui/tabs";
import { TabsDemo } from "@/components/settings";

export default function Page() {
  const { role, loading, token } = useAuth();
  const router = useRouter();

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);

  useEffect(() => {
    if (!loading && !role) {
      router.push("/login");
    }
  }, [role, loading, router]);

  const fetchAttendanceStatus = async () => {
    if (loading || !role || !token) return;

    try {
      const response = await axios.get("http://localhost:8080/api/attendance/status", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const { isClockedIn, isOnBreak } = response.data;
      setIsClockedIn(isClockedIn);
      setIsOnBreak(isOnBreak);
    } catch (error) {
      console.error("Error fetching attendance status:", error);
      toast("Error", {
        description: "Failed to fetch attendance status.",
        className: "text-black",
      });
    }
  };

  useEffect(() => {
    fetchAttendanceStatus();
    const interval = setInterval(fetchAttendanceStatus, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [loading, role, token]);

  const handleClockIn = async () => {
    if (isClockedIn) {
      toast("Error", {
        description: "You have already clocked in.",
        className: "text-black",
      });
      return;
    }
    try {
      await axios.post(
        "http://localhost:8080/api/attendance/clockIn",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsClockedIn(true);
      toast("Clocked In", {
        description: "Have a nice work session",
        className: "text-black",
      });
      fetchAttendanceStatus();
    } catch (error: any) {
      toast("Error", {
        description: error.response?.data || "Failed to clock in.",
        className: "text-black",
      });
    }
  };

  const handleStartBreak = async () => {
    if (!isClockedIn) {
      toast("Error", {
        description: "You must be clocked in to start a break.",
        className: "text-black",
      });
      return;
    }
    try {
      await axios.post(
        "http://localhost:8080/api/attendance/startBreak",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsOnBreak(true);
      toast("Break Started", {
        description: "Enjoy your break.",
        className: "text-black",
      });
      fetchAttendanceStatus();
    } catch (error: any) {
      toast("Error", {
        description: error.response?.data || "Failed to start break.",
        className: "text-black",
      });
    }
  };

  const handleEndBreak = async () => {
    if (!isOnBreak) {
      toast("Error", {
        description: "No active break to end.",
        className: "text-black",
      });
      return;
    }
    try {
      await axios.post(
        "http://localhost:8080/api/attendance/endBreak",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsOnBreak(false);
      toast("Break Ended", {
        description: "Back to work!",
        className: "text-black",
      });
      fetchAttendanceStatus();
    } catch (error: any) {
      toast("Error", {
        description: error.response?.data || "Failed to end break.",
        className: "text-black",
      });
    }
  };

  const handleClockOut = async () => {
    if (!isClockedIn) {
      toast("Error", {
        description: "You are not clocked in.",
        className: "text-black",
      });
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/attendance/clockOut",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { breakInMinutes, workTimeInMinutes } = response.data;
      setIsClockedIn(false);
      setIsOnBreak(false);
      toast("Clocked Out", {
        description: `Work: ${workTimeInMinutes} minutes, Break: ${breakInMinutes} minutes`,
        className: "text-black",
      });
    } catch (error: any) {
      toast("Error", {
        description: error.response?.data || "Failed to clock out.",
        className: "text-black",
      });
    }
  };

  if (loading) return <div>Loading page...</div>;
  if (!role) return <div>Redirecting...</div>;

  return role === "ADMIN" ? (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
          <TabsDemo />
  
      </SidebarInset>
    </SidebarProvider>
  ) : (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 justify-between transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 px-4">
            {isOnBreak ? (
              <Button
                onClick={handleEndBreak}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <Coffee />
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleClockIn}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <CirclePlay />
                </Button>
                <Button
                  onClick={handleStartBreak}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  disabled={!isClockedIn}
                >
                  <Coffee />
                </Button>
                <Button
                  onClick={handleClockOut}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Square />
                </Button>
              </>
            )}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <TabsDemo />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}