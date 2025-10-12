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
import { DataTable } from "./data-table";
import Link from "next/link";
<<<<<<< HEAD
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
=======
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
>>>>>>> 8c1449c63ed0650a2483e4da0391ef25936fbf8b

export default function StaffPage() {
  const {
    data: staffs,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/user/get-staffs");
      return res.data;
    },
<<<<<<< HEAD
  });
=======
  ];
}

export default function StaffPage() {
  // const data = await getData();

  const { data: staffs } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/user/get-users`);
      return res.data;
    },
  });

  console.log(staffs);
>>>>>>> 8c1449c63ed0650a2483e4da0391ef25936fbf8b

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Staff</CardTitle>
          <CardDescription>List of all staff members.</CardDescription>
          <CardAction>
            <Link
              href="/dashboard/staff/create"
              className={buttonVariants({ variant: "default" })}
            >
              <PlusIcon />
              Add Staff
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
<<<<<<< HEAD
          {isPending ? (
            <div className="h-24 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading...</span>
            </div>
          ) : isError ? (
            <div className="h-24 flex items-center justify-center text-destructive">
              Error loading staff data.
            </div>
          ) : (
            <DataTable columns={columns} data={staffs.users || []} />
          )}
=======
          {/* <DataTable columns={columns} data={data} /> */}
>>>>>>> 8c1449c63ed0650a2483e4da0391ef25936fbf8b
        </CardContent>
      </Card>
    </>
  );
}
