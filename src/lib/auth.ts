import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
  households,
  profiles,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "MapleTrack <noreply@mapletrack.app>",
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/login?verify=true",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;

        // Fetch user with household info
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, user.id!),
        });

        if (dbUser) {
          token.householdId = dbUser.householdId;
          token.onboardingCompleted = dbUser.onboardingCompleted;
          token.role = dbUser.role;
        }
      }

      // Refresh token data on update trigger
      if (trigger === "update" && token.id) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, token.id as string),
        });
        if (dbUser) {
          token.householdId = dbUser.householdId;
          token.onboardingCompleted = dbUser.onboardingCompleted;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.householdId = token.householdId as string | null;
        session.user.onboardingCompleted =
          token.onboardingCompleted as boolean;
        session.user.role = token.role as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      // On first sign in, create household + profile automatically
      if (user.id && account) {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.id, user.id),
        });

        if (existingUser && !existingUser.householdId) {
          // Create household for the user
          const [household] = await db
            .insert(households)
            .values({
              name: user.name
                ? `Família ${user.name.split(" ").pop()}`
                : "Minha Família",
            })
            .returning();

          // Update user with householdId
          await db
            .update(users)
            .set({ householdId: household.id })
            .where(eq(users.id, user.id));

          // Create initial profile
          const nameParts = (user.name || "").split(" ");
          await db.insert(profiles).values({
            userId: user.id,
            householdId: household.id,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            isPrimaryApplicant: true,
          });
        }
      }

      return true;
    },
  },
  events: {
    async createUser({ user }) {
      // User created by adapter — household/profile creation is in signIn callback
      console.log(`[Auth] New user created: ${user.email}`);
    },
  },
});
