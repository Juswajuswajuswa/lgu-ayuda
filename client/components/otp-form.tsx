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
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { useVerifyOtpMutation } from "@/hooks/query/auth/useVerifyOtpMutation";
import { useResendOtpMutation } from "@/hooks/query/auth/useResendOtpMutation";

export function OTPForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [otp, setOtp] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const decodedEmail = decodeURIComponent(email || "");
  const isForgotPassword = searchParams.has("forgot-password");

  const { mutate: verifyOtp, isPending } = useVerifyOtpMutation((email) => {
    if (isForgotPassword) {
      router.push(`/password-reset?email=${encodeURIComponent(email)}`);
    } else {
      router.push(`/onboarding?email=${encodeURIComponent(email)}`);
    }
  });

  const { mutate: resendOtp, isPending: isResendingOtp } =
    useResendOtpMutation();

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
    verifyOtp({ email: decodedEmail, otp });
  };

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault();
    resendOtp({ email: decodedEmail });
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
              type="submit"
              disabled={isPending || otp.length !== 6}
              onClick={handleSubmit}
            >
              {isPending ? "Verifying..." : "Verify"}
            </Button>
            <FieldDescription className="text-center">
              Didn&apos;t receive the code?{" "}
              <button
                type="submit"
                className="underline cursor-pointer"
                onClick={handleResend}
                disabled={isResendingOtp}
              >
                {isResendingOtp ? "Resending..." : "Resend"}
              </button>
            </FieldDescription>
          </FieldGroup>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
