import jwt, { SignOptions } from "jsonwebtoken";

export const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET as string;
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as string | number,
  };
  return jwt.sign({ id: userId }, secret, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
