"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Loader2, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  distributionFormSchema,
  type DistributionFormData,
} from "@/schema/forms/distribution";
import { FormSelect } from "@/components/forms/common/FormSelect";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import useCreateDistributionMutation from "@/hooks/query/distribution/useCreateDistributionMutation";
import useApplications from "@/hooks/query/application/useApplications";
import useDistributions from "@/hooks/query/distribution/useDistributions";

export default function CreateDistributionPage() {
  const { data: applicationsResponse } = useApplications();
  const { data: distributionsResponse } = useDistributions();

  const applications = applicationsResponse?.data || [];
  const distributions = distributionsResponse?.data || [];

  // Get application IDs that already have distributions
  const distributedApplicationIds = distributions.map(
    (distribution) =>
      distribution.applicationId._id || distribution.applicationId
  );

  // Filter applications to only show approved ones that don't have distributions yet
  const approvedApplications = applications.filter(
    (application) =>
      application.status === "approved" &&
      !distributedApplicationIds.includes(application._id)
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<DistributionFormData>({
    resolver: zodResolver(distributionFormSchema),
    defaultValues: {
      applicationId: "",
      dateReleased: new Date(), // Default to today
    },
    mode: "onChange", // Enable real-time validation
  });

  const selectedApplicationId = watch("applicationId");
  const selectedApplication = approvedApplications.find(
    (app) => app._id === selectedApplicationId
  );

  const { mutate: createDistribution, isPending } =
    useCreateDistributionMutation();

  const onSubmit = (data: DistributionFormData) => {
    if (!selectedApplication) {
      return;
    }

    // Ensure dateReleased is a valid Date object
    const releaseDate =
      data.dateReleased instanceof Date ? data.dateReleased : new Date();

    createDistribution({
      applicationId: data.applicationId,
      ayudaId: selectedApplication.ayuda._id,
      status: "pending", // Always pending
      dateReleased: releaseDate.toISOString(),
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="space-y-6">
          <Link
            href="/dashboard/distributions"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Link>
          <CardTitle>Create Distribution</CardTitle>
        </div>
        <CardDescription>
          Create a new distribution for an approved application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="applicationId"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Approved Application"
                name="applicationId"
                value={field.value}
                onValueChange={field.onChange}
                options={approvedApplications.map((application) => ({
                  label: `${application.beneficiary.fullName} - ${application.ayuda.name}`,
                  value: application._id,
                }))}
                placeholder="Please select an approved application"
                error={errors.applicationId as any}
                helperText={
                  approvedApplications.length === 0
                    ? "No approved applications available for distribution"
                    : "Select an approved application that hasn't been distributed yet"
                }
                required
                disabled={approvedApplications.length === 0}
              />
            )}
          />

          {selectedApplication && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-medium">Application Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Beneficiary:</span>
                  <p className="font-medium">
                    {selectedApplication.beneficiary.fullName}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-medium">
                    {selectedApplication.beneficiary.phoneNumber}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ayuda Program:</span>
                  <p className="font-medium">
                    {selectedApplication.ayuda.name}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium capitalize">
                    {(selectedApplication.ayuda as any).type}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Controller
            name="dateReleased"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="dateReleased" className="block text-sm">
                  Date Released <span className="text-destructive ml-1">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value instanceof Date &&
                      !isNaN(field.value.getTime())
                        ? format(field.value, "PPP")
                        : "Pick a date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value &&
                        field.value instanceof Date &&
                        !isNaN(field.value.getTime())
                          ? field.value
                          : undefined
                      }
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0); // Set to start of today
                        return date < today;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateReleased && (
                  <p className="text-sm text-destructive">
                    {errors.dateReleased.message}
                  </p>
                )}
              </div>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating Distribution...
              </>
            ) : (
              "Create Distribution"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
