import { Auth } from "models/auth";
import {
  authMiddleware,
  bodySchemaValidation,
  withNextCors,
} from "lib/middlewares";
import { User } from "models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { createNewOrder } from "controllers/orders";
import { OrderData } from "types";
import { orderSchema } from "schemas/order.schema";
import { PreferenceResponse } from "mercadopago/dist/clients/preference/commonTypes";

async function orderController(
  req: NextApiRequest,
  res: NextApiResponse,
  token: any,
  orderData: OrderData
) {
  try {
    const auth = await Auth.findByEmail(token.email);
    if (!auth) {
      throw "usuario no encontrado";
    }

    const user = await User.findByEmail(token.email);
    if (!user) {
      throw new Error("usuario no encontrado");
    }

    const response: PreferenceResponse = await createNewOrder({
      orderData: orderData,
      userData: { ...user.data, id: user.id },
    });

    // res.send({ link_pago: response.init_point });
    res.send({ response });
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
}

const schemaValidation = bodySchemaValidation(orderSchema, orderController);

const handler = method({
  post: schemaValidation,
});

const authMiddlewarePass = authMiddleware(handler);

export default withNextCors(authMiddlewarePass);
