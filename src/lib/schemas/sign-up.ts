import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z.string().trim().min(1, "Informe o nome").max(100),
    lastName: z.string().trim().min(1, "Informe o sobrenome").max(100),
    email: z.email("Informe um email válido").trim().toLowerCase(),
    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .max(72, "A senha deve ter no máximo 72 caracteres"),
    confirmPassword: z.string().min(1, "Confirme a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não conferem",
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
