"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { ProductCard } from "@/components/products/product-card";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { Button } from "@/components/ui/button";
import type { ProductsPage } from "@/lib/schemas/product";

const PAGE_SIZE = 12;

async function fetchPage(cursor: string | null): Promise<ProductsPage> {
  const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
  if (cursor) params.set("cursor", cursor);
  const response = await fetch(`/api/v1/products?${params}`);
  if (!response.ok) throw new Error("Falha ao carregar produtos");
  return response.json();
}

const GRID = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

function SkeletonGrid({ count }: { count: number }) {
  return (
    <div className={GRID}>
      {Array.from({ length: count }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: lista estática de placeholders
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductFeed() {
  const {
    data,
    error,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
  });

  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !hasNextPage || isFetchingNextPage || error) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage();
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, error]);

  if (isPending) return <SkeletonGrid count={8} />;

  const products = data?.pages.flatMap((page) => page.items) ?? [];

  if (error && products.length === 0) {
    return (
      <div role="alert" className="flex flex-col items-center gap-4 py-16">
        <p className="text-muted-foreground">
          Não foi possível carregar os produtos.
        </p>
        <Button onClick={() => refetch()}>Tentar de novo</Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        Ainda não há produtos.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className={GRID}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {isFetchingNextPage ? <SkeletonGrid count={4} /> : null}

      {error ? (
        <div role="alert" className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Falha ao carregar mais produtos.
          </p>
          <Button variant="outline" onClick={() => fetchNextPage()}>
            Tentar de novo
          </Button>
        </div>
      ) : null}

      {hasNextPage ? (
        <div ref={sentinel} aria-hidden="true" className="h-1" />
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Você chegou ao fim da lista.
        </p>
      )}
    </div>
  );
}
