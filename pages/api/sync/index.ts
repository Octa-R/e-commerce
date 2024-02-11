import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { syncProducts } from "controllers/products";

async function sync(req: NextApiRequest, res: NextApiResponse) {
  const sync = await syncProducts();
  res.send({ sync });
}

const handler = method({
  post: sync,
});

export default handler;
