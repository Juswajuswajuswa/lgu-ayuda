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
import { useGoods } from "@/hooks/query/goods/useGoods";

export default function GoodsPage() {
  const { data: response, isPending, isError } = useGoods();

  const goods = response?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goods</CardTitle>
        <CardDescription>List of all goods.</CardDescription>
        <CardAction>
          <Link
            href="/dashboard/goods/create"
            className={buttonVariants({ variant: "default" })}
          >
            <PlusIcon />
            Add Goods
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
            Error loading goods data.
          </div>
        ) : goods.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-muted-foreground">
            No goods found. Add your first item to get started.
          </div>
        ) : (
          <DataTable columns={columns} data={goods} />
        )}
      </CardContent>
    </Card>
  );
}
