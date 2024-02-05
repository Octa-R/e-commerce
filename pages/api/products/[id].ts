import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { getProductById } from "lib/airtable";

async function getProduct(req: NextApiRequest, res: NextApiResponse) {
	try {
		const product = await getProductById(req.query.id as string);

		res.send({ product });
	} catch (error) {
		if (error.statusCode === 404) {
			res.status(404).send(error);
		}

		res.status(400).send(error);
	}
}

const handler = method({
	get: getProduct,
});

export default handler;
