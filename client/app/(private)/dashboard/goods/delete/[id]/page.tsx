"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteGoodsPage() {
  const params = useParams();
  const { id } = params;

  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: deleteGoods, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(`/goods/delete-goods/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["goods"] });
      router.push("/dashboard/goods");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });
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
            <CardTitle>Delete Goods</CardTitle>
          </div>
          <CardDescription>
            Are you sure you want to delete this goods?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Button
            variant="destructive"
            onClick={() => deleteGoods(id as string)}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
