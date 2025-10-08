"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "./data.json";
import { useRequiredUser } from "@/hooks/useRequiredUser";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { user } = useRequiredUser();
  if (!user) {
    redirect("/login");
  }
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  );
}
