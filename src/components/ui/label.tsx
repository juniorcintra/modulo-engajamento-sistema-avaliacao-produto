import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: o controle é associado via htmlFor pelo consumidor
    <label
      data-slot="label"
      className={cn("text-sm font-medium leading-none select-none", className)}
      {...props}
    />
  );
}

export { Label };
