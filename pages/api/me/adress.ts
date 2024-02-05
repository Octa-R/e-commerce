import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "models/user";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";

async function updateUserAdress(
	req: NextApiRequest,
	res: NextApiResponse,
	token
) {
	try {
		const user = new User(token.userId);
		await user.pull();
		user.data.adress = req.body.adress;
		await user.push();
		res.send({ user: user.data });
	} catch (error) {
		res.send({ error });
	}
}

const handler = method({
	patch: updateUserAdress,
});

export default authMiddleware(handler);
