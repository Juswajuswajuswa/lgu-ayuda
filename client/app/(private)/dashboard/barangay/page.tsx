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
import { useBarangays } from "@/hooks/query/barangay/useBarangays";

export default function BarangayPage() {
  const { data: response, isPending, isError } = useBarangays();

  const barangays = response?.barangays || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Barangay</CardTitle>
        <CardDescription>List of all barangays.</CardDescription>
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
        ) : barangays.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-muted-foreground">
            No barangays found. Add your first barangay to get started.
          </div>
        ) : (
          <DataTable columns={columns} data={barangays} />
        )}
      </CardContent>
    </Card>
  );
}
