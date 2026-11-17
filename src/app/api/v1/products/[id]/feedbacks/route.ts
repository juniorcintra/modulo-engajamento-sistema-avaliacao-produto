import { after, NextResponse } from "next/server";
import { z } from "zod";
import { feedbackSchema } from "@/lib/schemas/feedback";
import { getSession } from "@/server/auth/session";
import { refreshAiSummary } from "@/server/services/ai-summary";
import {
  createFeedback,
  ProductNotFoundError,
} from "@/server/services/feedbacks";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { message: "Entre na sua conta para avaliar" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Corpo da requisição inválido" },
      { status: 400 },
    );
  }

  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Dados inválidos",
        errors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const { id } = await params;

  try {
    const feedback = await createFeedback(id, session.accountId, parsed.data);
    after(() => refreshAiSummary(id));
    return NextResponse.json({ id: feedback.id }, { status: 201 });
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    console.error("create feedback failed", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
