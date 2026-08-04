"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Compass } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginInput } from "@/lib/validation";
import { useAuthStore, dashboardRootFor } from "@/lib/auth-store";
import { authApi, showApiError } from "@/lib/api-service";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    try {
      const response = await authApi.login(data.email, data.password);
      setSession(response.token, response.user);
      document.cookie = `gearup-session=${JSON.stringify({ role: response.user.role })}; path=/`;
      toast.success("Welcome back");
      router.push(searchParams.get("next") ?? dashboardRootFor(response.user.role));
    } catch (error) {
      showApiError(error);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="mb-6 flex items-center gap-2 font-display text-xl text-ink">
        <Compass className="h-5 w-5 text-brass-dark" /> GearUp
      </Link>

      <Card className="w-full">
        <h1 className="font-display text-2xl text-ink">Log in</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Enter your credentials to access your account
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" invalid={!!errors.email} {...register("email")} />
          </FormField>
          <FormField label="Password" htmlFor="password" error={errors.password?.message}>
            <Input id="password" type="password" invalid={!!errors.password} {...register("password")} />
          </FormField>

          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Log in
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          New to GearUp?{" "}
          <Link href="/auth/register" className="font-medium text-moss-dark hover:text-moss">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
