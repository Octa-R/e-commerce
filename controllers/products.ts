import { getAllProducts } from "lib/airtable";
import { saveOrUpdate } from "lib/algolia";
import { AlgoliaProductData } from "types";

export async function syncProducts() {
  // sincroniza los productos de la base de datos airtable con los de algolia
  const allProducts = await getAllProducts();
  const algoliaData: AlgoliaProductData[] = allProducts.map((p) => ({
    title: p.title,
    productId: p.id,
  }));
  const algoliaRes = await saveOrUpdate(algoliaData);
  console.log(algoliaRes);
  return algoliaRes;
}
