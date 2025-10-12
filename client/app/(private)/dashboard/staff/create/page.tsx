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
import { ArrowLeftIcon, EyeIcon } from "lucide-react";
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
import { useMutation } from "@tanstack/react-query";
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
      toast.error(error.response.data.message);
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.firstName === "") {
      toast.error("First name is required");
      return;
    }

    if (formData.lastName === "") {
      toast.error("Last name is required");
      return;
    }

    if (formData.barangay === "") {
      toast.error("Barangay is required");
      return;
    }

    if (formData.role === "") {
      toast.error("Role is required");
      return;
    }

    if (formData.phoneNumber === "") {
      toast.error("Phone number is required");
      return;
    }

    const regex = /^(09|\+639)\d{9}$/;
    if (!regex.test(formData.phoneNumber)) {
      toast.error("Phone number is not valid");
      return;
    }

    if (formData.email === "") {
      toast.error("Email is required");
      return;
    }

    if (formData.password === "") {
      toast.error("Password is required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords does not match");
      return;
    }

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
                <Input
                  id="barangay"
                  placeholder="Lower Bicutan"
                  value={formData.barangay}
                  onChange={(e) =>
                    setFormData({ ...formData, barangay: e.target.value })
                  }
                />
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
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
