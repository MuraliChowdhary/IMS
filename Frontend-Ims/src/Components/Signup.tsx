/*
File: src/Components/SignupForm.tsx
Description: A new form component for user registration.
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

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://ims-clxd.onrender.com/api/auth/register",
        formData
      );

      if (response.status === 201) {
        toast.success(response.data.message || "Registration successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const user = response.data.user;
        // Navigate to the appropriate dashboard based on user role
        navigate(`/${user.role.toLowerCase()}/dashboard`);
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
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to create your account
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Name</Label>
          <Input id="username" type="text" placeholder="John Doe" value={formData.username} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" value={formData.email} onChange={handleInputChange} required />
        </div>
         <div className="grid gap-2">
          <Label htmlFor="contact">Mobile</Label>
          <Input id="contact" type="tel" placeholder="9876543210" value={formData.contact} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={formData.password} onChange={handleInputChange} required />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign Up
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </form>
  );
}
