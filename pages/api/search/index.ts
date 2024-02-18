import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { getAllProducts } from "lib/airtable";
import { z } from "zod";
import { searchProducts } from "lib/algolia";
import { withNextCors } from "lib/middlewares";

const searchSchema = z
  .object({
    limit: z.coerce.number().int().lte(20).catch(20),
    offset: z.coerce.number().int().lte(200).catch(0),
    q: z.coerce.string().max(200),
  })
  .required();

async function getProducts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsedQueryParams = searchSchema.parse(req.query);
    const { q, offset, limit } = parsedQueryParams;
    // Busqueda en algolia y obtención de productos en la bd de manera concurrente
    const [searchResponse, products] = await Promise.all([
      searchProducts(q),
      getAllProducts(),
    ]);

    const algoliaProductsId = new Set(
      searchResponse.hits.map((i: any) => i.productId)
    );

    // Filtramos y cortamos los productos
    const slicedProducts = products
      .filter((prod) => algoliaProductsId.has(prod.id))
      .slice(offset, limit);

    // Determinar el límite final
    const finalLimit = Math.min(limit, products.length);

    res.send({
      paging: {
        offset: offset,
        limit: finalLimit,
        total: products.length,
      },
      products: slicedProducts,
    });
  } catch (error) {
    res.status(400).send(error);
  }
}

const handler = method({
  get: getProducts,
});

export default withNextCors(handler);
