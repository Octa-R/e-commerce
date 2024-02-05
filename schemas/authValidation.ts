import { z } from "zod";

const authSchema = z
	.object({
		email: z.string().email(),
	})
	.required();

export { authSchema };
