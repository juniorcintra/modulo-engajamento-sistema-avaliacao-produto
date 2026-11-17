import { nanoid } from "nanoid";
import type {
  CreateProductInput,
  Product,
  ProductsPage,
} from "@/lib/schemas/product";
import { getSupabase } from "@/server/db/supabase";

const COLUMNS =
  "id, name, description, image_url, external_link, score, created_at";

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  external_link: string;
  score: number | string;
  created_at: string;
};

type Cursor = { createdAt: string; id: string };

export class InvalidCursorError extends Error {
  constructor() {
    super("Cursor inválido");
  }
}

function encodeCursor(cursor: Cursor) {
  return Buffer.from(JSON.stringify(cursor)).toString("base64url");
}

function decodeCursor(value: string): Cursor {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString());
    if (
      typeof parsed?.id === "string" &&
      typeof parsed?.createdAt === "string" &&
      !Number.isNaN(Date.parse(parsed.createdAt))
    ) {
      return { createdAt: parsed.createdAt, id: parsed.id };
    }
  } catch {}
  throw new InvalidCursorError();
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    externalLink: row.external_link,
    score: Number(row.score),
    createdAt: row.created_at,
  };
}

export async function listProducts(params: {
  limit: number;
  cursor?: string;
}): Promise<ProductsPage> {
  let query = getSupabase()
    .from("products")
    .select(COLUMNS)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(params.limit + 1);

  if (params.cursor) {
    const { createdAt, id } = decodeCursor(params.cursor);
    const ts = JSON.stringify(createdAt);
    query = query.or(
      `created_at.lt.${ts},and(created_at.eq.${ts},id.lt.${JSON.stringify(id)})`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data ?? []) as ProductRow[];
  const hasMore = rows.length > params.limit;
  const page = hasMore ? rows.slice(0, params.limit) : rows;
  const last = page[page.length - 1];

  return {
    items: page.map(toProduct),
    nextCursor:
      hasMore && last
        ? encodeCursor({ createdAt: last.created_at, id: last.id })
        : null,
  };
}

export async function createProduct(input: CreateProductInput) {
  const id = nanoid();

  const { error } = await getSupabase()
    .from("products")
    .insert({
      id,
      name: input.name,
      description: input.description || null,
      image_url: input.imageUrl,
      external_link: input.externalLink,
    });

  if (error) throw error;
  return { id };
}
