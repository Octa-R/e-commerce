// hello_algolia.js
import algoliasearch from "algoliasearch";
import { AlgoliaProductData } from "types";

// Connect and authenticate with your Algolia app
const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);

// Create a new index and add a record
const productsIndex = client.initIndex("products");

export async function searchProducts(query: string) {
  return await productsIndex.search(query);
}

export async function saveOrUpdate(objects: AlgoliaProductData[]) {
  // si el objeto tiene objectID se updatea sino se crea
  return await productsIndex.saveObjects(objects, {
    autoGenerateObjectIDIfNotExist: true,
  });
}
//const record = { objectID: 1, name: "test_record" };
//index.saveObject(record).wait();

// Search the index and print the results
//index.search("test_record").then(({ hits }) => console.log(hits[0]));
