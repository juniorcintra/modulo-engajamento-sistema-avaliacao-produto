import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeedbackList } from "@/components/products/feedback-list";
import { FeedbackSection } from "@/components/products/feedback-section";
import { ProductDetail } from "@/components/products/product-detail";
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

  return (
    <div className="grid gap-12">
      <ProductDetail product={product} feedbackCount={feedbacks.length} />
      <FeedbackList feedbacks={feedbacks} />
      <FeedbackSection productId={id} />
    </div>
  );
}
