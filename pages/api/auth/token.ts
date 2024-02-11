import { Auth } from "models/auth";
import { User } from "models/user";
import { generate } from "lib/jwt";
import { isAfter } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { code, email } = req.body;
    const auth = await Auth.findByEmail(email);

    if (Number(auth.data.code) !== Number(code)) {
      throw new Error("código no válido");
    }
    const now = new Date().toUTCString();
    const expiresDate = auth.data.expires;

    if (isAfter(now, expiresDate)) {
      throw new Error("código expirado");
    }

    const user = new User(auth.data.userId);
    await user.pull();
    auth.data.code = "";
    auth.push();
    const token = generate({ ...user.data, userId: user.id });
    res.send({ token });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}
