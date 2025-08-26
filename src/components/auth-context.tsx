"use client"; // This is a client component

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Define the shape of the context
interface AuthContextType {
  role: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, organizationName: string, phoneNumber: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to access the context easily
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // On mount, load from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { username: email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role); 
      setToken(data.token);
      setRole(data.role);
      router.push("/dashboard"); 
    } catch (err) {
      console.error("Login failed:", err);
      throw err; 
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    organizationName: string,
    phoneNumber: string,
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/admin/register",
        { firstName, lastName, email, organizationName, phoneNumber, password, confirmPassword },
        { headers: { "Content-Type": "application/json" } }
      );
      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      setToken(data.token);
      setRole(data.role);
      router.push("/organization"); // Redirect after update
    } catch (err) {
      console.error("Registration failed:", err);
      throw err; // Let the form handle errors
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    router.push("/login"); // Or wherever you want to redirect
  };

  return (
    <AuthContext.Provider value={{ role, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
