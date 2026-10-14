export const publicRoutes = [
  "/",
  "/about",
  "/faq",
  "/for-societies",
  "/for-colleges",
  "/privacy",
  "/terms",
  "/llms.txt",
  "/robots.txt",
  "/sitemap.xml",
];

export const publicRoutePrefixes = [
  "/societies",
  "/events",
];

// Public authentication pages must be reachable before a user has a session.
export const authRoutes = ["/auth/sign-in", "/auth/register"];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/";
