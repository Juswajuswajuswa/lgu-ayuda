"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

export const useRequiredUser = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/authenticated");
      return res.data;
    },
  });

  return { user, isLoading };
};
