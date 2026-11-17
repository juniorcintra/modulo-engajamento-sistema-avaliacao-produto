import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createProductSchema,
  listProductsQuerySchema,
} from "@/lib/schemas/product";
import {
  createProduct,
  InvalidCursorError,
  listProducts,
} from "@/server/services/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = listProductsQuerySchema.safeParse({
    limit: searchParams.get("limit") ?? undefined,
    cursor: searchParams.get("cursor") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Parâmetros inválidos",
        errors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await listProducts(parsed.data));
  } catch (error) {
    if (error instanceof InvalidCursorError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    console.error("list products failed", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

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

  const parsed = createProductSchema.safeParse(body);
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
    const { id } = await createProduct(parsed.data);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("create product failed", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
