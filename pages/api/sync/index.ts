import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { syncProducts } from "controllers/products";
import parseToken from "parse-bearer-token";
async function sync(req: NextApiRequest, res: NextApiResponse) {
  const token = parseToken(req);
  if (token !== `${process.env.CRON_SECRET}`) {
    res.status(401).send("Unauthorized");
  }
  const sync = await syncProducts();
  res.send({ sync });
}

const handler = method({
  post: sync,
});

export default handler;
