"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { format, subDays } from "date-fns";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useDistributions from "@/hooks/query/distribution/useDistributions";
import { Loader2 } from "lucide-react";

export const description = "Budget spent over time chart";

type Distribution = {
  applicationId?: { ayuda?: { amount?: number } };
  dateReleased?: string | number | Date;
  createdAt?: string | number | Date;
  _id?: string;
};

// Process distributions into time-based budget data
const processChartData = (distributions: Distribution[], timeRange: number) => {
  const endDate = new Date();
  const startDate = subDays(endDate, timeRange);

  console.log("Time range:", timeRange, "days");
  console.log("Start date:", startDate);
  console.log("End date:", endDate);

  // Create a map to store budget spent per date
  const budgetMap = new Map<string, number>();

  // Initialize all dates in range with 0
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = format(d, "yyyy-MM-dd");
    budgetMap.set(dateKey, 0);
  }

  // Sum budget spent for each date
  distributions.forEach((distribution) => {
    // Debug logging
    console.log("Processing distribution:", distribution);
    console.log("Distribution dateReleased:", distribution.dateReleased);
    console.log("Distribution createdAt:", distribution.createdAt);
    console.log(
      "Distribution amount:",
      distribution.applicationId?.ayuda?.amount
    );

    // Check if distribution has a valid dateReleased, fallback to createdAt
    const dateToUse = distribution.dateReleased || distribution.createdAt;
    console.log("Using date:", dateToUse);
    console.log("Date type:", typeof dateToUse);
    if (dateToUse) {
      // Handle Unix timestamp (in milliseconds)
      let releaseDate;
      if (typeof dateToUse === "number") {
        console.log("Processing as number timestamp:", dateToUse);
        // Check if timestamp is reasonable (not too far in future/past)
        const now = Date.now();
        const yearInMs = 365 * 24 * 60 * 60 * 1000;
        if (dateToUse > now + yearInMs || dateToUse < now - 10 * yearInMs) {
          console.warn(
            "Timestamp seems unreasonable:",
            dateToUse,
            "Current time:",
            now
          );
        }
        releaseDate = new Date(dateToUse);
        console.log("Date from number:", releaseDate);
      } else if (typeof dateToUse === "string") {
        // Try parsing as ISO string first, then as timestamp
        releaseDate = new Date(dateToUse);
        if (isNaN(releaseDate.getTime())) {
          // If string parsing fails, try as number
          const timestamp = parseInt(dateToUse);
          if (!isNaN(timestamp)) {
            releaseDate = new Date(timestamp);
          }
        }
      } else {
        releaseDate = new Date(dateToUse);
      }

      // Check if the date is valid
      console.log("Parsed releaseDate:", releaseDate);
      console.log("ReleaseDate timestamp:", releaseDate.getTime());
      console.log("Is valid date:", !isNaN(releaseDate.getTime()));

      if (!isNaN(releaseDate.getTime())) {
        const dateKey = format(releaseDate, "yyyy-MM-dd");
        console.log("Valid date, dateKey:", dateKey);

        // Only include dates within the time range
        if (releaseDate >= startDate && releaseDate <= endDate) {
          const currentAmount = budgetMap.get(dateKey) || 0;
          const distributionAmount =
            distribution.applicationId?.ayuda?.amount || 0;
          console.log(
            "Adding amount:",
            distributionAmount,
            "to date:",
            dateKey
          );
          budgetMap.set(dateKey, currentAmount + distributionAmount);
        } else {
          console.log(
            "Date outside range:",
            releaseDate,
            "not between",
            startDate,
            "and",
            endDate
          );
        }
      } else {
        console.warn("Invalid date for distribution:", dateToUse);
      }
    } else {
      console.log(
        "No dateReleased or createdAt for distribution:",
        distribution._id
      );
    }
  });

  // Convert map to array and sort by date
  return Array.from(budgetMap.entries())
    .map(([date, budgetSpent]) => ({ date, budgetSpent }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const chartConfig = {
  budgetSpent: {
    label: "Budget Spent",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  const { data: distributionsResponse, isPending } = useDistributions();

  const distributions = distributionsResponse?.data || [];

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Process data based on selected time range
  const getTimeRangeDays = (range: string) => {
    switch (range) {
      case "7d":
        return 7;
      case "30d":
        return 30;
      case "90d":
        return 90;
      default:
        return 90;
    }
  };

  const chartData = processChartData(
    distributions,
    getTimeRangeDays(timeRange)
  );

  // Debug logging
  console.log("Chart data:", chartData);
  console.log("Distributions:", distributions);

  // Format currency for tooltip
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isPending) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Budget Spent Over Time</CardTitle>
          <CardDescription>Loading budget data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if we have any data to display
  const hasData = chartData.some((item) => item.budgetSpent > 0);

  console.log("Has data:", hasData);
  console.log("Chart data length:", chartData.length);
  console.log("First few chart data items:", chartData.slice(0, 3));

  if (!hasData) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Budget Spent Over Time</CardTitle>
          <CardDescription>
            No budget data available for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No distributions found for the selected time range
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Budget Spent Over Time</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Daily budget spent for the selected period
          </span>
          <span className="@[540px]/card:hidden">Daily budget spent</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => value && setTimeRange(value)}
            className="hidden @[540px]/card:flex"
          >
            <ToggleGroupItem value="7d" aria-label="7 days">
              7d
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" aria-label="30 days">
              30d
            </ToggleGroupItem>
            <ToggleGroupItem value="90d" aria-label="90 days">
              90d
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[70px] @[540px]/card:hidden">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
              <SelectItem value="90d">90d</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return format(date, "MMM dd");
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              formatter={(value, name) => [
                formatCurrency(Number(value)),
                chartConfig[name as keyof typeof chartConfig]?.label || name,
              ]}
            />
            <Area
              dataKey="budgetSpent"
              type="natural"
              fill="var(--color-budgetSpent)"
              fillOpacity={0.4}
              stroke="var(--color-budgetSpent)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
