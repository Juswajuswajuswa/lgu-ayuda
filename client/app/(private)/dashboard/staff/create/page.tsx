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
import { ArrowLeftIcon, EyeIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import axiosInstance from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function CreateStaffPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    barangay: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    email: "",
  });

  const router = useRouter();
  const { mutate: createStaff, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.post("/auth/create-staff", data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push("/dashboard/staff");
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

  const {
    data: barangays,
    isPending: isBarangayPending,
    isError: isBarangayError,
  } = useQuery({
    queryKey: ["barangay"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/barangay/get-barangays`);
      return res.data;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createStaff(formData);
  };
  return (
    <>
      <Card>
        <CardHeader>
          <div className="space-y-6">
            <Link
              href="/dashboard/staff"
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </Link>
            <CardTitle>Create Staff</CardTitle>
          </div>
          <CardDescription>Create a new staff member</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-6 w-full">
              <div className="w-full space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-6 w-full">
              <div className="w-full space-y-2">
                <Label htmlFor="barangay">Barangay</Label>
                <Select
                  value={formData.barangay}
                  onValueChange={(value) =>
                    setFormData({ ...formData, barangay: value })
                  }
                >
                  <SelectTrigger id="barangay" className="w-full">
                    <SelectValue placeholder="Please select a barangay" />
                  </SelectTrigger>
                  <SelectContent>
                    {barangays?.barangays &&
                      barangays?.barangays.length > 0 &&
                      barangays?.barangays.map((barangay) => (
                        <SelectItem key={barangay._id} value={barangay._id}>
                          {barangay.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Please select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="validator">Validator</SelectItem>
                    <SelectItem value="encoder">Encoder</SelectItem>
                    <SelectItem value="distributer">Distributer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-6 w-full">
              <div className="w-full space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  type="text"
                  id="phoneNumber"
                  placeholder="09921103218"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="phoneNumber">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-6 w-full">
              <div className="w-full space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <EyeIcon
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <EyeIcon
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>
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
