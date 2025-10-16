"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import type { Distribution } from "@/schema/api/distribution";
import useUpdateDistributionStatusMutation from "@/hooks/query/distribution/useUpdateDistributionStatusMutation";

export const columns: ColumnDef<Distribution>[] = [
  {
    accessorKey: "applicationId.beneficiary.fullName",
    header: "Beneficiary Name",
    cell: ({ row }) => {
      const beneficiary = row.original.applicationId?.beneficiary;
      return beneficiary?.fullName || "-";
    },
  },
  {
    accessorKey: "applicationId.ayuda.name",
    header: "Ayuda Program",
    cell: ({ row }) => {
      const ayuda = row.original.applicationId?.ayuda;
      return ayuda?.name || "-";
    },
  },
  {
    accessorKey: "distributionType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.distributionType;
      const variant = type === "cash" ? "default" : "secondary";
      return (
        <Badge variant={variant}>
          {type ? type.charAt(0).toUpperCase() + type.slice(1) : "-"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant =
        status === "claimed"
          ? "default"
          : status === "unclaimed"
          ? "destructive"
          : "secondary";

      return (
        <Badge variant={variant}>
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : "-"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "releasedBy",
    header: "Released By",
    cell: ({ row }) => {
      const releasedBy = row.original.releasedBy;
      if (!releasedBy) return "-";

      return (
        `${releasedBy.firstName || ""} ${releasedBy.lastName || ""}`.trim() ||
        "-"
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const mutation = useUpdateDistributionStatusMutation();
      const status = row.original.status;

      if (status === "claimed") {
        return (
          <span className="text-muted-foreground text-sm">
            No actions available
          </span>
        );
      }

      if (status === "unclaimed") {
        return (
          <Button
            size="sm"
            onClick={() =>
              mutation.mutate({ id: row.original._id, status: "claimed" })
            }
            disabled={mutation.isPending}
          >
            Claim
          </Button>
        );
      }

      // status === "pending"
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() =>
              mutation.mutate({ id: row.original._id, status: "claimed" })
            }
            disabled={mutation.isPending}
          >
            Mark as Claimed
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              mutation.mutate({ id: row.original._id, status: "unclaimed" })
            }
            disabled={mutation.isPending}
          >
            Mark as Unclaimed
          </Button>
        </div>
      );
    },
  },
];
