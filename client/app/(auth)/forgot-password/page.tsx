import ForgotPasswordPage from "@/components/forgot-password";
import { useRequiredUser } from "@/hooks/useRequiredUser";
import { redirect } from "next/navigation";

export default function ForgotPassword() {
  const { user, isLoading } = useRequiredUser();

  if (user && !isLoading) {
    redirect("/dashboard");
  }

  return <div>{!isLoading && <ForgotPasswordPage />}</div>;
}
