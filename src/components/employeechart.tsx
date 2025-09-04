"use client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  workTime: { label: "Work Time", color: "#4CAF50" },
  breakTime: { label: "Break Time", color: "#FFC107" },
  overtimeTime: { label: "Overtime", color: "#F44336" },
} satisfies ChartConfig;

// ---- Add this function ----
function formatTime(minutes: number) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
}

export default function EmployeeChart({
  data,
}: {
  data: { month: string; workTime: number; breakTime: number; overtimeTime?: number }[];
}) {
  const workedMinutes = data[0]?.workTime ?? 0;
  const breakMinutes = data[0]?.breakTime ?? 0;
  const overtimeMinutes = data[0]?.overtimeTime ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Horas Registradas</CardTitle>
        <CardDescription className="text-xs">Hoje</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row gap-8">
        {/* Left Info Panel */}
        <div className="min-w-[180px] flex flex-col gap-4 pt-2">
          {/* Worked hours */}
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-[#4CAF50]" />
              <span className="font-medium text-muted-foreground">Worked hours</span>
            </div>
            <span className="font-semibold text-[#4CAF50] text-sm pl-4">{formatTime(workedMinutes)}</span>
          </div>
          {/* Break */}
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-[#FFC107]" />
              <span className="font-medium text-muted-foreground">Break</span>
            </div>
            <span className="font-semibold text-[#FFC107] text-sm pl-4">{formatTime(breakMinutes)}</span>
          </div>
          {/* Overtime */}
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-[#F44336]" />
              <span className="font-medium text-muted-foreground">Overtime</span>
            </div>
            <span className="font-semibold text-[#F44336] text-sm pl-4">{formatTime(overtimeMinutes)}</span>
          </div>
        </div>
        {/* Bar Chart Panel */}
        <div className="flex-1">
          <ChartContainer className="max-h-96 w-full" config={chartConfig}>
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis 
              dataKey="month" 
              tickLine={false} 
              tickMargin={10} 
              axisLine={false} />

              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar 
              dataKey="workTime" 
              stackId="a" fill="#4CAF50" 
              radius={[0, 0, 4, 4]} />
              <Bar dataKey="breakTime" 
              stackId="a" fill="#FFC107" 
              radius={[4, 4, 0, 0]} />
              
              {/* Optionally show overtime as a separate bar or stack */}
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-xs">
        <div className="text-muted-foreground leading-none">
          Showing total recorded hours for today
        </div>
      </CardFooter>
    </Card>
  );
}
