import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Stars } from "@/components/auth/stars";
import { buttonVariants } from "@/components/ui/button";

export default function SignUpSuccessPage() {
  return (
    <AuthShell panelExtra={<Stars reveal starClassName="size-9" />}>
      <div className="grid gap-8">
        <Stars reveal className="lg:hidden" starClassName="size-7" />
        <header className="grid gap-3">
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Conta criada
          </h1>
          <p className="max-w-[40ch] leading-relaxed text-muted-foreground">
            Sua conta está pronta. O acesso à plataforma será liberado em breve.
          </p>
        </header>
        <Link
          href="/auth/sign-up"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "w-fit",
          })}
        >
          Criar outra conta
        </Link>
      </div>
    </AuthShell>
  );
}
