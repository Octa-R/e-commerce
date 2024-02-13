import { Auth } from "models/auth";
import { User } from "models/user";
import gen from "random-seed";
const random = gen.create();
import { addMinutes } from "date-fns";
import { sendEmail } from "lib/mailslurp";

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
  console.log("sendcode");
  const auth = await findOrCreateAuth(email);
  const now = new Date();
  const expires = addMinutes(now, 20).toUTCString();
  auth.data.code = random.intBetween(111111, 999999);

  auth.data.expires = expires;
  await auth.push();
  await sendEmail({
    emailTo: auth.data.email,
    subject: "codigo",
    body: `codigo: ${auth.data.code}`,
  });
  return auth.data;
}
