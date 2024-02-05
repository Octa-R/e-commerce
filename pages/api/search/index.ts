import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { getAllProducts } from "lib/airtable";
import { z } from "zod";

const searchSchema = z
	.object({
		limit: z.coerce.number().int().lte(20).catch(20),
		offset: z.coerce.number().int().lte(200).catch(0),
		q: z.coerce.string().max(200),
	})
	.required();

async function getProducts(req: NextApiRequest, res: NextApiResponse) {
	try {
		const parsedQueryParams = searchSchema.parse(req.query);

		const { q, offset, limit } = parsedQueryParams;
		/*
		const parsedLimit = numLimit > 0 && numLimit < 50 ? numLimit : 20;
		const parsedOffset = numOffset < 200 && numOffset > 0 ? numOffset : 0;
    */
		//const products = createRandProductsList(200);
		const products = await getAllProducts();
		res.send({
			paging: {
				offset: offset,
				limit: limit,
				total: products.length,
			},
			products: products.slice(offset, limit),
		});
	} catch (error) {
		res.status(400).send(error);
	}
}

const handler = method({
	get: getProducts,
});

export default handler;
