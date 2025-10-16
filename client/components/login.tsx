"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "../public/Logo.png";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, type LoginFormData } from "@/schema/forms/auth";
import { useCheckAdmin } from "@/hooks/query/auth/useCheckAdmin";
import { useLoginMutation } from "@/hooks/query/auth/useLoginMutation";
import { FormField } from "@/components/forms/common/FormField";

export default function LoginPage() {
  const { data: response, isLoading } = useCheckAdmin();
  const isAdminExist = response?.success;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useLoginMutation();

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <section className="flex min-h-screen px-4 py-16 md:py-32">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home">
              <Image src={Logo} alt="Logo" width={40} height={40} />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Sign In to LGU Ayuda
            </h1>
            <p className="text-sm">Welcome back! Sign in to continue</p>
          </div>

          <hr className="my-4 border-dashed" />

          <div className="space-y-6">
            <FormField
              label="Email"
              type="email"
              placeholder="your@email.com"
              error={errors.email}
              required
              {...register("email")}
            />

            <FormField
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password}
              required
              className="mt-0"
              {...register("password")}
            />

            <div className="flex items-center justify-end">
              <Button asChild variant="link" size="sm" className="h-auto p-0">
                <Link href="/forgot-password" className="text-sm">
                  Forgot your Password?
                </Link>
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </div>

        {!isAdminExist && !isLoading && (
          <div className="bg-muted rounded-(--radius) border p-3">
            <p className="text-accent-foreground text-center text-sm">
              Don&apos;t have an account?
              <Button asChild variant="link" className="px-2">
                <Link href="/create-admin">Create Admin</Link>
              </Button>
            </p>
          </div>
        )}
      </form>
    </section>
  );
}
