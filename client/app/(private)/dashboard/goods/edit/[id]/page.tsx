"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
export default function EditBarangayPage() {
  const params = useParams();
  const { id } = params;

  const {
    data: goods,
    isPending: isGoodsPending,
    isError: isGoodsError,
  } = useQuery({
    queryKey: ["goods", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/goods/single-goods/${id}`);
      return res.data.data;
    },
  });

  const [formData, setFormData] = useState({
    product: {
      name: "",
      details: "",
    },
    quantity: 0,
  });

  useEffect(() => {
    if (goods) {
      setFormData({
        product: {
          name: goods.product.name || "",
          details: goods.product.details || "",
        },
        quantity: goods.quantity || 0,
      });
    }
  }, [goods]);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: updateGoods, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.put(`/goods/update-goods/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["goods"] });
      router.push("/dashboard/goods");
    },
    onError: (error: any) => {
      const serverError = error?.response?.data;

      if (serverError?.message === "Validation failed" && serverError?.errors) {
        Object.entries(serverError.errors).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(serverError?.message || "Something went wrong");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateGoods(formData);
  };
  return (
    <>
      <Card>
        <CardHeader>
          <div className="space-y-6">
            <Link
              href="/dashboard/goods"
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </Link>
            <CardTitle>Edit Goods</CardTitle>
          </div>
          <CardDescription>Update a barangay information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-6 w-full">
              <div className="w-full space-y-2">
                <Label htmlFor="product.name">Product Name</Label>
                <Input
                  id="product.name"
                  placeholder="Rice"
                  value={formData.product.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      product: { ...formData.product, name: e.target.value },
                    })
                  }
                />
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="product.details">Product Details</Label>
                <Input
                  id="product.details"
                  placeholder="100kg"
                  value={formData.product.details}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      product: { ...formData.product, details: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="flex gap-6 w-full">
              <div className="w-full space-y-2">
                <Label htmlFor="quantity">Product Quantity</Label>
                <Input
                  id="quantity"
                  placeholder="100"
                  type="number"
                  min={1}
                  max={100}
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="mt-5">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
