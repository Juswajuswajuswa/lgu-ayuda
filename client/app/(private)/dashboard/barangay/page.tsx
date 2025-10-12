import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "../staff/data-table";
import Link from "next/link";

export type Barangay = {
  id: string;
  name: string;
  municipality: string;
  province: string;
};

async function getData(): Promise<Barangay[]> {
  return [
    {
      id: "728ed52f",
      name: "Lower Bicutan",
      municipality: "Taguig",
      province: "Metro Manila",
    },
  ];
}

export default async function BarangayPage() {
  const data = await getData();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Barangay</CardTitle>
          <CardDescription>List of all barangay.</CardDescription>
          <CardAction>
            <Link
              href="/dashboard/barangay/create"
              className={buttonVariants({ variant: "default" })}
            >
              <PlusIcon />
              Add Barangay
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </>
  );
}
