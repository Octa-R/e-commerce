import { Auth } from "models/auth";
import { createPreference } from "lib/mercadopago";
import { authMiddleware, bodySchemaValidation } from "lib/middlewares";
import { Order } from "models/order";
import { User } from "models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { orderQuerySchema, orderBodySchema } from "schemas/order.schema";
import method from "micro-method-router";
import { getProductById } from "lib/airtable";

async function orderController(
	req: NextApiRequest,
	res: NextApiResponse,
	token
) {
	try {
		const auth = await Auth.findByEmail(token.email);

		if (!auth) {
			throw "usuario no encontrado";
		}

		const user = await User.findByEmail(token.email);
		if (!user) {
			throw new Error("usuario no encontrado");
		}

		//recuperar productos segun los id enviados
		const products = getProductById(req.body.items);

		//crear orden en nuestra bd
		const orderData = { payer: user.data, items: [{}] };
		const newOrder: Order = await Order.create(orderData);
		console.log(orderData);
		//crear preferencia en mp
		const response = await createPreference({
			...newOrder.data,
			id: newOrder.id,
			userId: token.userId,
		});

		res.send({ link_pago: response.sandbox_init_point });
	} catch (error) {
		console.log(error);
		res.send({ error });
	}
}

const schemaValidation = bodySchemaValidation(orderBodySchema, orderController);

const handler = method({
	post: schemaValidation,
});

export default authMiddleware(handler);
