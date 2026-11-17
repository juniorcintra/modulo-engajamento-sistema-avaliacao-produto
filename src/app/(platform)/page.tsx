import { ProductFeed } from "@/components/products/product-feed";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Produtos
        </h1>
        <p className="mt-2 text-muted-foreground">
          Veja o que a comunidade está avaliando e descubra o próximo favorito.
        </p>
      </header>
      <ProductFeed />
    </main>
  );
}
