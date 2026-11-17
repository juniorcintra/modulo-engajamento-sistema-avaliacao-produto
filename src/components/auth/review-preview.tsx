import { User } from "lucide-react";
import { Stars } from "@/components/auth/stars";

type ReviewPreviewProps = {
  firstName: string;
  lastName: string;
};

function ReviewPreview({ firstName, lastName }: ReviewPreviewProps) {
  const first = firstName.trim();
  const last = lastName.trim();
  const displayName = first
    ? `${first}${last ? ` ${last.charAt(0).toUpperCase()}.` : ""}`
    : "Seu nome";
  const initials = first
    ? `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    : null;

  return (
    <div aria-hidden="true" className="grid gap-3">
      <p className="text-sm text-panel-muted">
        Assim seu nome aparece nas avaliações
      </p>
      <figure className="grid gap-4 rounded-2xl bg-background p-5 text-foreground">
        <figcaption className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-base font-bold text-primary">
            {initials ?? <User className="size-5" />}
          </span>
          <span className="grid min-w-0">
            <span
              className={`truncate font-semibold ${first ? "" : "text-muted-foreground"}`}
            >
              {displayName}
            </span>
            <span className="text-sm text-muted-foreground">
              Avaliação de exemplo
            </span>
          </span>
        </figcaption>
        <Stars starClassName="size-5" />
        <blockquote className="text-[15px] leading-relaxed">
          Chegou antes do prazo e é exatamente como estava na descrição.
        </blockquote>
      </figure>
    </div>
  );
}

export { ReviewPreview };
