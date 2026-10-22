import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Role } from "@prisma/client";

import authConfig from "./auth.config";
import { db } from "./lib/db";
import { isAllowedCollegeEmail } from "./modules/auth/college-email";
import { verifyPassword } from "./modules/auth/password";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user || !account || !user.email) return false;

      const email = user.email.trim().toLowerCase();

      // Enforce the same server-side college allowlist for every provider.
      // Registration checks this too, but sign-in must not rely on that path.
      if (!isAllowedCollegeEmail(email)) return false;

      // Credentials users have already passed the local password check.
      if (account.provider === "credentials") return true;

      // Only accept Google and require Google's verified-email claim before
      // attaching an OAuth identity to an account that may already exist.
      if (account.provider !== "google") return false;
      const googleProfile = profile as { email_verified?: unknown } | undefined;
      if (googleProfile?.email_verified !== true) return false;

      const existingUser = await db.user.findUnique({ where: { email } });

      if (!existingUser) {
        const newUser = await db.user.create({
          data: {
            email,
            name: user.name,
            image: user.image,
            accounts: {
              create: {
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          },
        });
        return Boolean(newUser);
      }

      const existingAccount = await db.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },
      });

      // Never reassign a provider identity that is already linked to another user.
      if (existingAccount && existingAccount.userId !== existingUser.id) return false;

      await db.user.update({
        where: { id: existingUser.id },
        data: {
          name: user.name ?? existingUser.name,
          image: user.image ?? existingUser.image,
        },
      });

      if (existingAccount) {
        // Remove tokens that may have been stored by an older version of the app.
        await db.account.update({
          where: { id: existingAccount.id },
          data: { refreshToken: null, accessToken: null, idToken: null },
        });
      } else {
        await db.account.create({
          data: {
            userId: existingUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        });
      }

      return true;
    },

    async jwt({ token }) {
      // Re-read the account whenever the session token is processed so that
      // demoted users do not keep a stale privileged role in their JWT.
      const existingUser = token.sub
        ? await db.user.findUnique({ where: { id: token.sub } })
        : token.email
          ? await db.user.findUnique({ where: { email: token.email } })
          : null;

      if (!existingUser) {
        token.role = "STUDENT";
        token.sub = undefined;
        return token;
      }

      token.sub = existingUser.id;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      return token;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 },
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      id: "credentials",
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@college.edu" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (
          !email ||
          !password ||
          email.length > 254 ||
          password.length > 128
        ) {
          return null;
        }

        // Apply shared rate limits before password verification to make
        // distributed credential-stuffing attempts expensive and bounded.
        try {
          const [ipLimit, emailLimit] = await Promise.all([
            consumeRateLimit("auth:signin:ip", getClientIp(request), 60, 15 * 60),
            consumeRateLimit("auth:signin:email", email, 10, 15 * 60),
          ]);
          if (!ipLimit.allowed || !emailLimit.allowed) return null;
        } catch {
          // Fail closed if the limiter table/database is unavailable.
          return null;
        }

        const user = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            passwordHash: true,
          },
        });

        if (!user?.passwordHash) return null;
        if (!(await verifyPassword(password, user.passwordHash))) return null;

        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
});
