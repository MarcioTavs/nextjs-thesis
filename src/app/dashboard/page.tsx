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
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/components/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlay, Coffee, Square, TimerOff } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import EmployeeChart from "@/components/employee/employeechart";
import ProfileCard from "@/components/profileCard";
import DepartmentCard from "@/components/departmentCard";
import ActiveEmployee from "@/components/admin/activeEmp";
import EmployeeStatus from "@/components/admin/employeeStatus";


export default function Page() {
  const { role, loading, token } = useAuth();
  const router = useRouter();

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [workTimeInMinutes, setWorkTimeInMinutes] = useState(0);
  const [breakInMinutes, setBreakInMinutes] = useState(0);
  const [chartData, setChartData] = useState([{ month: "Today", workTime: 0, breakTime: 0 }]);

  useEffect(() => {
    if (!loading && !role) {
      router.push("/login"); // Redirect to login if not authenticated
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
      const { isClockedIn, isOnBreak, workTimeInMinutes, breakInMinutes } = response.data;
      setIsClockedIn(isClockedIn);
      setIsOnBreak(isOnBreak);
      setWorkTimeInMinutes(workTimeInMinutes || 0);
      setBreakInMinutes(breakInMinutes || 0);
      setChartData([{ month: "Today", workTime: workTimeInMinutes, breakTime: breakInMinutes }]);
      console.log(`Fetched status at ${new Date().toLocaleTimeString()}: workTimeInMinutes=${workTimeInMinutes}, breakInMinutes=${breakInMinutes}`);
    } catch (error) {
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

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  const handleClockIn = async () => {
    if (isClockedIn) {
      toast("Error", {
        description: "You have already clocked in.",
        className: "text-black",
      });
      return;
    }
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
      setWorkTimeInMinutes(0);
      setBreakInMinutes(0);
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
      const { totalHours, breakInMinutes, workTimeInMinutes } = response.data;
      console.log("Clock-out response:", response.data);
      setIsClockedIn(false);
      setIsOnBreak(false);
      setWorkTimeInMinutes(workTimeInMinutes);
      setBreakInMinutes(breakInMinutes);
      toast("Clocked Out", {
        description: `Total time: ${formatTime(Math.round(totalHours * 60))} (Break: ${breakInMinutes} minutes)`,
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
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <ProfileCard />
            <DepartmentCard />
            {/* <div className="bg-muted/50 aspect-video rounded-xl" /> */}
          </div>
           <EmployeeStatus />
          
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
        // disabled={!isClockedIn}
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
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <ProfileCard />
            <DepartmentCard />
            {/* <div className="bg-muted/50 aspect-video rounded-xl" /> */}

          </div>
          <EmployeeChart data={chartData} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
