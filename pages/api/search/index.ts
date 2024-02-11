import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { getAllProducts } from "lib/airtable";
import { z } from "zod";
import { searchProducts } from "lib/algolia";
import { AlgoliaProductData } from "../../../types/index";
import { withNextCors } from "lib/withCors";

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
    // busqueda en algolia
    const searchResponse = await searchProducts(q);
    // productos en la bd
    const products = await getAllProducts();

    const algoliaProductsId = searchResponse.hits.map((i: any) => i.productId);

    // filtramos los productos
    const filteredProducts = products.filter((prod) => {
      return algoliaProductsId.includes(prod.id);
    });

    const slicesdProducts = filteredProducts.slice(offset, limit);

    res.send({
      paging: {
        offset: offset,
        limit: limit,
        total: products.length,
      },
      products: slicesdProducts,
    });
  } catch (error) {
    res.status(400).send(error);
  }
}

const handler = method({
  get: getProducts,
});

export default withNextCors(handler);
