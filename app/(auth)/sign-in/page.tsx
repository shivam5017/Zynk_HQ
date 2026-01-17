import { SignInForm } from "@/components/sign-in";
import { authIsNotRequired } from "@/lib/server/auth-utils";

export default async function SignInPage() {
  await authIsNotRequired();

  return <SignInForm />;
}
