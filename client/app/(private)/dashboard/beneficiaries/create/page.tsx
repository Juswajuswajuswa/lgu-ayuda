"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  beneficiaryFormSchema,
  type BeneficiaryFormData,
} from "@/schema/forms/beneficiary";
import { FormField } from "@/components/forms/common/FormField";
import { FormDatePicker } from "@/components/forms/common/FormDatePicker";
import { FormRadioGroup } from "@/components/forms/common/FormRadioGroup";
import { FormFileUpload } from "@/components/forms/common/FormFileUpload";
import { FormSelect } from "@/components/forms/common/FormSelect";
import useCreateBeneficiaryMutation from "@/hooks/query/beneficiary/useCreateBeneficiaryMutation";
import useBarangays from "@/hooks/query/barangay/useBarangays";

export default function CreateBeneficiaryPage() {
  const { data: barangays } = useBarangays();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<BeneficiaryFormData>({
    resolver: zodResolver(beneficiaryFormSchema),
    defaultValues: {
      fullName: "",
      dob: undefined,
      gender: "male",
      phoneNumber: "",
      validId: undefined,
      status: "unclaimed",
      address: {
        municipality: "",
        province: "",
        barangay: "",
      },
    },
  });

  const { mutate: createBeneficiary, isPending } =
    useCreateBeneficiaryMutation();

  const onSubmit = (data: BeneficiaryFormData) => {
    createBeneficiary(data);
  };

  const handleBarangayChange = (barangayId: string) => {
    const selectedBarangay = barangays?.barangays?.find(
      (b: any) => b._id === barangayId
    );

    if (selectedBarangay) {
      setValue("address.municipality", selectedBarangay.municipality || "");
      setValue("address.province", selectedBarangay.province || "");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="space-y-6">
          <Link
            href="/dashboard/beneficiaries"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Link>
          <CardTitle>Create Beneficiary</CardTitle>
        </div>
        <CardDescription>Create a new beneficiary</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            label="Full Name"
            placeholder="John Doe"
            error={errors.fullName}
            required
            {...register("fullName")}
          />

          <Controller
            name="dob"
            control={control}
            render={({ field }) => (
              <FormDatePicker
                label="Date of Birth"
                value={field.value}
                onChange={field.onChange}
                error={errors.dob}
                placeholder="Select date of birth"
                required
              />
            )}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <FormRadioGroup
                label="Gender"
                value={field.value}
                onChange={field.onChange}
                error={errors.gender}
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
                required
              />
            )}
          />

          <FormField
            label="Phone Number"
            placeholder="09123456789"
            error={errors.phoneNumber}
            {...register("phoneNumber")}
          />

          <Controller
            name="validId"
            control={control}
            render={({ field }) => (
              <FormFileUpload
                label="Valid ID"
                value={field.value}
                onChange={field.onChange}
                error={errors.validId as any}
                accept="image/*,.pdf"
                helperText="Upload a valid government-issued ID (max 5MB)"
                required
              />
            )}
          />

          <Controller
            name="address.barangay"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Barangay"
                name="address.barangay"
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleBarangayChange(value);
                }}
                options={
                  barangays?.barangays?.map((barangay: any) => ({
                    label: barangay.name,
                    value: barangay._id,
                  })) || []
                }
                placeholder="Please select a barangay"
                error={errors.address?.barangay as any}
                required
              />
            )}
          />

          <FormField
            label="Municipality"
            placeholder="Auto-populated from barangay"
            error={errors.address?.municipality}
            {...register("address.municipality")}
            disabled
          />

          <FormField
            label="Province"
            placeholder="Auto-populated from barangay"
            error={errors.address?.province}
            {...register("address.province")}
            disabled
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              "Create Beneficiary"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
