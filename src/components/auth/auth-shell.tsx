import { Star } from "lucide-react";
import type { ReactNode } from "react";

type AuthShellProps = {
  panelExtra?: ReactNode;
  children: ReactNode;
};

function AuthShell({ panelExtra, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-background lg:p-4">
      <div className="grid min-h-screen lg:min-h-[calc(100vh-2rem)] lg:grid-cols-[5fr_6fr]">
        <aside className="flex flex-col justify-between gap-10 bg-panel px-6 py-6 text-panel-foreground sm:px-10 lg:rounded-[28px] lg:px-14 lg:py-12">
          <div className="grid gap-6 lg:gap-10">
            <div className="flex items-center gap-2 font-display text-lg font-semibold">
              <Star className="size-5 fill-star text-star" aria-hidden="true" />
              Avaliação de produto
            </div>
            <div className="grid gap-4">
              <p className="max-w-[16ch] font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
                Sua opinião ajuda a próxima pessoa a escolher.
              </p>
              <p className="hidden max-w-[42ch] text-base leading-relaxed text-panel-muted lg:block">
                Avalie os produtos que você usa e veja o que realmente importa
                para quem compra.
              </p>
            </div>
          </div>
          <div className="hidden lg:block">{panelExtra}</div>
        </aside>

        <section className="flex items-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}

export { AuthShell };
