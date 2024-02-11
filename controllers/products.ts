import { getAllProducts } from "lib/airtable";
import { getAllAlgoliaObjects, productsBatch, saveOrUpdate } from "lib/algolia";
export async function syncProducts() {
  // sincroniza los productos de la base de datos airtable con los de algolia
  const allProducts = await getAllProducts();
  const { hits: algoliaProducts } = await getAllAlgoliaObjects();

  const algoliaBatchList = allProducts
    .map((p) => {
      // product de algolia que corresponde al producto actual de airtable
      const algoliaFindedProduct = algoliaProducts.find(
        (ap: any) => ap.productId === p.id
      );

      if (algoliaFindedProduct) {
        if (p.stock === 0) {
          return {
            action: "deleteObject",
            body: {
              objectID: algoliaFindedProduct.objectID,
            },
          };
        }
      }

      // si no existe en algolia
      if (!algoliaFindedProduct && p.stock > 0) {
        return {
          action: "addObject",
          body: {
            title: p.title,
            productId: p.id,
          },
        };
      }
    })
    // elimina los undefined
    .filter((p) => p);

  const algoliaRes = await productsBatch(algoliaBatchList);
  return algoliaRes;
}
