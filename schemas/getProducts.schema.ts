import { z } from "zod";

const getProducts = z
	.object({
		limit: z.number().int().lte(20),
		offset: z.number().int(),
		q: z.string(),
	})
	.required();

export { getProducts };
