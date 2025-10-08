import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Logo from "../public/Logo.png";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export default function LoginPage() {
  const { data: isAdminExist, isLoading } = useQuery({
    queryKey: ["isAdminExist"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/admin");
      return res.data.success;
    },
  });

  return (
    <section className="flex min-h-screen px-4 py-16 md:py-32">
      <form
        action=""
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
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input type="email" required name="email" id="email" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd" className="text-sm">
                  Password
                </Label>
                <Button asChild variant="link" size="sm">
                  <Link
                    href="/forgot-password"
                    className="link intent-info variant-ghost text-sm"
                  >
                    Forgot your Password ?
                  </Link>
                </Button>
              </div>
              <Input
                type="password"
                required
                name="pwd"
                id="pwd"
                className="input sz-md variant-mixed"
              />
            </div>

            <Button className="w-full">Sign In</Button>
          </div>
        </div>

        {!isAdminExist && !isLoading && (
          <div className="bg-muted rounded-(--radius) border p-3">
            <p className="text-accent-foreground text-center text-sm">
              Don't have an account ?
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
