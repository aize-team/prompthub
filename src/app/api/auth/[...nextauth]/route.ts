import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID as string,
      clientSecret: process.env.KEYCLOAK_SECRET as string,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  // Add other NextAuth configurations as needed
  // session: { strategy: "jwt" }, // Example: Use JWT sessions
  // callbacks: { ... }, // Example: Define callbacks for customization
  // pages: { signIn: '/auth/signin' } // Example: Custom sign in page
});

export { handler as GET, handler as POST };
