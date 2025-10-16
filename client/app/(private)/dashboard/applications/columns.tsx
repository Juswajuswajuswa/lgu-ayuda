"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import type { Application } from "@/schema/api/application";
import useUpdateApplicationStatusMutation from "@/hooks/query/application/useUpdateApplicationStatusMutation";

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "beneficiary.fullName",
    header: "Full Name",
  },
  {
    accessorKey: "beneficiary.dob",
    header: "Date of Birth",
    cell: ({ row }) => {
      const date = new Date(row.original.beneficiary.dob as string | Date);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "beneficiary.gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.original.beneficiary.gender;
      return gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "-";
    },
  },
  {
    accessorKey: "beneficiary.phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "beneficiary.address.barangay.name",
    header: "Barangay",
    cell: ({ row }) => {
      const barangay = row.original.beneficiary.address?.barangay;
      return typeof barangay === "object" &&
        barangay !== null &&
        "name" in barangay
        ? barangay.name || "-"
        : "-";
    },
  },
  {
    accessorKey: "beneficiary.address.barangay.municipality",
    header: "Municipality",
    cell: ({ row }) => {
      const barangay = row.original.beneficiary.address?.barangay;
      return typeof barangay === "object" &&
        barangay !== null &&
        "municipality" in barangay
        ? barangay.municipality || "-"
        : row.original.beneficiary.address?.municipality || "-";
    },
  },
  {
    accessorKey: "beneficiary.address.barangay.province",
    header: "Province",
    cell: ({ row }) => {
      const barangay = row.original.beneficiary.address?.barangay;
      return typeof barangay === "object" &&
        barangay !== null &&
        "province" in barangay
        ? barangay.province || "-"
        : row.original.beneficiary.address?.province || "-";
    },
  },
  {
    accessorKey: "ayuda.name",
    header: "Ayuda",
    cell: ({ row }) => {
      return row.original.ayuda.name || "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant =
        status === "approved"
          ? "default"
          : status === "rejected"
          ? "destructive"
          : "secondary";

      return (
        <Badge variant={variant}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const mutation = useUpdateApplicationStatusMutation();
      const isPending = row.original.status === "pending";

      if (!isPending) {
        return (
          <span className="text-muted-foreground text-sm">
            No actions available
          </span>
        );
      }

      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() =>
              mutation.mutate({
                id: row.original._id,
                status: "approved",
              })
            }
            disabled={mutation.isPending}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              mutation.mutate({
                id: row.original._id,
                status: "rejected",
              })
            }
            disabled={mutation.isPending}
          >
            Reject
          </Button>
        </div>
      );
    },
  },
];
