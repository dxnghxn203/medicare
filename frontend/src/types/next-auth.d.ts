import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extending the built-in Session type
   */
  interface Session {
    accessToken?: string;
    appToken?: string;
    user: {
      id?: string;
    } & DefaultSession["user"];
  }

  /**
   * Extending the built-in User type
   */
  interface User {
    id?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extending the built-in JWT type
   */
  interface JWT {
    accessToken?: string;
    userId?: string;
    appToken?: string;
  }
}
