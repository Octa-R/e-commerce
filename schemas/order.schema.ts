import { z } from "zod";

export const orderSchema = z
  .object({
    items: z
      .object({
        id: z.string().max(100).min(1),
        quantity: z.coerce.number().max(50).min(1),
      })
      .required()
      .strict()
      .array(),
  })
  .required()
  .strict();
