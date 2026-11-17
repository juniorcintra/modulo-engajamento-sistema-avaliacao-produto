import { NextResponse } from "next/server";
import { z } from "zod";
import { signUpSchema } from "@/lib/schemas/sign-up";
import { EmailAlreadyRegisteredError, signUp } from "@/server/services/sign-up";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Corpo da requisição inválido" },
      { status: 400 },
    );
  }

  const parsed = signUpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Dados inválidos",
        errors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const { id } = await signUp(parsed.data);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    if (error instanceof EmailAlreadyRegisteredError) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    console.error("sign-up failed", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
