import { z } from "zod";

const orderBodySchema = z
	.object({
		items: z
			.array(z.object({ id: z.string(), quantity: z.number() }))
			.nonempty(),
	})
	.required();

const orderQuerySchema = z.string();

export { orderQuerySchema, orderBodySchema };
