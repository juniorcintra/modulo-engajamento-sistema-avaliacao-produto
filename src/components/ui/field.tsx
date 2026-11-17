import type { ComponentProps, ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
  trailing?: ReactNode;
} & Pick<ComponentProps<"input">, "type" | "autoComplete">;

function Field({
  id,
  label,
  error,
  registration,
  trailing,
  type,
  autoComplete,
}: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={trailing ? "pr-12" : undefined}
          {...registration}
        />
        {trailing}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export { Field };
