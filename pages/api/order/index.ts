import { Auth } from "models/auth";
import { authMiddleware, bodySchemaValidation } from "lib/middlewares";
import { User } from "models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { z } from "zod";
import { createNewOrder } from "controllers/orders";

const orderSchema = z
	.object({
		items: z
			.object({
				id: z.string().max(100).min(1),
				quantity: z.coerce.number().max(50).min(1),
			})
			.required()
			.strict()
			.array(),
	})
	.required()
	.strict();

type OrderData = z.infer<typeof orderSchema>;

async function orderController(
	req: NextApiRequest,
	res: NextApiResponse,
	token: any,
	orderData: OrderData
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

		console.log({ orderData, data: user.data });
		const response: any = await createNewOrder({
			items: orderData.items,
			userData: user.data,
		});
		//res.send({ link_pago: response.sandbox_init_point });

		res.send({ response });
	} catch (error) {
		console.log(error);
		res.send({ error });
	}
}

const schemaValidation = bodySchemaValidation(orderSchema, orderController);

const handler = method({
	post: schemaValidation,
});

export default authMiddleware(handler);
