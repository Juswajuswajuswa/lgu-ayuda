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
import { columns } from "./colums";
import { DataTable } from "../staff/data-table";
import Link from "next/link";
import useBeneficiaries from "@/hooks/query/beneficiary/useBeneficiaries";

export default function BeneficiariesPage() {
  const { data: response, isPending, isError } = useBeneficiaries();

  const beneficiaries = response?.beneficiaries || [];

  console.log(beneficiaries)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beneficiaries</CardTitle>
        <CardDescription>List of all beneficiaries.</CardDescription>
        <CardAction>
          <Link
            href="/dashboard/beneficiaries/create"
            className={buttonVariants({ variant: "default" })}
          >
            <PlusIcon />
            Add Beneficiary
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
            Error loading beneficiaries data.
          </div>
        ) : beneficiaries.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-muted-foreground">
            No beneficiaries found. Add your first beneficiary to get started.
          </div>
        ) : (
          <DataTable columns={columns} data={beneficiaries} />
        )}
      </CardContent>
    </Card>
  );
}
