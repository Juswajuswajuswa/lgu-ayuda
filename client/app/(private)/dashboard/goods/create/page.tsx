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
import { goodsFormSchema, type GoodsFormData } from "@/schema/forms/goods";
import { useCreateGoodsMutation } from "@/hooks/query/goods/useCreateGoodsMutation";
import { FormField } from "@/components/forms/common/FormField";

export default function CreateGoodsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoodsFormData>({
    resolver: zodResolver(goodsFormSchema),
    defaultValues: {
      product: {
        name: "",
        details: "",
      },
      quantity: 1,
    },
  });

  const { mutate: createGoods, isPending } = useCreateGoodsMutation();

  const onSubmit = (data: GoodsFormData) => {
    createGoods(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="space-y-6">
          <Link
            href="/dashboard/goods"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Link>
          <CardTitle>Create Goods</CardTitle>
        </div>
        <CardDescription>Create a new goods item</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            label="Product Name"
            placeholder="Rice"
            error={errors.product?.name}
            required
            {...register("product.name")}
          />

          <FormField
            label="Product Details"
            placeholder="100kg"
            error={errors.product?.details}
            required
            {...register("product.details")}
          />

          <FormField
            label="Product Quantity"
            type="number"
            placeholder="100"
            min={1}
            error={errors.quantity}
            required
            {...register("quantity", { valueAsNumber: true })}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              "Create Goods"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
