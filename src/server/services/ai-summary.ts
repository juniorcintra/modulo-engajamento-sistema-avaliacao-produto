import { mastra } from "@/mastra";
import { getSupabase } from "@/server/db/supabase";

const MAX_FEEDBACKS = 200;
const MAX_COMMENT_LENGTH = 500;

const inFlight = new Map<string, Promise<void>>();

export function isAiSummaryConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function refreshAiSummary(productId: string) {
  if (!isAiSummaryConfigured()) return Promise.resolve();

  const running = inFlight.get(productId);
  if (running) return running;

  const task = generateAndSave(productId)
    .catch((error) => {
      console.error("ai summary failed", productId, error);
    })
    .finally(() => {
      inFlight.delete(productId);
    });
  inFlight.set(productId, task);
  return task;
}

async function generateAndSave(productId: string) {
  const supabase = getSupabase();

  const [{ data: product, error: productError }, { data, error, count }] =
    await Promise.all([
      supabase.from("products").select("name").eq("id", productId).single(),
      supabase
        .from("products_feedbacks")
        .select("score, comment", { count: "exact" })
        .eq("product_id", productId)
        .order("created_at", { ascending: false })
        .limit(MAX_FEEDBACKS),
    ]);
  if (productError) throw productError;
  if (error) throw error;
  if (!data?.length) return;

  const reviews = data
    .map(
      (row) =>
        `- Nota ${row.score}/5: ${row.comment.slice(0, MAX_COMMENT_LENGTH)}`,
    )
    .join("\n");

  const prompt = `Produto: ${product.name}\nTotal de avaliações: ${count ?? data.length}\n\n<avaliacoes>\n${reviews}\n</avaliacoes>\n\nEscreva o resumo geral das avaliações.`;

  const agent = mastra.getAgentById("review-summary-agent");
  const response = await agent.generate(prompt);
  const summary = response.text.trim();
  if (!summary) return;

  const { error: updateError } = await supabase
    .from("products")
    .update({
      ai_summary: summary,
      ai_summary_feedback_count: count ?? data.length,
      ai_summary_updated_at: new Date().toISOString(),
    })
    .eq("id", productId);
  if (updateError) throw updateError;
}
