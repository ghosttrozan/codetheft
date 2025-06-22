import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
          id: "credentials", // Fixed typo in "credentials"
          name: "Credentials", // Fixed typo
          credentials: {
            email: { label: "Email", type: "text", placeholder: "a@email.com" },
            password: { label: "Password", type: "password" } // Changed type to "password"
          },
          async authorize(credentials) {
            try {
              if (!credentials?.email || !credentials?.password) {
                throw new Error("Email and password are required");
              }
    
              const user = await prisma.user.findUnique({
                where: { email: credentials.email }
              });
    
              if (!user) {
                throw new Error("No user found with this email");
              }
    
              const isPasswordCorrect = await bcrypt.compare(
                credentials.password,
                user.password
              );
    
              if (!isPasswordCorrect) {
                throw new Error("Incorrect password");
              }
    
              return {
                id: user.id,
                email: user.email,
                name: user.name,
              };
            } catch (error) {
              if (error instanceof Error) {
                throw new Error(error.message);
              }
              throw new Error("Authentication failed");
            }
          }
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        GitHubProvider({
          clientId: process.env.GITHUB_ID as string,
          clientSecret: process.env.GITHUB_SECRET as string
        })
      ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id.toString()
                token.isVerified = user.isVerified
                token.name = user.name
            }
            return token
          },
        async session({ session, token }) {
            if(token){
                session.user.id = token.id
                session.user.isVerified = token.isVerified
            }
            return session
          }
    },
    session:{
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXT_AUTH_SECRET
}