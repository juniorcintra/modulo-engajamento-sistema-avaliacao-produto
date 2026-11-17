import { z } from "zod";

const httpUrl = z
  .url({ protocol: /^https?$/, message: "Informe uma URL http(s) válida" })
  .trim();

export const createProductSchema = z
  .object({
    name: z.string().trim().min(1, "Informe o nome").max(150),
    description: z.string().trim().max(1000).optional(),
    link: httpUrl,
    image: httpUrl,
  })
  .transform(({ link, image, ...rest }) => ({
    ...rest,
    externalLink: link,
    imageUrl: image,
  }));

export const listProductsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(12),
  cursor: z.string().min(1).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export type Product = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  externalLink: string;
  score: number;
  createdAt: string;
};

export type ProductsPage = {
  items: Product[];
  nextCursor: string | null;
};
