"use client";

import CreateAdminPage from "@/components/sign-up";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default function CreateAdmin() {
  const { data: isAdminExist, isLoading } = useQuery({
    queryKey: ["isAdminExist"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/admin");
      return res.data.success;
    },
  });

  if (isAdminExist) {
    redirect("/");
  }

  return <div>{!isAdminExist && !isLoading && <CreateAdminPage />}</div>;
}
