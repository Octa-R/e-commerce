import { Auth } from "models/auth";
import { User } from "models/user";
import gen from "random-seed";
const random = gen.create("asdasd");
import { addMinutes } from "date-fns";
import { sendEmail } from "lib/sendgrid";
import { faker } from "@faker-js/faker";

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
  auth.data.code = faker.number.int({ min: 10000, max: 99999 });

  auth.data.expires = expires;
  await auth.push();
  sendEmail({
    to: auth.data.email, // Change to your recipient
    from: "ruarteoctavio8@gmail.com", // Change to your verified sender
    subject: "codigo",
    text: `codigo: ${auth.data.code}`,
  });
  return auth.data;
}
