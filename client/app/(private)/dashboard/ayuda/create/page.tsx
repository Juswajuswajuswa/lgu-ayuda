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
import { useCreateAyudaMutation } from "@/hooks/query/ayuda/useCreateAyudaMutation";
import { ayudaFormSchema, type AyudaFormData } from "@/schema/forms/ayuda";
import { FormField } from "@/components/forms/common/FormField";

export default function CreateAyudaPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AyudaFormData>({
    resolver: zodResolver(ayudaFormSchema),
    defaultValues: {
      name: "",
      type: "cash",
      budget: 0,
      barangay: "",
      description: "",
      amount: 0,
      goods: [],
    },
  });

  const { mutate: createAyuda, isPending } = useCreateAyudaMutation();

  const onSubmit = (data: AyudaFormData) => {
    createAyuda(data);
  };

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
          <CardTitle>Create Ayuda</CardTitle>
        </div>
        <CardDescription>Create a new ayuda</CardDescription>
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
            label="Ayuda Type"
            placeholder="Cash"
            error={errors.type}
            {...register("type")}
          />

          <FormField
            label="Amount"
            placeholder="1000"
            type="number"
            min={1}
            error={errors.amount}
            {...register("amount")}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              "Create Ayuda"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
