"use client";

import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Loader2, PlusIcon } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "../staff/data-table";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export default function BarangayPage() {
  const {
    data: barangays,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["barangays"],
    queryFn: async () => {
      const res = await axiosInstance.get("/barangay/get-barangays");
      return res.data;
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Barangay</CardTitle>
          <CardDescription>List of all barangay.</CardDescription>
          <CardAction>
            <Link
              href="/dashboard/barangay/create"
              className={buttonVariants({ variant: "default" })}
            >
              <PlusIcon />
              Add Barangay
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="h-24 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading...</span>
            </div>
          ) : isError ? (
            <div className="h-24 flex items-center justify-center text-destructive">
              Error loading barangay data.
            </div>
          ) : (
            <DataTable columns={columns} data={barangays.barangays || []} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
