import { redirect } from "next/navigation";

export default function VerifyEmailCallbackPage() {
  redirect("/dashboard");
}
