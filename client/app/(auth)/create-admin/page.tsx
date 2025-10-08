"use client";

import CreateAdminPage from "@/components/sign-up";
import { useRequiredUser } from "@/hooks/useRequiredUser";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default function CreateAdmin() {
  const { user, isLoading } = useRequiredUser();

  if (user && !isLoading) {
    redirect("/dashboard");
  }

  const { data: isAdminExist, isPending } = useQuery({
    queryKey: ["isAdminExist"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/admin");
      return res.data.success;
    },
  });

  if (isAdminExist) {
    redirect("/");
  }

  return <div>{!isAdminExist && !isPending && <CreateAdminPage />}</div>;
}
