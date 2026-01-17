import { RequestPasswordForm } from "@/components/request-password-form";
import { authIsNotRequired } from "@/lib/server/auth-utils";

export default async function RequestPasswordPage() {
  await authIsNotRequired();

  return <RequestPasswordForm />;
}
