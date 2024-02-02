// hello_algolia.js
import algoliasearch from "algoliasearch";

// Connect and authenticate with your Algolia app
const client = algoliasearch(
	process.env.ALGOLIA_APP_ID,
	process.env.ALGOLIA_API_KEY
);

// Create a new index and add a record
const index = client.initIndex("products");
//const record = { objectID: 1, name: "test_record" };
//index.saveObject(record).wait();

// Search the index and print the results
//index.search("test_record").then(({ hits }) => console.log(hits[0]));
