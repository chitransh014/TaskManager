export const cookieOptions = {
  httpOnly: true,
  secure: false, // change to true in production HTTPS
  sameSite: "lax" as const,
};
