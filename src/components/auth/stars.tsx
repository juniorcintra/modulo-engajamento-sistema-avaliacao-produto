import { Star } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const STARS = [0, 1, 2, 3, 4];

type StarsProps = {
  className?: string;
  starClassName?: string;
  reveal?: boolean;
};

function Stars({ className, starClassName, reveal }: StarsProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex gap-1 text-star", reveal && "star-reveal", className)}
    >
      {STARS.map((i) => (
        <Star
          key={i}
          className={cn("fill-current", starClassName)}
          style={{ "--i": i } as CSSProperties}
        />
      ))}
    </div>
  );
}

export { Stars };
