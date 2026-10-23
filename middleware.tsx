import NextAuth from "next-auth";

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  publicApiRoutes,
  publicRoutes,
  publicRoutePrefixes,
  authRoutes,
} from "@/routes";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  // A session may retain an email/name even when its JWT subject was
  // invalidated. Match the header's identity check so stale tokens do not
  // redirect a visible Sign in link straight back to the homepage.
  const isLoggedIn = Boolean(req.auth?.user?.id);

  const isApiAuthRoute =
    nextUrl.pathname === apiAuthPrefix ||
    nextUrl.pathname.startsWith(`${apiAuthPrefix}/`);
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`),
  );
  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    publicRoutePrefixes.some(
      (prefix) => nextUrl.pathname === prefix || nextUrl.pathname.startsWith(`${prefix}/`),
    ) ||
    isPublicApiRoute;
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return null;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/sign-in", nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
