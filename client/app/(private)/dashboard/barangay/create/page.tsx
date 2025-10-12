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
import { useState } from "react";

import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateBarangayPage() {
  const [formData, setFormData] = useState({
    name: "",
    municipality: "",
    province: "",
  });

  const router = useRouter();
  const { mutate: createBarangay, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.post("/barangay/add-barangay", data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push("/dashboard/barangay");
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

    createBarangay(formData);
  };
  return (
    <>
      <Card>
        <CardHeader>
          <div className="space-y-6">
            <Link
              href="/dashboard/barangay"
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </Link>
            <CardTitle>Create Barangay</CardTitle>
          </div>
          <CardDescription>Create a new barangay</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="w-full space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Lower Bicutan"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="w-full space-y-2">
              <Label htmlFor="municipality">Municipality</Label>
              <Input
                id="municipality"
                placeholder="Taguig"
                value={formData.municipality}
                onChange={(e) =>
                  setFormData({ ...formData, municipality: e.target.value })
                }
              />
            </div>
            <div className="w-full space-y-2">
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                placeholder="Metro Manila"
                value={formData.province}
                onChange={(e) =>
                  setFormData({ ...formData, province: e.target.value })
                }
              />
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
