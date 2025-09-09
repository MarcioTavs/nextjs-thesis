"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/components/auth-context";
import axios from "axios";
import { useEffect, useState } from "react";

interface EmployeeAttendance {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  clockInTime: string | null;
  clockOutTime: string | null;
}

export default function ActiveEmployee() {
  const { token } = useAuth();
  const [employees, setEmployees] = useState<EmployeeAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/admin/get-loggedin-employees-today", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        // Ensure response.data is always treated as an array
        setEmployees(Array.isArray(response.data) ? response.data : [response.data]);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch employee data.");
        setLoading(false);
      }
    };

    if (token) {
      fetchEmployees();
    }
  }, [token]);

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return "Still Working";
    const date = new Date(dateTime);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return <div>Loading employees...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Table>
      <TableCaption>A list of today's logged-in employees.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Clock In</TableHead>
          <TableHead>Clock Out</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              No employees logged in today.
            </TableCell>
          </TableRow>
        ) : (
          employees.map((emp, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {emp.firstName} {emp.lastName}
              </TableCell>
              <TableCell>{formatDateTime(emp.clockInTime)}</TableCell>
              <TableCell>{formatDateTime(emp.clockOutTime)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
