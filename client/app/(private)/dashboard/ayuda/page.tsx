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
import { useAyudas } from "@/hooks/query/ayuda/useAyudas";

export default function AyudaPage() {
  const { data: response, isPending, isError } = useAyudas();

  const ayudas = response?.data || [];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Ayuda</CardTitle>
          <CardDescription>List of all ayuda.</CardDescription>
          <CardAction>
            <Link
              href={"/dashboard/ayuda/create"}
              className={buttonVariants({ variant: "default" })}
            >
              <PlusIcon />
              Add Ayuda
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
              Error loading ayuda data.
            </div>
          ) : ayudas.length === 0 ? (
            <div className="h-24 flex items-center justify-center text-muted-foreground">
              No ayudas found. Add your first ayuda to get started.
            </div>
          ) : (
            <DataTable columns={columns} data={ayudas} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
