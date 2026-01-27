"use client";

import { useState } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", formData);
      if (res.status === 200) {
        // Token Save
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        toast.success(`Welcome back, ${res.data.user.name}!`);

        // Role Based Redirect 🔀
        const role = res.data.user.role;
        if (role === "ADMIN") {
          window.location.href = "/dashboard/admin";
        } else if (role === "SELLER") {
          window.location.href = "/dashboard/seller";
        } else {
          window.location.href = "/dashboard/customer";
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid Email or Password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          New here? <Link href="/register" className="text-blue-500">Create Account</Link>
        </p>
      </div>
    </div>
  );
}