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
import { MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Barangay = {
  id: string;
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
              <DropdownMenuItem>
                {" "}
                <PencilIcon className="w-4 h-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
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
