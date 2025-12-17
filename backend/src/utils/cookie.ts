export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" || process.env.FRONTEND_URL?.includes("https"),
  sameSite: (process.env.NODE_ENV === "production" || process.env.FRONTEND_URL?.includes("https")) ? "none" as const : "lax" as const,
};
