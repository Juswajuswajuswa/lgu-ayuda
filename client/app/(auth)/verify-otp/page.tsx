import { OTPForm } from "@/components/otp-form";
import { useRequiredUser } from "@/hooks/useRequiredUser";
import { redirect } from "next/navigation";

export default function VerifyOtpPage() {
  const { user, isLoading } = useRequiredUser();

  if (user && !isLoading) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xs">{!isLoading && <OTPForm />}</div>
    </div>
  );
}
