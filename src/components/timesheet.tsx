import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth";

const token = getToken();

// Define interfaces
interface DailyTimesheetDTO {
  workedHours: number;
  breakMinutes: number;
}

interface WeeklyTimesheetDTO {
  days: {
    [key: string]: DailyTimesheetDTO;
  };
  totalWorkedHours: number;
  totalBreakMinutes: number;
}

interface EmployeeWeeklyTimesheetDTO {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  weeklyTimesheet: WeeklyTimesheetDTO;
}

export default function Timesheet() {
  const [timesheets, setTimesheets] = useState<EmployeeWeeklyTimesheetDTO[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/get-all-employees-weekly-timesheet?weekStart=2025-09-09", {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
      .then((response) => response.json())
      .then((data: EmployeeWeeklyTimesheetDTO[]) => setTimesheets(data))
      .catch((error) => console.error("Error fetching timesheets:", error));
  }, []);

  return (
    <Table>
      <TableCaption>Weekly Timesheet for Employees (Sep 9 - Sep 15, 2025)</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Name</TableHead>
          <TableHead>Monday</TableHead>
          <TableHead>Tuesday</TableHead>
          <TableHead>Wednesday</TableHead>
          <TableHead>Thursday</TableHead>
          <TableHead>Friday</TableHead>
          <TableHead>Saturday</TableHead>
          <TableHead>Sunday</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timesheets.map((timesheet) => (
          <TableRow key={timesheet.employeeId}>
            <TableCell className="font-medium">
              {`${timesheet.firstName} ${timesheet.lastName}`}
            </TableCell>
            <TableCell>{timesheet.weeklyTimesheet.days.Monday.workedHours}h</TableCell>
            <TableCell>{timesheet.weeklyTimesheet.days.Tuesday.workedHours}h</TableCell>
            <TableCell>{timesheet.weeklyTimesheet.days.Wednesday.workedHours}h</TableCell>
            <TableCell>{timesheet.weeklyTimesheet.days.Thursday.workedHours}h</TableCell>
            <TableCell>{timesheet.weeklyTimesheet.days.Friday.workedHours}h</TableCell>
            <TableCell>{timesheet.weeklyTimesheet.days.Saturday.workedHours}h</TableCell>
            <TableCell>{timesheet.weeklyTimesheet.days.Sunday.workedHours}h</TableCell>
            <TableCell className="text-right">{timesheet.weeklyTimesheet.totalWorkedHours}h</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={9} className="text-right">
            Total Worked Hours: {timesheets.reduce((sum, ts) => sum + ts.weeklyTimesheet.totalWorkedHours, 0)}h
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}