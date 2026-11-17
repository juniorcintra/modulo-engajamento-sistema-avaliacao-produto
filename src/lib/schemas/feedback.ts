import { z } from "zod";

export const feedbackSchema = z.object({
  score: z
    .number("Escolha uma nota de 1 a 5")
    .int("Escolha uma nota de 1 a 5")
    .min(1, "Escolha uma nota de 1 a 5")
    .max(5, "Escolha uma nota de 1 a 5"),
  comment: z
    .string()
    .trim()
    .min(1, "Escreva um comentário")
    .max(1000, "O comentário deve ter no máximo 1000 caracteres"),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
