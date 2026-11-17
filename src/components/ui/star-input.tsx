"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type StarInputProps = {
  value?: number;
  onChange: (value: number) => void;
  labelledBy: string;
  invalid?: boolean;
};

const LABELS = ["Péssimo", "Ruim", "Regular", "Bom", "Excelente"];

function StarInput({ value, onChange, labelledBy, invalid }: StarInputProps) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value ?? 0;

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-invalid={invalid}
      className="flex gap-1"
      onMouseLeave={() => setHover(null)}
    >
      {LABELS.map((label, index) => {
        const star = index + 1;
        return (
          <label
            key={label}
            title={label}
            onMouseEnter={() => setHover(star)}
            className="cursor-pointer rounded-md p-0.5 has-focus-visible:ring-[3px] has-focus-visible:ring-ring/40"
          >
            <input
              type="radio"
              name="score"
              value={star}
              checked={value === star}
              onChange={() => onChange(star)}
              aria-label={`${star} ${star === 1 ? "estrela" : "estrelas"} · ${label}`}
              className="sr-only"
            />
            <Star
              aria-hidden="true"
              className={cn(
                "size-9 text-star transition-transform motion-safe:hover:scale-110",
                star <= shown ? "fill-current" : "text-border",
              )}
            />
          </label>
        );
      })}
    </div>
  );
}

export { StarInput };
