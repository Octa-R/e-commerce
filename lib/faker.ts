import { faker } from "@faker-js/faker/locale/es";
import { ProductData } from "types";

faker.seed(123);

export function createRandomProduct(): ProductData {
  return {
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    color: faker.color.human(),
    stock: faker.number.int(20),
    price: faker.number.float({
      min: 1000,
      max: 10000,
      fractionDigits: 2,
    }),
    active: true,
  };
}

export function createRandProductsList(n: number) {
  const products = [];
  for (let index = 0; index < n; index++) {
    products.push(createRandomProduct());
  }
  return products;
}
