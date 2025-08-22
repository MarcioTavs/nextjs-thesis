"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  if (!firstName || !lastName || !email || !organizationName || !phoneNumber || !password || !confirmPassword) {
    setError("All fields are required.");
    return;
  }
  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }
  setLoading(true);
  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/admin/register",
      {
        firstName,
        lastName,
        email,
        organizationName,
        phoneNumber,
        password,
        confirmPassword,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = response.data;
    localStorage.setItem("token", data.token); // Store JWT for API auth
    localStorage.setItem("role", data.role);      // Store role for admin checks
    router.push("/organization");                 // Redirect to organization page
  } catch (err: any) {
    // Handle errors
    let errorMessage = "An unexpected error occurred.";
    if (err.response) {
      const data = err.response.data;
      if (typeof data === "string") {
        if (data.includes("Email already exists")) {
          errorMessage = "An account with this email already exists.";
        } else if (data.includes("Password and confirm password must match")) {
          errorMessage = "Passwords do not match.";
        } else {
          errorMessage = data || "Registration failed.";
        }
      } else {
        errorMessage = "Registration failed.";
      }
    }
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className={cn("flex flex-col gap-6 w-full md:w-96", className)}
      {...props}
    >
      <Card>
        <Image
          src="/logo.png"
          alt="Logo"
          width={124}
          height={124}
          className="mx-auto mb-4"
        />
      
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2 mb-5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {loading ? "Please wait" : "Register as Admin"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs">
        By clicking continue, you agree to our{" "}
        {/* <a href="https://ztrackmap.com/terms-and-conditions/" target="_blank">
          Terms of Service
        </a>{" "} */}
        and{" "}
        {/* <a
          href="../../public/adatkezelesi-hozzajarulas.pdf"
          download
          target="_blank"
          rel="noopener noreferrer"
        > */}
          Privacy Policy
        {/* </a> */}
        .
      </div>
    </div>
  );
}