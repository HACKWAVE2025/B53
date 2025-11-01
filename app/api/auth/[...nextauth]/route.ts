import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Helpful runtime checks: NextAuth relies on NEXTAUTH_URL and NEXTAUTH_SECRET.
// Missing these will cause warnings and token decryption errors like the one
// you observed (JWEDecryptionFailed). We log clear guidance here.
if (!process.env.NEXTAUTH_SECRET) {
  console.warn(
    "[next-auth] WARNING: NEXTAUTH_SECRET is not set. Set a stable NEXTAUTH_SECRET in your .env to avoid JWT/session decryption errors. Example: NEXTAUTH_SECRET=$(openssl rand -hex 32)"
  );
}
if (!process.env.NEXTAUTH_URL) {
  console.warn(
    "[next-auth] WARNING: NEXTAUTH_URL is not set. Set NEXTAUTH_URL to your app's base URL (e.g. http://localhost:3000) to avoid warnings."
  );
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "email", type: "text", placeholder: "" },
        password: { label: "password", type: "password", placeholder: "" },
        name: { label: "name", type: "text", placeholder: "" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const email = credentials.username;
        const password = credentials.password;
        const name = (credentials as any)?.name;

        let user = await prisma.user.findUnique({ where: { email } });

        // If user doesn't exist, create one (simple signup-on-first-login flow)
        if (!user) {
          const hashed = await bcrypt.hash(password, 10);
          try {
            user = await prisma.user.create({
              data: {
                email,
                password: hashed,
                name: name || email.split("@")[0],
              },
            });
          } catch (err) {
            // creation failed (possible race/unique constraint); deny authorization
            return null;
          }
          return {
            id: user.id,
            name: user.name ?? undefined,
            email: user.email,
          };
        }

        // Existing user: verify password
        if (!user.password) return null;
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;
        return { id: user.id, name: user.name ?? undefined, email: user.email };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma as any),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.id = (user as any).id;
      return token;
    },
    async session({ session, token }: any) {
      if (session.user){
         session.user.id = token.id || token.sub;
      };
      return session;
    },
  },
  pages: {
    signIn: "/signin", // custom sign-in page
    newUser: "/dashboard", // redirect new users after signup
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
