interface AuthSliceState {
    loading: boolean;
}

interface GoogleSignInData {
    email: string,
    id_token: string,
    accessToken: string,
}

interface LoginData {
    email: string,
    password: string,
}

interface AuthResponse {
    success: boolean;
    user?: any;
    token?: string;
    message?: string;
    admin?: any;
    pharmacist?: any;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role?: string;
}

export interface Admin {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role?: string;
}

export interface Pharmacist {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role?: string;
}

export interface AuthState {
    user: any | null;
    admin: any | null;
    pharmacist: any | null;
    isAdmin: boolean;
    isPharmacist: boolean;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface GoogleLoginPayload {
    idToken: string;
    accessToken: string;
    email: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

