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
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ayudaFormSchema, type AyudaFormData } from "@/schema/forms/ayuda";
import { useAyuda } from "@/hooks/query/ayuda/useAyuda";
import { useUpdateAyudaMutation } from "@/hooks/query/ayuda/useUpdateAyudaMutation";
import { FormField } from "@/components/forms/common/FormField";
import { Controller } from "react-hook-form";
import { FormSelect } from "@/components/forms/common/FormSelect";
import { FormMultiSelect } from "@/components/forms/common/FormMultiSelect";
import { useGoods } from "@/hooks/query/goods/useGoods";
import { useEffect } from "react";

export default function EditAyudaPage() {
  const params = useParams();
  const { id } = params as { id: string };

  const { data: response, isPending: isLoadingAyuda } = useAyuda(id);
  const ayuda = response?.data;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AyudaFormData>({
    resolver: zodResolver(ayudaFormSchema),
    defaultValues: {
      name: ayuda?.name,
      budget: ayuda?.budget,
      description: ayuda?.description,
    },
  });

  const { mutate: updateAyuda, isPending } = useUpdateAyudaMutation(id);

  const onSubmit = (data: AyudaFormData) => {
    updateAyuda(data);
  };

  if (isLoadingAyuda) {
    return (
      <Card>
        <CardContent className="h-48 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading ayuda data...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-6">
          <Link
            href="/dashboard/ayuda"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Link>
          <CardTitle>Edit Ayuda</CardTitle>
        </div>
        <CardDescription>Edit a ayuda</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            label="Ayuda Name"
            placeholder="Akap Bata"
            error={errors.name}
            required
            {...register("name")}
          />

          <FormField
            label="Description"
            placeholder="This is a description"
            error={errors.description}
            {...register("description")}
          />

          <FormField
            label="Budget"
            placeholder="1000"
            min={1}
            type="number"
            error={errors.budget}
            {...register("budget", { valueAsNumber: true })}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Update Ayuda"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
