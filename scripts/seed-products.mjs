// Cadastra produtos de exemplo via POST /api/v1/products.
// Uso: node scripts/seed-products.mjs [quantidade] [urlBase]
const count = Number(process.argv[2] ?? 15);
const baseUrl = process.argv[3] ?? "http://localhost:3000";

for (let i = 1; i <= count; i++) {
  const response = await fetch(`${baseUrl}/api/v1/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `Produto de exemplo ${i}`,
      description: `Descrição curta do produto de exemplo número ${i}.`,
      link: `https://example.com/produtos/${i}`,
      image: `https://picsum.photos/seed/produto-${i}/640/480`,
    }),
  });
  console.log(i, response.status);
}
