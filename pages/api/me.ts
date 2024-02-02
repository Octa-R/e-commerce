import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "models/user";
import { authMiddleware } from "lib/middlewares";

async function handler(req: NextApiRequest, res: NextApiResponse, token) {
	console.log({ token });
	const user = new User(token.userId);
	await user.pull();

	res.send(token);
}

export default authMiddleware(handler);
