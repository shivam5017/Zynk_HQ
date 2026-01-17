"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { ArrowRight } from "lucide-react";
import { RequestPasswordModal } from "./request-password-modal";
import { use, useState } from "react";

const formSchema = z.object({
  email: z.email("Enter a valid email adress"),
  password: z.string().min(6, "Enter a valid password"),
});

export function SignInForm() {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: async () => {
            setIsNavigating(true);
            router.push("/dashboard");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    } catch {
      throw new Error("Something went wrong");
    }
  };

  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-linear-to-br from-slate-900 to-black text-white">
      {/* LEFT SECTION – MARKETING */}
      <div className="flex flex-col justify-center px-10 md:px-16 py-16">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Welcome Back to
          <span className="block text-blue-400">Effortless Twitter Growth</span>
        </h1>

        <p className="mt-6 text-lg text-slate-300 max-w-md">
          Log in to continue scheduling tweets, automating replies, and tracking
          real-time analytics — everything you need to grow faster.
        </p>

        <ul className="mt-6 space-y-3 text-slate-300">
          <li>⚡ Manage Your Tweet Queue</li>
          <li>🤖 Automate Replies & Retweets</li>
          <li>📊 Deep Growth Analytics</li>
          <li>🚀 AI-Powered Tweet Generation</li>
        </ul>

        <Button
          className="mt-10 w-fit px-6 py-5 text-base rounded-full bg-blue-600 hover:bg-blue-700"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Login Now <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* RIGHT SECTION – SIGN IN FORM */}
      <div className="flex justify-center items-center px-6 md:px-10 py-14 bg-white text-black rounded-t-3xl md:rounded-none shadow-xl">
        <div className="w-full max-w-md">
          <Card className="w-full sm:max-w-md border border-gray-200 shadow-sm">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription className="text-gray-500 text-sm">
                Enter your email to sign in to your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                onClick={signInWithGoogle}
                className="w-full"
              >
                <span className="text-lg">G</span>
                Continue with Google
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-500">OR CONTINUE WITH</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* FORM */}
              <form
                id="signin-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                {/* EMAIL */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel className="text-sm font-medium">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="your@email.com"
                        autoComplete="off"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* PASSWORD */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel className="flex items-center justify-between text-sm font-medium">
                        <span>Password</span>

                        <button
                          type="button"
                          onClick={() => setOpen(true)}
                          className="text-grey-300 font-xs text-sm  cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </FieldLabel>

                      <Input
                        {...field}
                        type="password"
                        placeholder="********"
                        autoComplete="off"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </form>
            </CardContent>

            <CardFooter className="flex-col gap-4">
              {/* SIGN IN BUTTON */}
              <Button type="submit" form="signin-form" className="w-full">
                {form.formState.isSubmitting || isNavigating ? (
                  <Spinner className="size-6" />
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* SIGN UP LINK */}
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="text-black font-medium">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
          <RequestPasswordModal open={open} setOpen={setOpen} />
        </div>
      </div>
    </div>
  );
}
