import { Star } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { Product } from "@/lib/schemas/product";
import { cn } from "@/lib/utils";

function Rating({ score }: { score: number }) {
  const rounded = Math.round(score);
  return (
    <div className="flex items-center gap-2">
      <div aria-hidden="true" className="flex gap-0.5 text-star">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={cn(
              "size-4",
              n <= rounded ? "fill-current" : "opacity-30",
            )}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {score > 0 ? `${score.toFixed(1)} de 5` : "Sem avaliações"}
      </span>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.id}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border bg-background shadow-sm transition-shadow hover:shadow-md motion-reduce:transition-none">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="block aspect-[4/3] overflow-hidden bg-muted"
      >
        {/* biome-ignore lint/performance/noImgElement: domínios das imagens são livres */}
        <img
          src={product.imageUrl}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h2 className="font-display text-lg font-semibold leading-snug">
          <Link
            href={href}
            className="rounded-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
          >
            {product.name}
          </Link>
        </h2>
        {product.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        ) : null}
        <div className="mt-auto flex flex-col gap-4 pt-2">
          <Rating score={product.score} />
          <Link href={href} className={buttonVariants({ variant: "outline" })}>
            Ver produto
          </Link>
        </div>
      </div>
    </article>
  );
}
