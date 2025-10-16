"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "./staff/data-table";
import { SectionCards } from "@/components/section-cards";
import useDistributions from "@/hooks/query/distribution/useDistributions";
import { dashboardDistributionColumns } from "./distributions-table-columns";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: distributionsResponse, isPending } = useDistributions();
  const distributions = distributionsResponse?.data || [];

  // Get last 10 distributions
  const recentDistributions = distributions.slice(0, 10);

  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <div className="px-4 lg:px-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Distributions</h2>
        {isPending ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading recent distributions...</span>
          </div>
        ) : (
          <DataTable
            data={recentDistributions}
            columns={dashboardDistributionColumns}
          />
        )}
      </div>
    </>
  );
}
