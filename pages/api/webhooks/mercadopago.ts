import { getMerchantOrder } from "lib/mercadopago";
import { Order } from "models/order";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;
  try {
    if (topic == "merchant_order") {
      const orderData = await getMerchantOrder(id as string);
      if (orderData.order_status === "paid") {
        console.log(
          "el estatus de la orden es pago",
          orderData.external_reference
        );
        await Order.setPaidStatus(orderData.external_reference);
      }
    }
    if (topic === "payment") {
      console.log("es un payment");
    }
    res.send({ ok: "ok" });
  } catch (error) {
    res.send({ error });
  }
}
