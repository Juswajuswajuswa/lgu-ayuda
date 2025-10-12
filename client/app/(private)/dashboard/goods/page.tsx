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

export default function GoodsPage() {
  const {
    data: goods,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["goods"],
    queryFn: async () => {
      const res = await axiosInstance.get("/goods/get-goods");
      return res.data.data;
    },
  });

  console.log(goods);
  return (
    <>
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
          ) : (
            <DataTable columns={columns} data={goods || []} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
