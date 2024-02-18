import { sendCode } from "controllers/auth";
import { withNextCors } from "lib/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { authSchema } from "schemas/authValidation";
import method from "micro-method-router";

async function authHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    authSchema.parse(req.body);
    const data = await sendCode(req.body.email);
    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
}

const handler = method({
  post: authHandler,
});

export default withNextCors(handler);
