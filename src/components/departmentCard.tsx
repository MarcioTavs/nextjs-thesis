"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/components/auth-context";
import Image from "next/image"; // For optimized images

interface DepartmentData {
  organizationName?: string;
  departmentDTO?: {
    departmentId: string;
    departmentName: string;
  };
}

interface FullProfileData {
  organizationName?: string;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  employeeId?: string;
  project?: string;
  email?: string;
  departmentDTO?: {
    departmentId: string;
    departmentName: string;
  };
}

export default function DepartmentCard() {
  const { role, loading, token } = useAuth();
  const [data, setData] = useState<DepartmentData | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!role || loading) return;

    const fetchProfile = async () => {
      try {
        setFetchLoading(true);
        setError(null);
        const endpoint = role === "ADMIN" ? "admin" : "employee";
        const response = await fetch(`http://localhost:8080/api/${endpoint}/profile`, {
          method: "GET",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Expected JSON response");
        }

        const json: FullProfileData = await response.json();
        setData({
          organizationName: json.organizationName,
          departmentDTO: json.departmentDTO,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch department data");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProfile();
  }, [role, loading, token]);

  if (loading || fetchLoading) return <div>Loading department...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data || !role) return <div>No department data available.</div>;

  const isAdmin = role === "ADMIN";
  const title = isAdmin
    ? "Organization"
    : data.departmentDTO
    ? "Department"
    : "N/A";
  const detail = isAdmin
    ? "Let's make today count."
    : data.departmentDTO
    ? "Let's make today count."
    : "N/A";
  const subTitle = isAdmin
    ? data.organizationName || "N/A"
    : data.departmentDTO
    ? `ID: ${data.departmentDTO.departmentId}, ${data.departmentDTO.departmentName}`
    : "N/A";

  const adminImageSrc = "/webphoto.svg";
  const employeeImageSrc = "/coworkerphoto.svg";
  const imageSrc = isAdmin ? adminImageSrc : employeeImageSrc;

  return (
    <Card className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border-0 h-70">
      <CardHeader className="relative z-10 flex flex-row items-center justify-between h-full pb-0 gap-6">
        {/* Left side: Text content */}
        <div className="flex flex-col gap-2">
          <CardTitle className="text-3xl font-bold text-black-900">
            {title}
          </CardTitle>
          {subTitle && (
            <div className="text-lg font-bold text-orange-400">{subTitle}</div>
          )}
          <CardDescription className="text-lg text-black-900">
            {detail}
          </CardDescription>
        </div>

        {/* Right side: Image */}
        <div className="flex-shrink-0">
          <Image
            src={imageSrc}
            alt={`${isAdmin ? "Admin" : "Employee"} department illustration`}
            width={200}
            height={200}
            className="object-contain"
            priority
          />
        </div>
      </CardHeader>
    </Card>
  );
}