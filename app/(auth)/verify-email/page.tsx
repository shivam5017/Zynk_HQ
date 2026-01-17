"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const { data } = await authClient.getSession();

      if (data?.user?.emailVerified) {
        router.replace("/dashboard");
      }
    };

    check();

    const interval = setInterval(check, 3000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">Verify your email</h1>

        <p className="text-gray-500">
          We’ve sent a verification link to your email.
          <br />
          Once verified, you’ll be redirected automatically.
        </p>

        <p className="text-sm text-gray-600">
          Already verified?{" "}
          <Link href="/sign-in" className="underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
