import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const ADMIN_EMAIL = "nahundeveloper@gmail.com";
const BACKEND_URL = process.env.BACKEND_URL || "https://petmatch-back-production.up.railway.app";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "google-idtoken",
      name: "Google",
      credentials: {
        idToken: { type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.idToken) return null;

        const res = await fetch(`${BACKEND_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: credentials.idToken }),
        });

        if (!res.ok) return null;

        const data = await res.json();
        const user = data.user;

        if (!user || user.email !== ADMIN_EMAIL) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.photo_url ?? null,
          backendToken: data.access_token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.backendToken = (user as typeof user & { backendToken: string }).backendToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.backendToken = token.backendToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
};
