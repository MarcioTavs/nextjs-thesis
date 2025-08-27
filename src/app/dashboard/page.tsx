"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar"; // Uncomment and adjust if needed
import { useAuth } from "@/components/auth-context"; // Adjust path
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlay, Coffee, Square } from "lucide-react";
import axios from "axios";
import { toast } from "sonner"; // Import Sonner's toast for notifications

export default function Page() {
  const { role, loading, token } = useAuth(); // Include token from auth context
  const router = useRouter();

  // State to track attendance status
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // In seconds
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  console.log("User role in Dashboard:", role);

  useEffect(() => {
    if (!loading && !role) {
      router.push("/login");
    }
  }, [role, loading, router]);

  // Function to start the timer
  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  // Function to stop the timer
  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setElapsedTime(0);
  };

  // Format elapsed time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle clock in
  const handleClockIn = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/attendance/clockIn", // Adjust URL if needed
        {}, // No body for clockIn
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsClockedIn(true);
      startTimer();
      toast("Clocked In", {
        description: "Your work session has started.",
      });
    } catch (error: any) {
      toast("Error", {
        description: error.response?.data || "Failed to clock in.",
        className: "bg-destructive text-destructive-foreground", // Custom class for destructive variant
      });
    }
  };

  // Handle start break
  const handleStartBreak = async () => {
    if (!isClockedIn) {
      toast("Error", {
        description: "You must be clocked in to start a break.",
        className: "bg-destructive text-destructive-foreground",
      });
      return;
    }
    try {
      const response = await axios.post(
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
      // Pause timer during break if desired (backend handles break time deduction)
      toast("Break Started", {
        description: "Enjoy your break.",
      });
    } catch (error: any) {
      toast("Error", {
        description: error.response?.data || "Failed to start break.",
        className: "bg-destructive text-destructive-foreground",
      });
    }
  };

  // Handle end break
  const handleEndBreak = async () => {
    if (!isOnBreak) {
      toast("Error", {
        description: "No active break to end.",
        className: "bg-destructive text-destructive-foreground",
      });
      return;
    }
    try {
      const response = await axios.post(
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
      });
    } catch (error: any) {
      toast("Error", {
        description: error.response?.data || "Failed to end break.",
        className: "bg-destructive text-destructive-foreground",
      });
    }
  };

  // Handle clock out
  const handleClockOut = async () => {
    if (!isClockedIn) {
      toast("Error", {
        description: "You are not clocked in.",
        className: "bg-destructive text-destructive-foreground",
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
      setIsClockedIn(false);
      setIsOnBreak(false);
      stopTimer();
      toast("Clocked Out", {
        description: `Total time: ${formatTime(elapsedTime)}`,
      });
    } catch (error: any) {
      toast("Error", {
        description: error.response?.data || "Failed to clock out.",
        className: "bg-destructive text-destructive-foreground",
      });
    }
  };

  if (loading) {
    return <div>Loading page...</div>;
  }

  if (!role) {
    return <div>Redirecting...</div>;
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
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
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
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Clock buttons to log time in and out */}
          <div className="flex items-center gap-2 px-4"> 
            <Button onClick={handleClockIn} disabled={isClockedIn}>
              <CirclePlay />
            </Button>
            <Button onClick={isOnBreak ? handleEndBreak : handleStartBreak} disabled={!isClockedIn}>
              <Coffee />
            </Button>
            <Button onClick={handleClockOut} disabled={!isClockedIn}>
              <Square />
            </Button>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Display elapsed time */}
          {isClockedIn && (
            <div className="text-center p-2 bg-gray-100 rounded-md">
              Time worked: {formatTime(elapsedTime)}
            </div>
          )}
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-blue-600 aspect-video rounded-xl" />
            <div className="bg-blue-600 aspect-video rounded-xl" />
            <div className="bg-blue-600 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
