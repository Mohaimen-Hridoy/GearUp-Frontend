"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Compass } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterInput } from "@/lib/validation";
import { useAuthStore, dashboardRootFor } from "@/lib/auth-store";
import { authApi, showApiError } from "@/lib/api-service";

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    try {
      const response = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      setSession(response.token, response.user);
      document.cookie = `gearup-session=${JSON.stringify({ role: response.user.role })}; path=/`;
      toast.success("Account created successfully");
      router.push(dashboardRootFor(response.user.role));
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
        <h1 className="font-display text-2xl text-ink">Create an account</h1>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
            <Input id="name" invalid={!!errors.name} {...register("name")} />
          </FormField>
          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" invalid={!!errors.email} {...register("email")} />
          </FormField>
          <FormField label="I want to…" htmlFor="role" error={errors.role?.message}>
            <Select id="role" invalid={!!errors.role} defaultValue="" {...register("role")}>
              <option value="" disabled>
                Choose account type
              </option>
              <option value="CUSTOMER">Rent gear (Customer)</option>
              <option value="PROVIDER">List my gear (Provider)</option>
            </Select>
          </FormField>
          <FormField label="Password" htmlFor="password" error={errors.password?.message}>
            <Input id="password" type="password" invalid={!!errors.password} {...register("password")} />
          </FormField>
          <FormField
            label="Confirm password"
            htmlFor="confirmPassword"
            error={errors.confirmPassword?.message}
          >
            <Input
              id="confirmPassword"
              type="password"
              invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
          </FormField>

          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-moss-dark hover:text-moss">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
