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
import { columns, Ayuda } from "./columns";
import { DataTable } from "../staff/data-table";

async function getData(): Promise<Ayuda[]> {
  return [
    {
      id: "728ed52f",
      name: "John Doe",
      type: "cash",
      budget: 1000,
      barangay: "Barangay 1",
      description: "Description 1",
    },
  ];
}

export default async function AyudaPage() {
  const data = await getData();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Ayuda</CardTitle>
          <CardDescription>List of all ayuda.</CardDescription>
          <CardAction>
            <Button>
              <PlusIcon />
              Add Ayuda
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
