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
  // Auth.js can expose an empty request auth object when there is no usable
  // session. Only an actual session user should bypass the route guard.
  const isLoggedIn = Boolean(req.auth?.user);

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
