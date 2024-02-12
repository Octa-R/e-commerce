import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { getMerchantOrder } from "lib/mercadopago";
import { MerchantOrderResponse } from "mercadopago/dist/clients/merchantOrder/commonTypes";
import { pick } from "lodash";

async function getOrder(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { orderId } = req.query;
    const orderData: MerchantOrderResponse = await getMerchantOrder(
      orderId as string
    );
    const orderResponse = pick(orderData, [
      "payments",
      "id",
      "status",
      "items",
      "order_status",
    ]);
    res.send({ orderData: orderResponse });
  } catch (error) {
    res.send(error);
  }
}

const handler = method({
  get: getOrder,
});

export default handler;
