import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

const axiosClient = axios.create({
    baseURL: process.env.API_URL,
    headers: { "Content-Type": "application/json" },
})

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials: any, req): Promise<any> {
        try {
          if (!credentials) {
            throw new Error("No Credentials");
          }

          if (!credentials.username || !credentials.password) {
            throw new Error("No Input");
          }

          const response = await axiosClient.post("/auth/login", { 
            username: String(credentials.username),
            password: String(credentials.password),
          })
          if (!response) {
            return null
          }

          const responseData = response.data

          return {
            username: credentials.username,
            accessToken: responseData.data.accessToken,
            refreshToken: responseData.data.refreshToken
          }
        //   return { id: credentials.username, name: credentials.username };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
        // Persist user data in token on login
        if (user) {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.username = user.username;
        }
        return token;
      },
    async session({ session, token }) {
        if (token) {
          session.user = token;
        }
        return session;
      },
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-in",
    error: "/sign-in",
  },
};
