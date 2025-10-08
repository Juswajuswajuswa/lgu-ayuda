"use client";

import LoginPage from "@/components/login";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default function Login() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/authenticated-user");
      return res.data;
    },
  });

  console.log(user);

  if (user) {
    redirect("/dashboard");
  }

  return <LoginPage />;
}
