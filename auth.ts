import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Role } from "@prisma/client";

import authConfig from "./auth.config";
import { db } from "./lib/db";
import { isAllowedCollegeEmail } from "./modules/auth/college-email";
import { verifyPassword } from "./modules/auth/password";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user || !account || !user.email) return false;

      const email = user.email.trim().toLowerCase();
      if (!isAllowedCollegeEmail(email)) return false;

      // Credential accounts must have completed email verification in authorize().
      if (account.provider === "credentials") return true;

      if (account.provider !== "google") return false;
      const googleProfile = profile as
        | { email?: unknown; email_verified?: unknown }
        | undefined;
      if (
        googleProfile?.email_verified !== true ||
        typeof googleProfile.email !== "string" ||
        googleProfile.email.trim().toLowerCase() !== email
      ) {
        return false;
      }

      const existingUser = await db.user.findUnique({ where: { email } });

      if (!existingUser) {
        const newUser = await db.user.create({
          data: {
            email,
            name: user.name,
            image: user.image,
            emailVerified: new Date(),
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

      if (existingAccount && existingAccount.userId !== existingUser.id) return false;

      // Do not let Google silently attach to a password account that has not
      // proved ownership of its email. The user can verify using the email link.
      if (!existingAccount && existingUser.passwordHash && !existingUser.emailVerified) {
        return false;
      }

      await db.user.update({
        where: { id: existingUser.id },
        data: {
          name: existingUser.name ?? user.name,
          image: existingUser.image ?? user.image,
          emailVerified: existingUser.emailVerified ?? new Date(),
        },
      });

      if (existingAccount) {
        // Google access/refresh tokens are not required for sign-in.
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

    async jwt({ token, user }) {
      // OAuth providers (such as Google) supply their own provider user ID.
      // HallwayLoop uses a separate internal User.id, so resolve by the
      // verified/canonical email first whenever a user just signed in or the
      // JWT contains an email. Then place HallwayLoop's own ID into token.sub.
      const emailToResolve =
        typeof user?.email === "string"
          ? user.email.trim().toLowerCase()
          : typeof token.email === "string"
            ? token.email.trim().toLowerCase()
            : null;

      const existingUser = emailToResolve
        ? await db.user.findUnique({ where: { email: emailToResolve } })
        : user?.id
          ? await db.user.findUnique({ where: { id: user.id } })
          : token.sub
            ? await db.user.findUnique({ where: { id: token.sub } })
            : null;

      if (!existingUser) {
        token.role = "STUDENT";
        token.sub = undefined;
        token.authVersion = undefined;
        return token;
      }

      // Initialize the version on sign-in; thereafter a password reset bumps
      // it, invalidating existing JWT sessions on their next use.
      if (user) {
        token.authVersion = existingUser.authVersion;
      } else if (token.authVersion !== existingUser.authVersion) {
        token.role = "STUDENT";
        token.sub = undefined;
        token.authVersion = undefined;
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

        if (!email || !password || email.length > 254 || password.length > 128) {
          return null;
        }
        if (!isAllowedCollegeEmail(email)) return null;

        try {
          const [ipLimit, emailLimit] = await Promise.all([
            consumeRateLimit("auth:signin:ip", getClientIp(request), 60, 15 * 60),
            consumeRateLimit("auth:signin:email", email, 10, 15 * 60),
          ]);
          if (!ipLimit.allowed || !emailLimit.allowed) return null;
        } catch {
          // Fail closed if the shared database-backed limiter is unavailable.
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
            emailVerified: true,
          },
        });

        if (!user?.passwordHash || !user.emailVerified) return null;
        if (!(await verifyPassword(password, user.passwordHash))) return null;

        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
});
