import { cn } from "@/lib/utils";
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
import Image from "next/image";

export default function CreateAdminPage() {
  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full"
      )}
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
                Create an Admin Account
              </CardTitle>
              <CardDescription>
                Enter your email below to create an admin account
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
                    CREATE ADMIN
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
