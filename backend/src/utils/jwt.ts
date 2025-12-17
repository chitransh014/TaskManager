import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Ensure expiresIn always matches JWT expected type
const expiresIn: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "7d";

export const generateToken = (userId: string) => {
  const options: SignOptions = { expiresIn };

  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    options
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
;
