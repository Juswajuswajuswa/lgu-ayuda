"use client";

import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Loader2, PlusIcon } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";
import { DataTable } from "../staff/data-table";
import useApplications from "@/hooks/query/application/useApplications";

export default function ApplicationsPage() {
  const { data: response, isPending, isError } = useApplications();

  const applications = response?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications</CardTitle>
        <CardDescription>
          Review and manage beneficiary applications.
        </CardDescription>
        <CardAction>
          <Link
            href="/dashboard/applications/create"
            className={buttonVariants({ variant: "default" })}
          >
            <PlusIcon />
            Create Application
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
            Error loading applications data.
          </div>
        ) : applications.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-muted-foreground">
            No applications found. Applications will appear here when
            beneficiaries apply for ayuda.
          </div>
        ) : (
          <DataTable columns={columns} data={applications} />
        )}
      </CardContent>
    </Card>
  );
}
