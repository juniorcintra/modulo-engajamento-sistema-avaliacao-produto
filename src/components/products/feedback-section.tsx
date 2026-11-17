import Link from "next/link";
import { FeedbackForm } from "@/components/products/feedback-form";
import { buttonVariants } from "@/components/ui/button";
import { getSession } from "@/server/auth/session";

export async function FeedbackSection({ productId }: { productId: string }) {
  const session = await getSession();

  return (
    <section
      aria-labelledby="new-feedback-title"
      className="grid gap-5 rounded-2xl border border-border p-6 md:p-8"
    >
      <h2
        id="new-feedback-title"
        className="font-display text-2xl font-bold tracking-tight"
      >
        {session ? "Avalie este produto" : "Entre para avaliar"}
      </h2>

      {session ? (
        <FeedbackForm productId={productId} />
      ) : (
        <div className="grid gap-5">
          <p className="max-w-prose text-muted-foreground">
            Só pessoas com conta podem deixar avaliações. Entre ou crie sua
            conta para compartilhar sua opinião.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth/sign-in"
              className={buttonVariants({ size: "lg" })}
            >
              Entrar
            </Link>
            <Link
              href="/auth/sign-up"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Criar conta
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
