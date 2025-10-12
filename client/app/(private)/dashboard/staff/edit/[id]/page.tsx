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
import { useEffect, useState } from "react";
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
import { useParams } from "next/navigation";
export default function EditStaffPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const params = useParams();
  const { id } = params;

  const {
    data: staff,
    isPending: isStaffPending,
    isError: isStaffError,
  } = useQuery({
    queryKey: ["staff", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/user/get-user/${id}`);
      return res.data.user;
    },
  });

  console.log(staff);

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

  useEffect(() => {
    if (staff) {
      setFormData({
        firstName: staff.firstName || "",
        lastName: staff.lastName || "",
        role: staff.role || "",
        barangay: staff.barangay?._id || staff.barangay || "",
        password: "",
        confirmPassword: "",
        phoneNumber: staff.phoneNumber || "",
        email: staff.email || "",
      });
    }
  }, [staff]);

  const router = useRouter();

  const { mutate: updateStaff, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.post(`/auth/update-staff/${id}`, data);
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

    updateStaff(formData);
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
            <CardTitle>Edit Staff</CardTitle>
          </div>
          <CardDescription>Edit a staff member</CardDescription>
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
                      barangays?.barangays.map((barangay: any) => (
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
