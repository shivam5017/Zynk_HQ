import { OtpCodeForm } from "@/components/otp-code-form";
import { authIsNotRequired } from "@/lib/server/auth-utils";

export default async function TwoFactorCodePage() {
  await authIsNotRequired();

  return <OtpCodeForm />;
}
