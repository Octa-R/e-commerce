import { Auth } from "models/auth";
import { createPreference } from "lib/mercadopago";
import { authMiddleware } from "lib/middlewares";
import { Order } from "models/order";
import { User } from "models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
	const { productId } = req.query;
	try {
		const auth = await Auth.findByEmail(token.email);
		if (!auth) {
			throw new Error("usuario no encontrado");
		}

		const user = await User.findByEmail(token.email);
		if (!user) {
			throw new Error("usuario no encontrado");
		}
		//crear orden en nuestra bd
		const orderData = { items: req.body.items, payer: user.data };
		const newOrder: Order = await Order.create(orderData);
		//crear preferencia en mp
		const response = await createPreference({
			...newOrder.data,
			id: newOrder.id,
			userId: token.userId,
		});

		res.send({ link_pago: response.sandbox_init_point });
	} catch (error) {
		res.send({ error });
	}
}

const handler = method({
	post: postHandler,
});

export default authMiddleware(handler);
