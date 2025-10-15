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
import { useUsers } from "@/hooks/query/users/useUsers";

export default function StaffPage() {
  const { data: response, isPending, isError } = useUsers();

  const users = response?.users || [];

  return (
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
        {isPending ? (
          <div className="h-24 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </div>
        ) : isError ? (
          <div className="h-24 flex items-center justify-center text-destructive">
            Error loading staff data.
          </div>
        ) : users.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-muted-foreground">
            No staff members found. Add your first staff member to get started.
          </div>
        ) : (
          <DataTable columns={columns} data={users} />
        )}
      </CardContent>
    </Card>
  );
}
