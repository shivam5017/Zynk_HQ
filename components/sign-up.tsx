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
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z
  .object({
    name: z.string().min(3, "Enter a valid name"),
    email: z.email("Enter a valid email adress"),
    password: z.string().min(6, "Enter a valid password"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SignUpForm() {
 const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await authClient.signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: async () => {
            toast.success("Check your email to verify your account");
            setIsNavigating(true)
            router.push("/verify-email");
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
      {/* LEFT SECTION — MARKETING CONTENT */}
      <div className="flex flex-col justify-center px-10 md:px-16 py-16">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Automate Your Twitter Growth
          <span className="block text-blue-400">While You Sleep.</span>
        </h1>

        <p className="mt-6 text-lg text-slate-300 max-w-md">
          Our AI-powered automation tool helps you post, schedule, reply, and
          grow your audience effortlessly. Get analytics, auto-retweets, and
          daily growth insights — all in one dashboard.
        </p>

        <ul className="mt-6 space-y-3 text-slate-300">
          <li>⚡ Schedule Tweets Automatically</li>
          <li>🤖 Auto Reply + Boost Engagement</li>
          <li>📈 Smart Analytics for Faster Growth</li>
          <li>💬 Generate Viral Tweets With AI</li>
        </ul>

        <Button
          className="mt-10 w-fit px-6 py-5 text-base rounded-full bg-blue-600 hover:bg-blue-700"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* RIGHT SECTION — SIGNUP FORM */}
      <div className="flex justify-center items-center px-6 md:px-10 py-14 bg-white text-black rounded-t-3xl md:rounded-none shadow-xl">
        <div className="w-full max-w-md">
          <Card className="w-full sm:max-w-md border border-gray-200 shadow-sm">
            {/* HEADER */}
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">
                Create an account
              </CardTitle>
              <CardDescription className="text-gray-500 text-sm">
                Enter your email below to create your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google Button */}
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
                id="signup-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                {/* FULL NAME */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel className="text-sm font-medium">
                        Full Name
                      </FieldLabel>
                      <Input
                        placeholder="Shivam Malik"
                        {...field}
                        autoComplete="off"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

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
                        placeholder="your@email.com"
                        {...field}
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
                      <FieldLabel className="text-sm font-medium">
                        Password
                      </FieldLabel>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                        autoComplete="off"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* CONFIRM PASSWORD */}
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel className="text-sm font-medium">
                        Confirm Password
                      </FieldLabel>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
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
              {/* SIGNUP BUTTON */}
              <Button type="submit" form="signup-form" className="w-full">
                {form.formState.isSubmitting || isNavigating ? (
                  <Spinner className="size-6" />
                ) : (
                  "Sign up"
                )}
              </Button>

              {/* SIGN IN LINK */}
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-black font-medium">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
