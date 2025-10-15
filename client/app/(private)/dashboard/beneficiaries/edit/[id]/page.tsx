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
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  beneficiaryEditFormSchema,
  type BeneficiaryEditFormData,
} from "@/schema/forms/beneficiary";
import { useBeneficiary } from "@/hooks/query/beneficiary/useBeneficiary";
import { useUpdateBeneficiaryMutation } from "@/hooks/query/beneficiary/useUpdateBeneficiaryMutation";
import { FormField } from "@/components/forms/common/FormField";
import { FormDatePicker } from "@/components/forms/common/FormDatePicker";
import { FormRadioGroup } from "@/components/forms/common/FormRadioGroup";
import { FormSelect } from "@/components/forms/common/FormSelect";
import useBarangays from "@/hooks/query/barangay/useBarangays";

export default function EditBeneficiaryPage() {
  const params = useParams();
  const { id } = params as { id: string };

  const { data: response, isPending: isLoadingBeneficiary } =
    useBeneficiary(id);
  const beneficiary = response?.data || response?.beneficiary;

  const { data: barangays } = useBarangays();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BeneficiaryEditFormData>({
    resolver: zodResolver(beneficiaryEditFormSchema),
    defaultValues: {
      fullName: "",
      dob: undefined,
      gender: "male",
      phoneNumber: "",
      address: {
        municipality: "",
        province: "",
        barangay: "",
      },
    },
  });

  const { mutate: updateBeneficiary, isPending } =
    useUpdateBeneficiaryMutation(id);

  // Update form when beneficiary data loads
  useEffect(() => {
    if (beneficiary) {
      const barangayObj =
        typeof beneficiary.address?.barangay === "object"
          ? beneficiary.address.barangay
          : null;

      const barangayId = (barangayObj?._id ||
        beneficiary.address?.barangay ||
        "") as string;

      reset({
        fullName: beneficiary.fullName || "",
        dob: beneficiary.dob
          ? new Date(beneficiary.dob as string | Date)
          : undefined,
        gender: beneficiary.gender || "male",
        phoneNumber: beneficiary.phoneNumber || "",
        address: {
          municipality:
            barangayObj?.municipality ||
            beneficiary.address?.municipality ||
            "",
          province:
            barangayObj?.province || beneficiary.address?.province || "",
          barangay: barangayId || "",
        },
      });
    }
  }, [beneficiary, reset]);

  const handleBarangayChange = (barangayId: string) => {
    const selectedBarangay = barangays?.barangays?.find(
      (b: any) => b._id === barangayId
    );

    if (selectedBarangay) {
      setValue("address.municipality", selectedBarangay.municipality || "");
      setValue("address.province", selectedBarangay.province || "");
    }
  };

  const onSubmit = (data: BeneficiaryEditFormData) => {
    updateBeneficiary(data);
  };

  if (isLoadingBeneficiary) {
    return (
      <Card>
        <CardContent className="h-48 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading beneficiary data...</span>
        </CardContent>
      </Card>
    );
  }

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
          <CardTitle>Edit Beneficiary</CardTitle>
        </div>
        <CardDescription>
          Update beneficiary information (Valid ID cannot be changed)
        </CardDescription>
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
                Updating...
              </>
            ) : (
              "Update Beneficiary"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
