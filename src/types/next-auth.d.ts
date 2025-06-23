import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extended User type for your application
   */
  interface User extends DefaultUser {
    id: string;
    isVerified?: boolean;
    name?: string | null;
    // Add any other custom fields from your User model
  }

  /**
   * Extended Session type
   */
  interface Session extends DefaultSession {
    user: {
      id: string;
      isVerified?: boolean;
      // Include other custom fields you want in the session
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extended JWT type
   */
  interface JWT extends DefaultJWT {
    id: string;
    isVerified?: boolean;
    // Include any other custom fields you add to the JWT
  }
}
