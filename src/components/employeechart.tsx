// "use client"

// import { Bar, BarChart, XAxis } from "recharts"
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"

// const chartData = [
//   { date: "2025-09-03", worked: 58 * 60 + 50, break: 50, overtime: 33 * 60 + 20 },
// ]

// const chartConfig = {
//   worked: {
//     label: "Horas Trabajadas",
//     color: "hsl(141, 71%, 48%)",
//   },
//   break: {
//     label: "Pausas",
//     color: "hsl(48, 100%, 67%)",
//   },
//   overtime: {
//     label: "Horas Extras",
//     color: "hsl(0, 72%, 51%)",
//   },
// } satisfies ChartConfig

// export default function EmployeeChart() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Horas Registradas</CardTitle>
//         <CardDescription>Resumen diario de horas.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <BarChart data={chartData}>
//             <XAxis
//               dataKey="date"
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//               tickFormatter={(value) => new Date(value).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
//             />
//             <Bar dataKey="worked" fill="var(--color-worked)" radius={[0, 0, 4, 4]} />
//             <Bar dataKey="break" fill="var(--color-break)" radius={[4, 4, 0, 0]} />
//             <Bar dataKey="overtime" fill="var(--color-overtime)" radius={[0, 0, 4, 4]} />
//             <ChartTooltip content={<ChartTooltipContent indicator="line" />} cursor={false} />
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   )
// }