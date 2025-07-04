import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Read admin credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Security check to ensure environment variables are set
        if (!adminEmail || !adminPassword) {
          console.error("Admin credentials are not set in the environment variables.");
          return null;
        }

        // Compare submitted credentials with secure environment variables
        if (credentials?.email === adminEmail && credentials?.password === adminPassword) {
          return { id: "1", name: "Admin User", email: adminEmail };
        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
