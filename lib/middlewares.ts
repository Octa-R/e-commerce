import { decode } from "lib/jwt";
import type { NextApiRequest, NextApiResponse } from "next";
import parseToken from "parse-bearer-token";
import { ZodSchema } from "zod";
export function authMiddleware(callback) {
  return function (req: NextApiRequest, res: NextApiResponse) {
    try {
      //busca el token en el header
      const token = parseToken(req);
      if (!token) {
        //si no hay token retorna aca
        res.status(401).send({ message: "no hay token" });
      }
      //decodifica el token, y verifica que pertenesca a este servidor
      const decodedToken = decode(token);
      if (decodedToken) {
        callback(req, res, decodedToken);
      } else {
        res.status(401).send({ message: "token incorrecto" });
      }
    } catch (error) {
      res.status(400).send({ message: "error de token" });
    }
  };
}

export function bodySchemaValidation(schema: ZodSchema, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse, token) {
    try {
      console.log("bodySchemaBalidator", req.body);
      const parsedBody = await schema.parse(req.body);
      callback(req, res, token, parsedBody);
    } catch (error) {
      res.status(400).send(error);
    }
  };
}
