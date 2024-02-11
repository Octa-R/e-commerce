import Airtable, { Record, RecordData, FieldSet, Table } from "airtable";
import { ProductData } from "types";

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(
  "appkpvrMRUQzadmIV"
);

function parseAirTableData(record: Record<FieldSet>): ProductData {
  return {
    id: record.id,
    title: record.get("title") as string,
    price: record.get("price") as number,
    color: record.get("color") as string,
    stock: record.get("stock") as number,
    active: record.get("active") as boolean,
  };
}

export async function getProductById(id: string): Promise<ProductData> {
  const record = await base("Productos").find(id);
  return parseAirTableData(record);
}

export async function updateproducts(items): Promise<ProductData[]> {
  const updatedProducts = [];
  for (const item of items) {
    const response = await base("Productos").find(item.id);
    const airtableProduct = parseAirTableData(response);
    const newStock = airtableProduct.stock - item.quantity;
    const product = await base("Productos").update(item.id, {
      stock: newStock,
    });
    updatedProducts.push(product);
  }
  return updatedProducts;
}

export async function getAllProducts(params?: {
  filter?: { products: any[] };
}): Promise<ProductData[]> {
  const response = await base("Productos")
    .select({
      maxRecords: 200,
      view: "Grid view",
    })
    .all();

  const parsedProducts = response.map((record) => parseAirTableData(record));

  if (params?.filter) {
    const id_array = params.filter.products.map((p) => p.id);
    return parsedProducts.filter((product) => id_array.includes(product.id));
  } else {
    return parsedProducts;
  }
}
