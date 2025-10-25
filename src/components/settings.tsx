"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from "@/components/auth-context";
import { toast } from "sonner";

export function TabsDemo() {
  const { role, loading, token } = useAuth();
  const [organizationName, setOrganizationName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isAccountLoading, setIsAccountLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  if (loading) return <div>Loading page...</div>;
  if (!role) return <div>Redirecting...</div>;

  const handleAccountUpdate = async () => {
    setIsAccountLoading(true);
    try {
      // Only include fields that have values
      const updateData = {
        ...(organizationName && { organizationName }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phoneNumber && { phoneNumber }),
      };

      if (Object.keys(updateData).length === 0) {
        toast.error("Please fill in at least one field");
        return;
      }

      const endpoint = role === "ADMIN" ? "admin" : "employee";
      const response = await fetch(`http://localhost:8080/api/${endpoint}/update-details`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(updateData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          `Expected JSON, received ${response.status} ${response.statusText}: ${text.slice(0, 100)}...`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error ${response.status}`);
      }

      toast.success("Account details updated successfully");

      // Clear form after successful update
      if (role === "ADMIN") setOrganizationName("");
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update account details");
    } finally {
      setIsAccountLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setIsPasswordLoading(true);
    try {
      if (!newPassword || !confirmPassword) {
        throw new Error("Please fill in both password fields");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const endpoint = role === "ADMIN" ? "admin" : "employee";
      const response = await fetch(`http://localhost:8080/api/${endpoint}/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          newPassword,
          confirmPassword,
        }),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(typeof data === "string" ? data : data.message || `HTTP error ${response.status}`);
      }

      toast.success(typeof data === "string" ? data : "Password updated successfully");

      // Clear password fields
      setNewPassword("");
      setConfirmPassword("");

      // Optionally redirect to login page or trigger logout
      // Example: logout(); // Add your logout logic here
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return role === "ADMIN" ? (
    <div className="flex w-full max-w-2xl flex-col gap-6 p-4">
      <Tabs defaultValue="account" orientation="vertical" className="flex flex-col md:flex-row gap-4">
        <TabsList className="flex flex-row w-full md:w-48 bg-transparent gap-2">
          <TabsTrigger value="account" className="justify-start py-2 px-4 text-left w-full hover:bg-gray-100">
            Account
          </TabsTrigger>
          <TabsTrigger value="password" className="justify-start py-2 px-4 text-left w-full hover:bg-gray-100">
            Password
          </TabsTrigger>
        </TabsList>
        <div className="flex-1">
          <TabsContent value="account">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Update your personal details here. Click save when you're done.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="organization-name">Organization name</Label>
                  <Input
                    id="organization-name"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="Enter organization name"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    id="phone-number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAccountUpdate} disabled={isAccountLoading}>
                  {isAccountLoading ? "Saving..." : "Save changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handlePasswordUpdate} disabled={isPasswordLoading}>
                  {isPasswordLoading ? "Saving..." : "Save password"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  ) : (
    <div className="flex w-full max-w-2xl flex-col gap-6 p-4">
      <Tabs defaultValue="account" orientation="vertical" className="flex flex-col md:flex-row gap-4">
        <TabsList className="flex flex-row w-full md:w-48 bg-transparent gap-2">
          <TabsTrigger value="account" className="justify-start py-2 px-4 text-left w-full hover:bg-gray-100">
            Account
          </TabsTrigger>
          <TabsTrigger value="password" className="justify-start py-2 px-4 text-left w-full hover:bg-gray-100">
            Password
          </TabsTrigger>
        </TabsList>
        <div className="flex-1">
          <TabsContent value="account">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Update your personal details here. Click save when you're done.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    id="phone-number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAccountUpdate} disabled={isAccountLoading}>
                  {isAccountLoading ? "Saving..." : "Save changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handlePasswordUpdate} disabled={isPasswordLoading}>
                  {isPasswordLoading ? "Saving..." : "Save password"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}