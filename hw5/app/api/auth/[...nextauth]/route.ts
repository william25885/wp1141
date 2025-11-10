import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { CustomPrismaAdapter } from "@/lib/adapter";

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "database",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // 確保用戶和帳號資訊存在
      if (!user || !account) {
        return false;
      }
      // 允許每個 OAuth provider 建立獨立帳號
      return true;
    },
    async redirect({ url, baseUrl }) {
      // 確保重定向到正確的 URL
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, user }) {
      // 確保 session 包含用戶資訊
      if (session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
