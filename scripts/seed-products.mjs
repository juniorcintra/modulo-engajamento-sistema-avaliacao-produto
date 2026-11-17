// Cadastra produtos de exemplo via POST /api/v1/products.
// Uso: ADMIN_API_KEY=... node scripts/seed-products.mjs [quantidade] [urlBase]
const count = Number(process.argv[2] ?? 15);
const baseUrl = process.argv[3] ?? "http://localhost:3000";
const apiKey = process.env.ADMIN_API_KEY;

if (!apiKey) {
  console.error("Defina ADMIN_API_KEY");
  process.exit(1);
}

for (let i = 1; i <= count; i++) {
  const response = await fetch(`${baseUrl}/api/v1/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify({
      name: `Produto de exemplo ${i}`,
      description: `Descrição curta do produto de exemplo número ${i}.`,
      externalLink: `https://example.com/produtos/${i}`,
      imageUrl: `https://picsum.photos/seed/produto-${i}/640/480`,
    }),
  });
  console.log(i, response.status);
}
