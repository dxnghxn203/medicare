"use client";

import {SessionProvider, useSession} from "next-auth/react";
import React, {createContext, useContext, useEffect, useState} from "react";
import {setToken} from "@/utils/cookie";

interface UserData {
    _id: string;
    phone_number: string;
    user_name: string;
    email: string;
    gender: string;
    auth_provider: string;
    birthday: string;
    role_id: string;
    active: boolean;
    verified_email_at: string;
    created_at: string;
    updated_at: string;
}

interface AuthContextType {
    user: UserData | null;
    setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within AuthProvider");
    }
    return context;
}

function AuthContextProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const {data: session, status} = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            if (session && session.appToken) {
                setToken(session?.appToken);
            }
        }
        setIsLoading(status === "loading");
    }, [session, status]);

    return (
        <AuthContext.Provider value={{user, setUser, isLoading}}>
            {children}
        </AuthContext.Provider>
    );
}

export function AuthProvider({children, session}: { children: React.ReactNode, session?: any }) {
    return (
        <SessionProvider session={session} refetchInterval={5 * 60}>
            <AuthContextProvider>
                {children}
            </AuthContextProvider>
        </SessionProvider>
    );
}

