"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDeleteGoodsMutation } from "@/hooks/query/goods/useDeleteGoodsMutation";

export default function DeleteGoodsPage() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();

  const { mutate: deleteGoods, isPending } = useDeleteGoodsMutation();

  const handleDelete = () => {
    deleteGoods(id as string);
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
          <CardTitle>Delete Goods</CardTitle>
        </div>
        <CardDescription>
          Are you sure you want to delete this goods item? This action cannot be
          undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
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
  );
}
