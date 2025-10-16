"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useBeneficiaries from "@/hooks/query/beneficiary/useBeneficiaries";
import useApplications from "@/hooks/query/application/useApplications";
import useDistributions from "@/hooks/query/distribution/useDistributions";

export function SectionCards() {
  const { data: beneficiariesResponse, isPending: isBeneficiariesLoading } =
    useBeneficiaries();
  const { data: applicationsResponse, isPending: isApplicationsLoading } =
    useApplications();
  const { data: distributionsResponse, isPending: isDistributionsLoading } =
    useDistributions();

  const beneficiaries = beneficiariesResponse?.beneficiaries || [];
  const applications = applicationsResponse?.data || [];
  const distributions = distributionsResponse?.data || [];

  // Calculate total budget spent from all distributions
  const totalBudgetSpent = distributions.reduce((sum, distribution) => {
    const amount = distribution.applicationId?.ayuda?.amount || 0;
    return sum + amount;
  }, 0);

  // Format currency for PHP
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isLoading =
    isBeneficiariesLoading || isApplicationsLoading || isDistributionsLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <div className="flex items-center justify-center h-16">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Beneficiaries</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {beneficiaries.length}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Registered beneficiaries <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total active beneficiaries in system
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Applications</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {applications.length}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              All Status
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Application submissions <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total applications received
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Budget Spent</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(totalBudgetSpent)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Distributed
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total amount distributed <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Budget spent across all distributions
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Distributions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {distributions.length}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              All Status
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Distribution records <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total distributions created
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
