"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon } from "lucide-react";
import Image from "next/image";

export default function OnboardingPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center p-4 gap-4">
        <div className="flex items-center justify-center">
          <Image src="/logo.svg" alt="logo" width={200} height={200} />
        </div>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-md">Admin Onboarding</CardTitle>
            <CardDescription>
              Please fill out the form below to proceed with the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="John Doe" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" type="password" />
                    <EyeIcon className="absolute right-2 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input id="confirmPassword" type="password" />
                    <EyeIcon className="absolute right-2 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
