import { AlertCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Alert({
  className,
  title,
  children,
  ...props
}: Omit<ComponentProps<"div">, "title"> & { title: string }) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        "flex gap-3 rounded-xl border border-destructive/40 bg-destructive/8 px-4 py-3.5 text-sm text-destructive",
        className,
      )}
      {...props}
    >
      <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="grid gap-0.5">
        <p className="font-semibold">{title}</p>
        <p className="text-foreground">{children}</p>
      </div>
    </div>
  );
}

export { Alert };
