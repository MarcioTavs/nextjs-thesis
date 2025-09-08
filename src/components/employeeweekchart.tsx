"use client"

import { useEffect, useState } from "react";
import { Bar, BarChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getToken, useAuthRedirect } from "@/lib/auth"; 

interface DailyTimesheet {
  workedHours: number;
  breakMinutes: number;
}

interface WeeklyTimesheet {
  days: Record<string, DailyTimesheet>;
  totalWorkedHours: number;
  totalBreakMinutes: number;
}

const chartConfig = {
  worked: {
    label: "Worked",
    color: "#4CAF50" ,
  },
  breakTime: {
    label: "Break",
    color: "#FFC107",
  },
} satisfies ChartConfig;

export default function WeeklyTimesheetChart() {
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

  // Prepare chart data with values in minutes
  const chartData = sortedDays.map((day) => {
    const daily = timesheet.days[day];
    return {
      day,
      worked: daily.workedHours * 60,
      breakTime: daily.breakMinutes,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Timesheet </CardTitle>
        <CardDescription>Worked and break time per day (in minutes).</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row gap-8">
        <ChartContainer className="max-h-96 w-full" config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <Bar
              dataKey="worked"
              stackId="a"
              fill="var(--color-worked)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="breakTime"
              stackId="a"
              fill="var(--color-breakTime)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
