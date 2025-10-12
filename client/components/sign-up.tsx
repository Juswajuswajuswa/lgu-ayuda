"use client";

import Logo from "../public/Logo.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateAdminPage() {
  const [email, setEmail] = useState("");

  const router = useRouter();

  const { mutate: registerAdmin, isPending } = useMutation({
    mutationFn: async (email: string) => {
      const res = await axiosInstance.post("/auth/register-admin", { email });
      return res.data;
    },
    onSuccess: (data) => {
      router.push(`/verify-otp?board&email=${encodeURIComponent(email)}`);
      toast.success(data.message);
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  const handleRegisterAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    registerAdmin(email);
  };

  return (
    <section className="flex min-h-screen px-4 py-16 md:py-32">
      <form
        onSubmit={handleRegisterAdmin}
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home">
              <Image src={Logo} alt="Logo" width={40} height={40} />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Create a LGU Ayuda Admin Account
            </h1>
            <p className="text-sm">Welcome! Create an account to get started</p>
          </div>

          <hr className="my-4 border-dashed" />

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Sending..." : "Continue"}
            </Button>
          </div>
        </div>

        <div className="bg-muted rounded-(--radius) border p-3">
          <p className="text-accent-foreground text-center text-sm">
            Have an account ?
            <Button asChild variant="link" className="px-2">
              <Link href="#">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
