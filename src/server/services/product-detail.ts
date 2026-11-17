import { getSupabase } from "@/server/db/supabase";

export type ProductDetail = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  externalLink: string;
  score: number;
};

export async function getProductById(
  id: string,
): Promise<ProductDetail | null> {
  const { data, error } = await getSupabase()
    .from("products")
    .select("id, name, description, image_url, external_link, score")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    imageUrl: data.image_url,
    externalLink: data.external_link,
    score: Number(data.score),
  };
}
