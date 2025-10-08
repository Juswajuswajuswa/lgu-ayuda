"use client";

import LoginPage from "@/components/login";
import { useRequiredUser } from "@/hooks/useRequiredUser";
import { redirect } from "next/navigation";

export default function Login() {
  const { user, isLoading } = useRequiredUser();

  if (!user) {
    return <div>{!isLoading && <LoginPage />}</div>;
  }

  redirect("/dashboard");
}
