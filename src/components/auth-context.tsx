"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface AuthContextType {
  role: string | null;
  token: string | null;
  loading: boolean; // New loading state
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, organizationName: string, phoneNumber: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Start as true (loading)
  const router = useRouter();

  // Load from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }
    setLoading(false); // Loading complete after check
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
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
    
      throw err; 
    } finally {
      setLoading(false);
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
    setLoading(true);
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
      router.push("/organization");
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ role, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
