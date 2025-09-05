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
import { getToken, useAuthRedirect } from "@/lib/auth"; // Adjust the import path based on your project structure

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
  const mins = Math.round(minutes % 60); // Round to nearest whole minute
  return `${hrs}h ${mins}m`;
}

export default function WeeklyTimesheetTable() {
  const [timesheet, setTimesheet] = useState<WeeklyTimesheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useAuthRedirect();

  useEffect(() => {
    const fetchTimesheet = async () => {
      try {
        const token = getToken();

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("http://localhost:8080/api/attendance/weeklyReport?startDate=2025-09-04", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch weekly report");
        }

        const data: WeeklyTimesheet = await response.json();
        setTimesheet(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTimesheet();
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
    <Table>
      <TableCaption>Your weekly timesheet report</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Day</TableHead>
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
  );
}
