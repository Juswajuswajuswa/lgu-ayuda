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
import { goodsFormSchema, type GoodsFormData } from "@/schema/forms/goods";
import { useGood } from "@/hooks/query/goods/useGood";
import { useUpdateGoodsMutation } from "@/hooks/query/goods/useUpdateGoodsMutation";
import { FormField } from "@/components/forms/common/FormField";

export default function EditGoodsPage() {
  const params = useParams();
  const { id } = params as { id: string };

  const { data: response, isPending: isLoadingGoods } = useGood(id);
  const goods = response?.goods;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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

  const { mutate: updateGoods, isPending } = useUpdateGoodsMutation(id);

  // Update form when goods data loads
  useEffect(() => {
    if (goods) {
      reset({
        product: {
          name: goods.product.name || "",
          details: goods.product.details || "",
        },
        quantity: goods.quantity || 1,
      });
    }
  }, [goods, reset]);

  const onSubmit = (data: GoodsFormData) => {
    updateGoods(data);
  };

  if (isLoadingGoods) {
    return (
      <Card>
        <CardContent className="h-48 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading goods data...</span>
        </CardContent>
      </Card>
    );
  }

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
          <CardTitle>Edit Goods</CardTitle>
        </div>
        <CardDescription>Update goods information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

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
                Updating...
              </>
            ) : (
              "Update Goods"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
