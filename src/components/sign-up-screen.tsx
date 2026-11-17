"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { ReviewPreview } from "@/components/auth/review-preview";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { type SignUpInput, signUpSchema } from "@/lib/schemas/sign-up";

async function postSignUp(data: SignUpInput) {
  const response = await fetch("/api/v1/sign-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      body?.message ?? "Não foi possível criar a conta. Tente novamente.",
    );
  }
}

export function SignUpScreen() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) });

  const mutation = useMutation({
    mutationFn: postSignUp,
    onSuccess: () => router.push("/auth/sign-up/success"),
  });

  return (
    <AuthShell
      panelExtra={
        <ReviewPreview
          firstName={watch("firstName") ?? ""}
          lastName={watch("lastName") ?? ""}
        />
      }
    >
      <div className="grid gap-8">
        <header className="grid gap-2">
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Criar conta
          </h1>
          <p className="text-muted-foreground">
            Preencha seus dados para começar a avaliar.
          </p>
        </header>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="grid gap-5"
          noValidate
        >
          {mutation.isError && (
            <Alert title="Não foi possível criar a conta">
              {mutation.error.message}
            </Alert>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="firstName"
              label="Nome"
              autoComplete="given-name"
              error={errors.firstName?.message}
              registration={register("firstName")}
            />
            <Field
              id="lastName"
              label="Sobrenome"
              autoComplete="family-name"
              error={errors.lastName?.message}
              registration={register("lastName")}
            />
          </div>

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
            autoComplete="new-password"
            error={errors.password?.message}
            registration={register("password")}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirmar senha"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            registration={register("confirmPassword")}
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
            {mutation.isPending ? "Criando conta…" : "Criar conta"}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
