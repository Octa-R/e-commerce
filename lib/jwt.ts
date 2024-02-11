import jwt from "jsonwebtoken";

export function generate(data: any) {
  return jwt.sign(data, process.env.JWT_SECRET);
}

export function decode(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
