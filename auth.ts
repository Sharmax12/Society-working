import NextAuth from "next-auth";

import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getUserById } from "./modules/auth/actions";

function normalizeSessionState(value: unknown): string | null {
  if (value == null) return null;
  return typeof value === "string" ? value : JSON.stringify(value);
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      if (!user || !account || !user.email) return false;

      const sessionState = normalizeSessionState(account.session_state);

      const existingUser = await db.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        const newUser = await db.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            accounts: {
              create: {
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refreshToken: account.refresh_token,
                accessToken: account.access_token,
                expiresAt: account.expires_at,
                tokenType: account.token_type,
                scope: account.scope,
                idToken: account.id_token,
                sessionState,
              },
            },
          },
        });

        return Boolean(newUser);
      }

      await db.user.update({
        where: { id: existingUser.id },
        data: {
          name: user.name ?? existingUser.name,
          image: user.image ?? existingUser.image,
        },
      });

      const existingAccount = await db.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },
      });

      if (!existingAccount) {
        await db.account.create({
          data: {
            userId: existingUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refreshToken: account.refresh_token,
            accessToken: account.access_token,
            expiresAt: account.expires_at,
            tokenType: account.token_type,
            scope: account.scope,
            idToken: account.id_token,
            sessionState,
          },
        });
      }

      return true;
    },

    async jwt({ token, trigger }) {
      // The token already carries everything we need after the first
      // pass, so only hit the database on sign-in / explicit refresh
      // instead of on every request that calls auth(). This avoids
      // 2-3 extra DB round trips per page load across the whole app.
      if (token.role && trigger !== "update") return token;

      const existingUser =
        (token.sub ? await getUserById(token.sub) : null) ??
        (token.email ? await db.user.findUnique({ where: { email: token.email } }) : null);
      if (!existingUser) return token;

      token.sub = existingUser.id;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;

      return token;
    },

    async session({ session, token }) {
      // Reuse what the jwt callback already resolved instead of
      // re-fetching the user from the database on every session read.
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  ...authConfig,
});
