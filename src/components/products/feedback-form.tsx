"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StarInput } from "@/components/ui/star-input";
import { Textarea } from "@/components/ui/textarea";
import { type FeedbackInput, feedbackSchema } from "@/lib/schemas/feedback";

async function postFeedback(productId: string, data: FeedbackInput) {
  const response = await fetch(`/api/v1/products/${productId}/feedbacks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      body?.message ?? "Não foi possível enviar a avaliação. Tente novamente.",
    );
  }
}

export function FeedbackForm({ productId }: { productId: string }) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackInput>({ resolver: zodResolver(feedbackSchema) });

  const mutation = useMutation({
    mutationFn: (data: FeedbackInput) => postFeedback(productId, data),
    onSuccess: () => {
      reset({ score: undefined, comment: "" });
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="grid gap-5"
      noValidate
    >
      {mutation.isError && (
        <Alert title="Não foi possível enviar a avaliação">
          {mutation.error.message}
        </Alert>
      )}

      <div className="grid gap-2">
        <Label id="score-label">Sua nota</Label>
        <Controller
          control={control}
          name="score"
          render={({ field }) => (
            <StarInput
              value={field.value}
              onChange={field.onChange}
              labelledBy="score-label"
              invalid={!!errors.score}
            />
          )}
        />
        {errors.score && (
          <p className="text-sm text-destructive">{errors.score.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="comment">Comentário</Label>
        <Textarea
          id="comment"
          maxLength={1000}
          placeholder="Conte como foi sua experiência com o produto"
          aria-invalid={!!errors.comment}
          aria-describedby={errors.comment ? "comment-error" : undefined}
          {...register("comment")}
        />
        {errors.comment && (
          <p id="comment-error" className="text-sm text-destructive">
            {errors.comment.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={mutation.isPending}
        className="justify-self-start"
      >
        {mutation.isPending && (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        )}
        {mutation.isPending ? "Enviando…" : "Enviar avaliação"}
      </Button>
    </form>
  );
}
