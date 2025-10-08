"use client";

import LoginPage from "@/components/login";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default function Login() {
  return <LoginPage />;
}
