"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { type SignInInput, signInSchema } from "@/lib/schemas/sign-in";

async function postSignIn(data: SignInInput) {
  const response = await fetch("/api/v1/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 400)
      throw new Error("Email ou senha inválidos");
    throw new Error("Não foi possível entrar. Tente novamente.");
  }
}

export function SignInScreen() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });

  const mutation = useMutation({
    mutationFn: postSignIn,
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  return (
    <AuthShell>
      <div className="grid gap-8">
        <header className="grid gap-2">
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Entrar
          </h1>
          <p className="text-muted-foreground">
            Acesse sua conta para avaliar produtos.
          </p>
        </header>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="grid gap-5"
          noValidate
        >
          {mutation.isError && (
            <Alert title="Não foi possível entrar">
              {mutation.error.message}
            </Alert>
          )}

          <Field
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            registration={register("email")}
          />

          <PasswordField
            id="password"
            label="Senha"
            autoComplete="current-password"
            error={errors.password?.message}
            registration={register("password")}
          />

          <Button
            type="submit"
            size="lg"
            disabled={mutation.isPending}
            className="mt-1"
          >
            {mutation.isPending && (
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            )}
            {mutation.isPending ? "Entrando…" : "Entrar"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
