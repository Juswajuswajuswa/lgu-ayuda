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
import Link from "next/link";
import { columns } from "./columns";
import { DataTable } from "../staff/data-table";
import useDistributions from "@/hooks/query/distribution/useDistributions";

export default function DistributionsPage() {
  const { data: response, isPending, isError } = useDistributions();

  const distributions = response?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distributions</CardTitle>
        <CardDescription>
          Manage and track distribution of ayuda to beneficiaries.
        </CardDescription>
        <CardAction>
          <Link
            href="/dashboard/distributions/create"
            className={buttonVariants({ variant: "default" })}
          >
            <PlusIcon />
            Create Distribution
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
            Error loading distributions data.
          </div>
        ) : distributions.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-muted-foreground">
            No distributions found. Create your first distribution to get
            started.
          </div>
        ) : (
          <DataTable columns={columns} data={distributions} />
        )}
      </CardContent>
    </Card>
  );
}
