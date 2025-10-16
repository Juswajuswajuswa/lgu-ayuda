"use client";

import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSendForgotPasswordMutation } from "@/hooks/query/auth/useSendForgotPasswordMutation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const { mutate: sendForgetPasswordMutation, isPending } =
    useSendForgotPasswordMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendForgetPasswordMutation({ email });
  };

  return (
    <section className="flex min-h-screen px-4 py-16 md:py-32">
      <form
        onSubmit={handleSubmit}
        action=""
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home">
              <LogoIcon />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Recover Password
            </h1>
            <p className="text-sm">
              Enter your email to receive a verification code
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <span>Send Verification Code</span>
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              We&apos;ll send you a verification code to reset your password.
            </p>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Remembered your password?
            <Button
              asChild
              variant="link"
              className="px-2"
              disabled={isPending}
            >
              <Link href="/login">Log in</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
