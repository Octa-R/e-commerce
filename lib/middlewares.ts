import { decode } from "lib/jwt";
import NextCors from "nextjs-cors";
import parseToken from "parse-bearer-token";
import { ZodSchema } from "zod";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

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
        return callback(req, res, decodedToken);
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
      const parsedBody = await schema.parse(req.body);
      return callback(req, res, token, parsedBody);
    } catch (error) {
      res.status(400).send(error);
    }
  };
}

export function withNextCors(handler: NextApiHandler): NextApiHandler {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    await NextCors(req, res, {
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      origin: "*",
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
    handler(req, res);
  };
}
