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
import { useCreateAyudaMutation } from "@/hooks/query/ayuda/useCreateAyudaMutation";
import { ayudaFormSchema, type AyudaFormData } from "@/schema/forms/ayuda";
import { FormField } from "@/components/forms/common/FormField";
import { FormSelect } from "@/components/forms/common/FormSelect";
import { FormMultiSelect } from "@/components/forms/common/FormMultiSelect";
import { useGoods } from "@/hooks/query/goods/useGoods";
import useBarangays from "@/hooks/query/barangay/useBarangays";

export default function CreateAyudaPage() {
  const { data: goodsData } = useGoods();
  const { data: barangaysData } = useBarangays();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<AyudaFormData>({
    resolver: zodResolver(ayudaFormSchema),
    defaultValues: {
      name: "",
      type: "cash",
      budget: 0,
      description: "",
      amount: undefined,
      goods: [],
    },
  });

  const ayudaType = watch("type");

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

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Ayuda Type"
                name="type"
                value={field.value}
                onValueChange={field.onChange}
                options={[
                  { label: "Cash", value: "cash" },
                  { label: "Goods", value: "goods" },
                ]}
                placeholder="Select ayuda type"
                error={errors.type as any}
                required
              />
            )}
          />

          {ayudaType === "cash" && (
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <FormField
                  label="Amount"
                  placeholder="1000"
                  type="number"
                  min={1}
                  error={errors.amount}
                  required
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          )}

          {ayudaType === "goods" && (
            <Controller
              name="goods"
              control={control}
              render={({ field }) => (
                <FormMultiSelect
                  label="Select Goods"
                  name="goods"
                  options={
                    goodsData?.data?.map((good: any) => ({
                      label: good.product.name,
                      value: good._id,
                      description: `${good.product.details} - Qty: ${good.quantity}`,
                    })) || []
                  }
                  value={field.value || []}
                  onChange={field.onChange}
                  error={errors.goods as any}
                  maxSelections={5}
                  helperText="Select 1-5 goods for this ayuda"
                  required
                />
              )}
            />
          )}

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
