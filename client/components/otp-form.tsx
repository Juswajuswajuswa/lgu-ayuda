"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Logo from "../public/Logo.png";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function OTPForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [otp, setOtp] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const decodedEmail = decodeURIComponent(email || "");

  const { mutate: verifyOtp, isPending } = useMutation({
    mutationFn: async ({
      decodedEmail,
      otp,
    }: {
      decodedEmail: string;
      otp: string;
    }) => {
      const res = await axiosInstance.post(`/auth/verify-token`, {
        email: decodedEmail,
        otp,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push(`/onboarding?email=${encodeURIComponent(decodedEmail)}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Invalid OTP");
    },
  });

  const { mutate: resendOtpMutation } = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const res = await axiosInstance.post(`/auth/resend-otp`, {
        email: email,
      });

      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const resendSubmit = () => {
    resendOtpMutation({ email: decodedEmail });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email not found");
      return;
    }
    if (otp.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP");
      return;
    }
    verifyOtp({ decodedEmail, otp });
  };

  if (!email) {
    return (
      <Card {...props}>
        <CardHeader className="space-y-2">
          <Image src={Logo} alt="Logo" width={40} height={40} />
          <CardTitle>Email Required</CardTitle>
          <CardDescription>
            Please access this page with a valid email parameter.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card {...props}>
      <CardHeader className="space-y-2">
        <Image src={Logo} alt="Logo" width={40} height={40} />
        <CardTitle>Enter verification code</CardTitle>
        <CardDescription>
          We sent a 6-digit code to {decodedEmail}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp">Verification code</FieldLabel>
              <InputOTP
                maxLength={6}
                id="otp"
                required
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription>
                Enter the 6-digit code sent to your email.
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Button
                onClick={handleSubmit}
                disabled={isPending || otp.length !== 6}
              >
                {isPending ? "Verifying..." : "Verify"}
              </Button>
              <FieldDescription className="text-center">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={resendSubmit}
                  className="text-gray-600 underline cursor-pointer"
                >
                  Resend
                </button>
              </FieldDescription>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
