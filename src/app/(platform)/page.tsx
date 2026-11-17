export default function Home() {
  return (
    <section className="grid gap-8">
      <h1 className="font-display text-4xl font-bold tracking-tight">
        Produtos
      </h1>
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-hidden="true"
      >
        {["a", "b", "c", "d", "e", "f"].map((id) => (
          <div
            key={id}
            className="grid gap-3 rounded-2xl border border-border p-4"
          >
            <div className="h-32 rounded-xl bg-muted motion-safe:animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-muted motion-safe:animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-muted motion-safe:animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}
