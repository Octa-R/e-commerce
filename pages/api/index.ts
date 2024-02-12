import type { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;
  // buscar la order
  // cambiar el estado a pago en firebase
  console.log("se ejecuto el webhook");
  res.send("api");
}
