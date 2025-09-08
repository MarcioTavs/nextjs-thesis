"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/components/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDemo } from "@/components/calendar";
import { Button } from "@/components/ui/button";
import { CirclePlay, Coffee, Square, TimerOff } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function Page() {
  const { role, loading, token } = useAuth();
  const router = useRouter();

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!loading && !role) {
      router.push("/login");
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval); // Cleanup on unmount
    };
  }, [role, loading, router, timerInterval]);

  // Fetch attendance status on page load 
  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      if (loading || !role || !token) return;

      try {
        const response = await axios.get("http://localhost:8080/api/attendance/status", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const { isClockedIn, isOnBreak, elapsedTime } = response.data;
        setIsClockedIn(isClockedIn);
        setIsOnBreak(isOnBreak);
        setElapsedTime(elapsedTime || 0); // Use backend elapsedTime or 0
        console.log("Attendance status:", response.data);

        if (isClockedIn && !isOnBreak) {
          startTimer();
        }
      } catch (error) {
        console.error("Error fetching attendance status:", error);
        toast("Error", {
          description: "Failed to fetch attendance status.",
          className: "bg-destructive text-destructive-foreground",
        });
      }
    };

    fetchAttendanceStatus();
  }, [loading, role, token]);

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    console.log("Timer started at:", new Date());
    const interval = setInterval(() => {
      if (isClockedIn && !isOnBreak) {
        setElapsedTime((prev) => {
          const newTime = prev + 1;
          console.log("Elapsed time:", newTime, "Formatted:", formatTime(newTime));
          return newTime;
        });
      }
    }, 1000);
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    console.log("Timer stopped at:", new Date(), "Elapsed time:", elapsedTime);
    setElapsedTime(0);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClockIn = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/attendance/clockIn",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Clock-in response:", response.data);
      setIsClockedIn(true);
      setElapsedTime(0); // Reset timer
      startTimer();
      toast("Clocked In", {
        description: "Have a nice work session",
      });
    } catch (error: any) {
      //console.error("Clock-in error:", error.response?.data || error.message);
      toast("Error", {
        description: error.response?.data || "Failed to clock in.",
        className: "bg-destructive text-destructive-foreground",
      });
    }
  };

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
      console.log("Start break response:", response.data);
      setIsOnBreak(true);
      if (timerInterval) clearInterval(timerInterval);
      setTimerInterval(null);
      toast("Break Started", {
        description: "Enjoy your break.",
      });
    } catch (error: any) {
      console.error("Start break error:", error.response?.data);
      toast("Error", {
        description: error.response?.data || "Failed to start break.",
        className: "bg-destructive text-destructive-foreground",
      });
    }
  };

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
      console.log("End break response:", response.data);
      setIsOnBreak(false);
      startTimer();
      toast("Break Ended", {
        description: "Back to work!",
      });
    } catch (error: any) {
      console.error("End break error:", error.response?.data);
      toast("Error", {
        description: error.response?.data || "Failed to end break.",
        className: "bg-destructive text-destructive-foreground",
      });
    }
  };

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
      const { totalHours, breakInMinutes } = response.data;
      console.log("Clock-out response:", response.data);
      setIsClockedIn(false);
      setIsOnBreak(false);
      stopTimer();
      toast("Clocked Out", {
        description: `Total time: ${formatTime(Math.round(totalHours * 3600))} (Break: ${breakInMinutes} minutes)`,
      });
    } catch (error: any) {
      console.error("Clock-out error:", error.response?.data);
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
                  <BreadcrumbLink href="/calendar">
                    Calendar
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 px-4">
  {isOnBreak ? (
    // Only show End Break button when on break
    <Button
      onClick={handleEndBreak}
      className="bg-yellow-500 hover:bg-yellow-600 text-white"
    >
      <TimerOff />
    </Button>
  ) : (
    <>
      {/* Only show Start Break, Clock In, Clock Out when NOT on break */}
      <Button onClick={handleClockIn} className="bg-green-500 hover:bg-green-600 text-white">
        <CirclePlay />
      </Button>
      <Button
        onClick={handleStartBreak}
        className="bg-yellow-500 hover:bg-yellow-600 text-white"
        disabled={!isClockedIn}
      >
        <Coffee />
      </Button>
      <Button onClick={handleClockOut} className="bg-red-500 hover:bg-red-600 text-white">
        <Square />
      </Button>
    </>
  )}
</div>

        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* {isClockedIn && (
            <div className="text-center p-2 bg-gray-100 rounded-md">
              Time worked: {formatTime(elapsedTime)} {isOnBreak && "(On Break)"}
            </div>
          )} */}
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