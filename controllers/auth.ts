import { Auth } from "models/auth";
import { User } from "models/user";
import gen from "random-seed";
const random = gen.create("asdasd");
import { addMinutes } from "date-fns";
import { sendEmail, sgMail } from "lib/sendgrid";

export async function findOrCreateAuth(email: string): Promise<Auth> {
	const auth = await Auth.findByEmail(email);
	if (auth) {
		return auth;
	}
	const newUser = await User.create({ email });
	await newUser.push();

	const newAuth = await Auth.create({
		email,
		userId: newUser.id,
		code: "",
		expires: "",
	});
	return newAuth;
}

export async function sendCode(email: string) {
	const auth = await findOrCreateAuth(email);
	const now = new Date();
	const expires = addMinutes(now, 20).toUTCString();
	auth.data.code = random.intBetween(10000, 99999);
	auth.data.expires = expires;
	await auth.push();
	sendEmail({
		to: auth.data.email, // Change to your recipient
		from: "ruarteoctavio8@gmail.com", // Change to your verified sender
		subject: "codigo",
		text: `codigo: ${auth.data.code}`,
		html: "<strong>and easy to do anywhere, even with Node.js</strong>",
	});
	return auth.data;
}
