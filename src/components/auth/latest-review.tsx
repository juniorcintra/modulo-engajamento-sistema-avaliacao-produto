import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { RatingStars } from "@/components/products/rating-stars";
import { getLatestFeedback } from "@/server/services/feedbacks";

async function loadLatest() {
  try {
    return await getLatestFeedback();
  } catch (error) {
    console.error("latest feedback failed", error);
    return null;
  }
}

async function LatestReview() {
  const review = await loadLatest();
  if (!review) return null;

  const seed = encodeURIComponent(review.authorSeed);

  return (
    <div className="grid gap-3">
      <p className="text-sm text-panel-muted">Última avaliação na plataforma</p>
      <figure className="grid gap-4 rounded-2xl bg-background p-5 text-foreground">
        <figcaption className="flex items-center gap-3">
          {/* biome-ignore lint/performance/noImgElement: SVG remoto do DiceBear; next/image bloqueia SVG */}
          <img
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${seed}`}
            alt=""
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full bg-muted"
          />
          <span className="grid min-w-0">
            <span className="truncate font-semibold">{review.authorName}</span>
            <span className="truncate text-sm text-muted-foreground">
              avaliou{" "}
              <Link
                href={`/products/${review.product.id}`}
                className="font-medium text-foreground underline-offset-4 hover:underline focus-visible:underline"
              >
                {review.product.name}
              </Link>
            </span>
          </span>
        </figcaption>
        <RatingStars score={review.score} />
        <blockquote className="line-clamp-4 text-[15px] leading-relaxed">
          {review.comment}
        </blockquote>
        <time
          dateTime={review.createdAt}
          className="text-xs text-muted-foreground"
        >
          {formatDistanceToNow(new Date(review.createdAt), {
            addSuffix: true,
            locale: ptBR,
          })}
        </time>
      </figure>
    </div>
  );
}

export { LatestReview };
