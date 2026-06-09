"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { setToken } from "@/lib/auth/session";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      const res = await login(data);
      setToken(res.accessToken);
      await refresh();
      router.push("/dashboard");
    } catch (e) {
      setError("root", {
        message: e instanceof Error ? e.message : "Login failed",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <Input label="Password" type="password" error={errors.password?.message} {...register("password")} />
      {errors.root && <p className="text-sm text-ember">{errors.root.message}</p>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-sm text-paper-muted">
        No account?{" "}
        <Link href="/register" className="text-bronze hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}
