import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "models/user";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";
async function getUserInfo(req: NextApiRequest, res: NextApiResponse, token) {
	const user = new User(token.userId);
	await user.pull();

	res.send(token);
}
async function updateUserInfo(
	req: NextApiRequest,
	res: NextApiResponse,
	token
) {
	const user = new User(token.userId);
	user.data = { ...req.body };
	await user.push();
	res.send({ user: user.data });
}

const handler = method({
	get: getUserInfo,
	patch: updateUserInfo,
});

export default authMiddleware(handler);
