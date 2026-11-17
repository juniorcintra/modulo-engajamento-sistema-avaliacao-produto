import { nanoid } from "nanoid";
import type { FeedbackInput } from "@/lib/schemas/feedback";
import { getSupabase } from "@/server/db/supabase";
import { getProductById } from "@/server/services/product-detail";

export class ProductNotFoundError extends Error {
  constructor() {
    super("Produto não encontrado");
  }
}

export type Feedback = {
  id: string;
  score: number;
  comment: string;
  createdAt: string;
  authorName: string;
  authorSeed: string;
};

export async function listFeedbacks(productId: string): Promise<Feedback[]> {
  const { data, error } = await getSupabase()
    .from("products_feedbacks")
    .select(
      "id, score, comment, created_at, author:accounts!created_by(id, first_name, last_name)",
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const author = Array.isArray(row.author) ? row.author[0] : row.author;
    const first = author?.first_name ?? "Pessoa";
    const initial = author?.last_name?.trim().charAt(0).toUpperCase();
    return {
      id: row.id,
      score: row.score,
      comment: row.comment,
      createdAt: row.created_at,
      authorName: initial ? `${first} ${initial}.` : first,
      authorSeed: author?.id ?? row.id,
    };
  });
}

export async function createFeedback(
  productId: string,
  accountId: string,
  input: FeedbackInput,
) {
  const product = await getProductById(productId);
  if (!product) throw new ProductNotFoundError();

  const supabase = getSupabase();
  const id = nanoid();

  const { error } = await supabase.from("products_feedbacks").insert({
    id,
    score: input.score,
    comment: input.comment,
    created_by: accountId,
    product_id: productId,
  });
  if (error) throw error;

  await refreshProductScore(productId);

  return { id };
}

async function refreshProductScore(productId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products_feedbacks")
    .select("score")
    .eq("product_id", productId);
  if (error) throw error;
  if (!data?.length) return;

  const average = data.reduce((sum, row) => sum + row.score, 0) / data.length;
  const { error: updateError } = await supabase
    .from("products")
    .update({
      score: Math.round(average * 10) / 10,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);
  if (updateError) throw updateError;
}
