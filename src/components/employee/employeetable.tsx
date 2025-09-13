import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { getToken, useAuthRedirect } from "@/lib/auth";
import axios from "axios";
import { Card } from "../ui/card";

interface DailyTimesheet {
  workedHours: number;
  breakMinutes: number;
}

interface WeeklyTimesheet {
  days: Record<string, DailyTimesheet>;
  totalWorkedHours: number;
  totalBreakMinutes: number;
}

function formatTime(minutes: number) {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hrs}h ${mins}m`;
}

export default function WeeklyTimesheetTable() {
  const [timesheet, setTimesheet] = useState<WeeklyTimesheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useAuthRedirect();

  const fetchTimesheet = async () => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Dynamic startDate: Start of current week (Monday)
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Adjust to Monday
      const startDate = startOfWeek.toISOString().split('T')[0]; // YYYY-MM-DD format

      const response = await axios.get(`http://localhost:8080/api/attendance/weeklyReport?startDate=${startDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data: WeeklyTimesheet = response.data;
      setTimesheet(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheet();
    const interval = setInterval(fetchTimesheet, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!timesheet) {
    return <div>No data available</div>;
  }

  // Sort days in week order: Monday to Sunday
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const sortedDays = Object.keys(timesheet.days).sort(
    (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
  );

  return (
    <div className="h-full w-full px-12">
      <CardHeader className="pt-12 pb-6">
        <CardTitle>Weekly Timesheet</CardTitle>
        <CardDescription>Your weekly timesheet report</CardDescription>
      </CardHeader>
    <Table>
      <TableCaption>Your weekly timesheet report</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Metric</TableHead>
          {sortedDays.map((day) => (
            <TableHead key={day}>{day}</TableHead>
          ))}
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Worked Hours</TableCell>
          {sortedDays.map((day) => {
            const daily = timesheet.days[day];
            const workedMinutes = daily.workedHours * 60;
            return <TableCell key={day}>{formatTime(workedMinutes)}</TableCell>;
          })}
          <TableCell>{formatTime(timesheet.totalWorkedHours * 60)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Break Minutes</TableCell>
          {sortedDays.map((day) => {
            const daily = timesheet.days[day];
            return <TableCell key={day}>{formatTime(daily.breakMinutes)}</TableCell>;
          })}
          <TableCell>{formatTime(timesheet.totalBreakMinutes)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    </div>
  );
}