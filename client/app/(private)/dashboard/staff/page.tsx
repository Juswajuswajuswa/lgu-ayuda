import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { columns, Staff } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Staff[]> {
  return [
    {
      id: "728ed52f",
      name: "John Doe",
      role: "encoder",
      email: "john.doe@example.com",
    },
  ];
}

export default async function StaffPage() {
  const data = await getData();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Staff</CardTitle>
          <CardDescription>List of all staff members.</CardDescription>
          <CardAction>
            <Button>
              <PlusIcon />
              Add Staff
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </>
  );
}
