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
import { PlusIcon } from "lucide-react";
import { columns, Staff } from "./columns";
import { DataTable } from "./data-table";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

async function getData(): Promise<Staff[]> {
  return [
    {
      id: "728ed52f",
      name: "John Doe",
      role: "encoder",
      email: "john.doe@example.com",
    },
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
          {/* <DataTable columns={columns} data={data} /> */}
        </CardContent>
      </Card>
    </>
  );
}
