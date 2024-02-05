import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";

async function sync(req: NextApiRequest, res: NextApiResponse) {
	res.send({});
}

const handler = method({
	post: sync,
});

export default handler;
