import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sparkles } from "lucide-react";

type AiSummaryProps = {
  summary: string | null;
  feedbackCount: number;
  updatedAt: string | null;
};

export function AiSummary({
  summary,
  feedbackCount,
  updatedAt,
}: AiSummaryProps) {
  if (feedbackCount === 0) return null;

  return (
    <section
      aria-labelledby="ai-summary-title"
      className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
          <Sparkles className="size-3.5" aria-hidden="true" />
          IA
        </span>
        <h2
          id="ai-summary-title"
          className="font-display text-xl font-bold tracking-tight sm:text-2xl"
        >
          Resumo das avaliações
        </h2>
      </div>

      {summary ? (
        <>
          <p className="mt-4 max-w-prose text-lg leading-relaxed">{summary}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Gerado por inteligência artificial a partir de{" "}
            {feedbackCount === 1
              ? "1 avaliação"
              : `${feedbackCount} avaliações`}
            {updatedAt
              ? `, ${formatDistanceToNow(new Date(updatedAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}`
              : ""}
            . Pode conter imprecisões.
          </p>
        </>
      ) : (
        <p className="mt-4 text-muted-foreground" role="status">
          A IA está preparando o resumo das avaliações. Atualize a página em
          instantes.
        </p>
      )}
    </section>
  );
}
