import GoogleProvider from "next-auth/providers/google";
import type {NextAuthOptions} from "next-auth";
import {signInWithGoogle} from "@/services/authService";

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            authorization: {
                params: {
                    prompt: "select_account",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    callbacks: {
        async jwt({token, account, user}) {

            if (account && user) {
                token.accessToken = account.access_token;
                token.userId = user.id;

                try {
                    const response: any = await signInWithGoogle({
                        id_token: account.id_token as string,
                        email: user?.email as string,
                    });

                    if (response?.status_code === 200) {
                        token.appToken = response?.data?.token;
                    } else {
                        console.error("API error:", response);
                    }
                } catch (error) {
                    console.error("Error in signInWithGoogle:", error);
                }
            }

            return token;
        },

        async session({session, token}) {

            if (!session) session = {user: {}} as any;
            if (!session.user) session.user = {};

            session.accessToken = token.accessToken as string;
            session.user.id = token.userId as string;
            session.appToken = token.appToken as string;


            return session;
        },
    },
    debug: true,
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
