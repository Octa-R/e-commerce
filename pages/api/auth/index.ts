import { sendCode } from "controllers/auth";
import type { NextApiRequest, NextApiResponse } from "next";
export default async function (req: NextApiRequest, res: NextApiResponse) {
	try {
		const data = await sendCode(req.body.email);
		res.send(data);
	} catch (error) {
		console.log(error);
		res.send({ error: error.message });
	}
}
