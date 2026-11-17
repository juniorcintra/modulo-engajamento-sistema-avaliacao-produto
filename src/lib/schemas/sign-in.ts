import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Informe um email válido").trim().toLowerCase(),
  password: z.string().min(1, "Informe a senha").max(72, "Senha inválida"),
});

export type SignInInput = z.infer<typeof signInSchema>;
