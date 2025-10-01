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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [otp, setOtp] = useState("");
  const params = useSearchParams();
  const email = params.get("email") as string;
  const isOTPInputFilled = otp.length === 6;

  return (
    <>
      <div className="flex flex-col items-center justify-center p-4 gap-4">
        <div className="flex items-center justify-center">
          <Image src="/logo.svg" alt="logo" width={200} height={200} />
        </div>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-md">Please check your email</CardTitle>
            <CardDescription>
              We've sent a verification code to your email address. Please enter
              the code below to verify your email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <InputOTP
                value={otp}
                onChange={(value) => setOtp(value)}
                maxLength={6}
                className="gap-2"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to your email address
              </p>
            </div>
            <Button
              className="w-full"
              onClick={() => {}}
              disabled={isPending || !isOTPInputFilled}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                "Verify Email"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
