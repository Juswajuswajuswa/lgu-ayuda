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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  barangayFormSchema,
  type BarangayFormData,
} from "@/schema/forms/barangay";
import { useCreateBarangayMutation } from "@/hooks/query/barangay/useCreateBarangayMutation";
import { FormField } from "@/components/forms/common/FormField";

export default function CreateBarangayPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BarangayFormData>({
    resolver: zodResolver(barangayFormSchema),
    defaultValues: {
      name: "",
      municipality: "",
      province: "",
    },
  });

  const { mutate: createBarangay, isPending } = useCreateBarangayMutation();

  const onSubmit = (data: BarangayFormData) => {
    createBarangay(data);
  };

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
          <CardTitle>Create Barangay</CardTitle>
        </div>
        <CardDescription>Create a new barangay</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                Creating...
              </>
            ) : (
              "Create Barangay"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
