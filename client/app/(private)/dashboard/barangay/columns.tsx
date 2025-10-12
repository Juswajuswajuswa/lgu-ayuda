"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Link, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Barangay = {
  _id: string;
  name: string;
  municipality: string;
  province: string;
};

export const columns: ColumnDef<Barangay>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "municipality",
    header: "Municipality",
  },
  {
    accessorKey: "province",
    header: "Province",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVerticalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/barangay/edit/${row.original._id}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" asChild>
                <Link
                  href={`/dashboard/barangay/delete/${row.original._id}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
