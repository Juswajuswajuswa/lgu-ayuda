"use client";

import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePasswordReset } from "@/hooks/query/auth/usePasswordResetMutation";
import {
  PasswordResetRequest,
  passwordResetRequestSchema,
} from "@/schema/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

export default function PasswordResetPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const decodedEmail = decodeURIComponent(email || "");
  const { register, handleSubmit } = useForm<PasswordResetRequest>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: decodedEmail,
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: passwordReset, isPending } = usePasswordReset();

  const onSubmit = (data: PasswordResetRequest) => {
    passwordReset(data);
  };

  return (
    <section className="flex min-h-screen px-4 py-16 md:py-32">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home">
              <LogoIcon />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">Reset Password</h1>
            <p className="text-sm">Enter your new password</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="block text-sm">
                New Password
              </Label>
              <Input
                type="password"
                required
                id="password"
                {...register("password")}
                placeholder="Enter your new password"
              />
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="block text-sm">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  required
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  placeholder="Confirm your new password"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Submitting..." : "Reset Password"}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
