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
import { useDeleteBeneficiaryMutation } from "@/hooks/query/beneficiary/useDeleteBeneficiaryMutation";

export default function DeleteBeneficiaryPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const router = useRouter();

  const { mutate: deleteBeneficiary, isPending } =
    useDeleteBeneficiaryMutation();

  const handleDelete = () => {
    deleteBeneficiary(id);
  };

  return (
    <Card>
      <CardHeader>
        <div className="space-y-6">
          <Link
            href="/dashboard/beneficiaries"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Link>
          <CardTitle>Delete Beneficiary</CardTitle>
        </div>
        <CardDescription>
          Are you sure you want to delete this beneficiary? This action will
          archive the beneficiary and remove them from the active list.
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
