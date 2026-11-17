export function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border bg-background"
    >
      <div className="aspect-[4/3] animate-pulse bg-muted motion-reduce:animate-none" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="h-4 w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted motion-reduce:animate-none" />
      </div>
    </div>
  );
}
