import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type RatingStarsProps = {
  score: number;
  className?: string;
  starClassName?: string;
};

export function RatingStars({
  score,
  className,
  starClassName,
}: RatingStarsProps) {
  const rounded = Math.round(score);

  return (
    <div
      role="img"
      aria-label={`Nota ${score.toFixed(1).replace(".", ",")} de 5`}
      className={cn("flex gap-0.5 text-star", className)}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            "size-5",
            i <= rounded ? "fill-current" : "text-border",
            starClassName,
          )}
        />
      ))}
    </div>
  );
}
