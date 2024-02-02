import { getMerchantOrder } from "lib/mercadopago";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { id, topic } = req.query;

	if (topic == "merchant_order") {
		const order = await getMerchantOrder(String(id));
		console.log(order);
		res.send({ ok: "ok" });
	} else {
		res.send({ ok: "no" });
	}
}
