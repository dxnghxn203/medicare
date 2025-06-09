import NextAuth from "next-auth";
import authOptions from "@/utils/configs/nextAuth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
