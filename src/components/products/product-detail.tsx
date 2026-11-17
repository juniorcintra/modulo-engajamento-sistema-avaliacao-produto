import { ExternalLink } from "lucide-react";
import { RatingStars } from "@/components/products/rating-stars";
import { buttonVariants } from "@/components/ui/button";
import type { ProductDetail as Product } from "@/server/services/product-detail";

type ProductDetailProps = {
  product: Product;
  feedbackCount: number;
};

export function ProductDetail({ product, feedbackCount }: ProductDetailProps) {
  return (
    <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-10">
      {/* biome-ignore lint/performance/noImgElement: imagem externa sem domínio fixo */}
      <img
        src={product.imageUrl}
        alt={product.name}
        className="aspect-square w-full rounded-2xl border border-border bg-muted object-cover"
      />
      <div className="flex flex-col justify-center gap-5">
        <h1 className="font-display text-4xl font-bold tracking-tight text-balance md:text-5xl">
          {product.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <RatingStars score={product.score} starClassName="size-6" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {feedbackCount > 0
                ? product.score.toFixed(1).replace(".", ",")
                : "Sem nota"}
            </span>
            {" · "}
            {feedbackCount === 1
              ? "1 avaliação"
              : `${feedbackCount} avaliações`}
          </p>
        </div>
        {product.description && (
          <p className="max-w-prose text-lg leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}
        <div>
          <a
            href={product.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "lg" })}
          >
            Ver produto
            <ExternalLink className="size-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
