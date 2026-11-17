import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { AiSummary } from "@/components/products/ai-summary";
import { FeedbackList } from "@/components/products/feedback-list";
import { FeedbackSection } from "@/components/products/feedback-section";
import { ProductDetail } from "@/components/products/product-detail";
import {
  isAiSummaryConfigured,
  refreshAiSummary,
} from "@/server/services/ai-summary";
import { listFeedbacks } from "@/server/services/feedbacks";
import { getProductById } from "@/server/services/product-detail";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  return { title: product?.name ?? "Produto não encontrado" };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const feedbacks = await listFeedbacks(id);
  const aiEnabled = isAiSummaryConfigured();
  const summaryStale =
    feedbacks.length > 0 &&
    (!product.aiSummary || product.aiSummaryFeedbackCount !== feedbacks.length);
  if (aiEnabled && summaryStale) after(() => refreshAiSummary(id));

  return (
    <div className="grid gap-12">
      <ProductDetail product={product} feedbackCount={feedbacks.length} />
      {aiEnabled && (
        <AiSummary
          summary={product.aiSummary}
          feedbackCount={feedbacks.length}
          updatedAt={product.aiSummaryUpdatedAt}
        />
      )}
      <FeedbackList feedbacks={feedbacks} />
      <FeedbackSection productId={id} />
    </div>
  );
}
