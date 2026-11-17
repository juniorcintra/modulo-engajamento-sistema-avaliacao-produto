import { NextResponse } from "next/server";
import { z } from "zod";
import { signInSchema } from "@/lib/schemas/sign-in";
import { createSession } from "@/server/auth/session";
import { InvalidCredentialsError, signIn } from "@/server/services/sign-in";

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

  const parsed = signInSchema.safeParse(body);
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
    const session = await signIn(parsed.data);
    await createSession(session);
    return NextResponse.json({
      id: session.accountId,
      firstName: session.firstName,
      lastName: session.lastName,
      email: session.email,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    console.error("sign-in failed", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
