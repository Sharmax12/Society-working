import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export default {
  callbacks: {
    // Keep middleware session identity consistent with auth.ts and the header.
    // A token without a subject is not an authenticated user.
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
