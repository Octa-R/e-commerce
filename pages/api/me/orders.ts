import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { z } from "zod";
import { getUserOrders } from "controllers/orders";
import { authMiddleware } from "lib/middlewares";

async function getOrders(req: NextApiRequest, res: NextApiResponse, token) {
  try {
    const userOrders = await getUserOrders(token.userId);
    res.send({ userOrders });
  } catch (error) {
    res.status(400).send(error);
  }
}

const handler = method({
  get: getOrders,
});

export default authMiddleware(handler);
