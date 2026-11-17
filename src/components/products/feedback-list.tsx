import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RatingStars } from "@/components/products/rating-stars";
import type { Feedback } from "@/server/services/feedbacks";

export function FeedbackList({ feedbacks }: { feedbacks: Feedback[] }) {
  return (
    <section aria-labelledby="feedbacks-title" className="grid gap-5">
      <h2
        id="feedbacks-title"
        className="font-display text-2xl font-bold tracking-tight"
      >
        Avaliações
      </h2>

      {feedbacks.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-muted-foreground">
          Seja a primeira pessoa a avaliar este produto.
        </p>
      ) : (
        <ul className="grid gap-4">
          {feedbacks.map((feedback) => (
            <li
              key={feedback.id}
              className="grid gap-3 rounded-2xl border border-border bg-field p-5"
            >
              <div className="flex items-center gap-3">
                {/* biome-ignore lint/performance/noImgElement: avatar SVG externo */}
                <img
                  src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(feedback.authorSeed)}`}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 rounded-full bg-muted"
                />
                <div className="grid">
                  <p className="font-semibold">{feedback.authorName}</p>
                  <time
                    dateTime={feedback.createdAt}
                    className="text-sm text-muted-foreground"
                  >
                    {format(
                      new Date(feedback.createdAt),
                      "d 'de' MMMM 'de' yyyy",
                      {
                        locale: ptBR,
                      },
                    )}
                  </time>
                </div>
                <RatingStars
                  score={feedback.score}
                  className="ml-auto"
                  starClassName="size-4"
                />
              </div>
              <p className="whitespace-pre-line break-words leading-relaxed">
                {feedback.comment}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
