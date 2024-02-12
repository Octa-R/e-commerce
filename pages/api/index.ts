import type { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // buscar la order
  // cambiar el estado a pago en firebase
  console.log("se ejecuto el webhook");
  res.send("api");
}
