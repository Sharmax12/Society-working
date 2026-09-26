export const publicRoutes = ["/"];

export const publicRoutes: string[] = [
   "/",
]

/**
 * Route prefixes that are accessible to the public.
 * Unlike `publicRoutes`, these match any path starting with the given
 * prefix (e.g. "/societies" also covers "/societies/abc123").
 * Used for indexable content pages — the *apply* flow under /apply
 * intentionally stays out of this list so it still requires sign-in.
 * @type {string[]}
 */

export const publicRoutePrefixes: string[] = [
   "/societies",
   "/events",
   "/Connect",
]

export const authRoutes = ["/auth/sign-in"];

export const protectedRoutes: string[] = [
    
    
]

export const DEFAULT_LOGIN_REDIRECT = "/";
