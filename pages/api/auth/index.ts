import { sendCode } from "controllers/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { authSchema } from "schemas/authValidation";
export default async function (req: NextApiRequest, res: NextApiResponse) {
	try {
		authSchema.parse(req.body);
		const data = await sendCode(req.body.email);
		res.send(data);
	} catch (error) {
		res.status(400).send(error);
	}
}
