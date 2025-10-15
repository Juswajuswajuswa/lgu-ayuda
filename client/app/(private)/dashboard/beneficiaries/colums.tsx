"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVerticalIcon, PencilIcon, TrashIcon, EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Beneficiary } from "@/schema/api/beneficiary";

export const columns: ColumnDef<Beneficiary>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
    cell: ({ row }) => {
      const date = new Date(row.original.dob as string | Date);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.original.gender;
      return gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "-";
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "validId",
    header: "Valid ID",
    cell: ({ row }) => {
      const validId = row.original.validId;
      if (!validId) return "-";

      return (
        <Dialog>
          <div className="flex items-center gap-2">
            <img
              src={validId}
              alt="Valid ID"
              className="h-10 w-16 object-cover rounded border"
            />
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <EyeIcon className="w-4 h-4 mr-1" />
                View
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Valid ID - {row.original.fullName}</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center items-center p-4">
              <img
                src={validId}
                alt="Valid ID"
                className="max-w-full max-h-[80vh] object-contain rounded"
              />
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "barangay",
    header: "Barangay",
    cell: ({ row }) => {
      const barangay = row.original.address?.barangay;
      return typeof barangay === "object" &&
        barangay !== null &&
        "name" in barangay
        ? barangay.name || "-"
        : "-";
    },
  },
  {
    accessorKey: "municipality",
    header: "Municipality",
    cell: ({ row }) => {
      const barangay = row.original.address?.barangay;
      return typeof barangay === "object" &&
        barangay !== null &&
        "municipality" in barangay
        ? barangay.municipality || "-"
        : row.original.address?.municipality || "-";
    },
  },
  {
    accessorKey: "province",
    header: "Province",
    cell: ({ row }) => {
      const barangay = row.original.address?.barangay;
      return typeof barangay === "object" &&
        barangay !== null &&
        "province" in barangay
        ? barangay.province || "-"
        : row.original.address?.province || "-";
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVerticalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/dashboard/beneficiaries/edit/${row.original._id}`
                  )
                }
              >
                <PencilIcon className="w-4 h-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() =>
                  router.push(
                    `/dashboard/beneficiaries/delete/${row.original._id}`
                  )
                }
              >
                <TrashIcon className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
