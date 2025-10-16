"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import type { Distribution } from "@/schema/api/distribution";

export const dashboardDistributionColumns: ColumnDef<Distribution>[] = [
  {
    accessorKey: "applicationId.beneficiary.fullName",
    header: "Beneficiary",
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
];
