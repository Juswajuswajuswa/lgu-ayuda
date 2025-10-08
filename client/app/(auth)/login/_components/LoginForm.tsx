"use client";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { data: isAdminExist } = useQuery({
    queryKey: ["isAdminExist"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/admin");
      return res.data.success;
    },
  });

  if (isAdminExist) {
    redirect("/login");
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full",
        className
      )}
      {...props}
    >
      {/* Logo Section - Left Side */}
      <div className="flex justify-center lg:justify-start">
        <Image src="/logo.svg" alt="logo" height={400} width={400} />
      </div>

      {/* Form Section - Right Side */}
      <div className="flex justify-center lg:justify-start">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-bold">
                Login to your account
              </CardTitle>
              <CardDescription>
                Enter your email below to login to your LGU Ayuda Distribution &
                Project Management Account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">
                      Email<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    SIGN IN
                  </Button>
                </div>
                <div className="mt-4 text-right text-sm">
                  <Link
                    href="/create-admin"
                    className={buttonVariants({ variant: "link" })}
                  >
                    Create an Admin Account
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
