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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  barangayFormSchema,
  type BarangayFormData,
} from "@/schema/forms/barangay";
import { useBarangay } from "@/hooks/query/barangay/useBarangay";
import { useUpdateBarangayMutation } from "@/hooks/query/barangay/useUpdateBarangayMutation";
import { FormField } from "@/components/forms/common/FormField";

export default function EditBarangayPage() {
  const params = useParams();
  const { id } = params as { id: string };

  const { data: response, isPending: isLoadingBarangay } = useBarangay(id);
  const barangay = response?.data || response?.barangay;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BarangayFormData>({
    resolver: zodResolver(barangayFormSchema),
    defaultValues: {
      name: "",
      municipality: "",
      province: "",
    },
  });

  const { mutate: updateBarangay, isPending } = useUpdateBarangayMutation(id);

  // Update form when barangay data loads
  useEffect(() => {
    if (barangay) {
      reset({
        name: barangay.name || "",
        municipality: barangay.municipality || "",
        province: barangay.province || "",
      });
    }
  }, [barangay, reset]);

  const onSubmit = (data: BarangayFormData) => {
    updateBarangay(data);
  };

  if (isLoadingBarangay) {
    return (
      <Card>
        <CardContent className="h-48 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading barangay data...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-6">
          <Link
            href="/dashboard/barangay"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Link>
          <CardTitle>Edit Barangay</CardTitle>
        </div>
        <CardDescription>Update barangay information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Barangay Name"
              placeholder="Lower Bicutan"
              error={errors.name}
              required
              {...register("name")}
            />

            <FormField
              label="Municipality"
              placeholder="Taguig"
              error={errors.municipality}
              {...register("municipality")}
            />
          </div>

          <FormField
            label="Province"
            placeholder="Metro Manila"
            error={errors.province}
            {...register("province")}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Update Barangay"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
