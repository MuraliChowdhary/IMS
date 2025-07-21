/*
File: src/Components/LoginForm.tsx
Description: A form for user login with API integration and state management.
*/
"use client";

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { IconLoader2 } from "@tabler/icons-react";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
//   const [isForgotOpen, setIsForgotOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        "https://ims-clxd.onrender.com/api/auth/login",
        { email, password }
      );

      if (response.status === 201) {
        toast.success(response.data.message || "Login successful!");
        
        // Store user data and token
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        const user = response.data.user;

        // Navigate to the appropriate dashboard based on user role
        // This will navigate to /manager, /customer, etc.
        navigate(`/${user.role.toLowerCase()}`);
      }
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Button 
                type="button" 
                variant="link" 
                // onClick={() => setIsForgotOpen(true)}
                className="ml-auto h-auto p-0 text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Button>
            </div>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>

      {/* <ForgotPasswordDialog 
        isOpen={isForgotOpen} 
        onClose={() => setIsForgotOpen(false)} 
      /> */}
    </>
  );
}
