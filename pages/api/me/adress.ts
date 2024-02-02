import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "models/user";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";

async function updateUserAdress(
	req: NextApiRequest,
	res: NextApiResponse,
	token
) {
	const user = new User(token.userId);
	console.log(req.body);

	user.data.adress = req.body.adress;
	await user.push();
	res.send({ user: user.data });
}

const handler = method({
	patch: updateUserAdress,
});

export default authMiddleware(handler);
