"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  applicationFormSchema,
  type ApplicationFormData,
} from "@/schema/forms/application";
import { FormSelect } from "@/components/forms/common/FormSelect";
import { FormTextarea } from "@/components/forms/common/FormTextarea";
import useCreateApplicationMutation from "@/hooks/query/application/useCreateApplicationMutation";
import useBeneficiaries from "@/hooks/query/beneficiary/useBeneficiaries";
import useAyudas from "@/hooks/query/ayuda/useAyudas";

export default function CreateApplicationPage() {
  const { data: beneficiariesResponse } = useBeneficiaries();
  const { data: ayudasResponse } = useAyudas();

  const beneficiaries = beneficiariesResponse?.beneficiaries || [];
  const ayudas = ayudasResponse?.data || [];

  console.log(beneficiaries);

  // Filter beneficiaries to only show those who haven't applied yet
  const availableBeneficiaries = beneficiaries.filter(
    (beneficiary) => !(beneficiary as any).isApplied
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      beneficiary: "",
      ayuda: "",
      notes: "",
    },
  });

  const { mutate: createApplication, isPending } =
    useCreateApplicationMutation();

  const onSubmit = (data: ApplicationFormData) => {
    createApplication(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="space-y-6">
          <Link
            href="/dashboard/applications"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Link>
          <CardTitle>Create Application</CardTitle>
        </div>
        <CardDescription>
          Create a new application for a beneficiary to apply for ayuda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="beneficiary"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Beneficiary"
                name="beneficiary"
                value={field.value}
                onValueChange={field.onChange}
                options={availableBeneficiaries.map((beneficiary) => ({
                  label: beneficiary.fullName,
                  value: beneficiary._id,
                }))}
                placeholder="Please select a beneficiary"
                error={errors.beneficiary as any}
                helperText={
                  availableBeneficiaries.length === 0
                    ? "No beneficiaries available (all have already applied)"
                    : "Select a beneficiary who hasn't applied yet"
                }
                required
                disabled={availableBeneficiaries.length === 0}
              />
            )}
          />

          <Controller
            name="ayuda"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Ayuda Program"
                name="ayuda"
                value={field.value}
                onValueChange={field.onChange}
                options={ayudas.map((ayuda) => ({
                  label: ayuda.name,
                  value: ayuda._id,
                }))}
                placeholder="Please select an ayuda program"
                error={errors.ayuda as any}
                helperText="Select the ayuda program this beneficiary is applying for"
                required
                disabled={ayudas.length === 0}
              />
            )}
          />

          <FormTextarea
            label="Notes"
            placeholder="Optional notes about this application..."
            error={errors.notes}
            helperText="Add any additional notes or comments about this application"
            {...register("notes")}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating Application...
              </>
            ) : (
              "Create Application"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
