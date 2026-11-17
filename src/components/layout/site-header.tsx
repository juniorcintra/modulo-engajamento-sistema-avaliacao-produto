import { Star } from "lucide-react";
import Link from "next/link";
import { UserMenu } from "@/components/layout/user-menu";
import { buttonVariants } from "@/components/ui/button";
import { getSession } from "@/server/auth/session";

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md font-display text-lg font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star className="size-5 fill-star text-star" aria-hidden="true" />
          Avaliação de produto
        </Link>
        {session ? (
          <UserMenu
            firstName={session.firstName}
            lastName={session.lastName}
            email={session.email}
          />
        ) : (
          <Link href="/auth/sign-in" className={buttonVariants()}>
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
