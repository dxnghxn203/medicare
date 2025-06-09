"use client";

import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import {usePathname, useRouter} from "next/navigation";
import {
    ADMIN_ROUTES,
    PARTNER_ROUTES,
    PHARMACIST_ROUTES,
} from "@/utils/constants";
import {getToken, getTokenAdmin, getTokenPharmacist} from "@/utils/cookie";

export function TemplateProvider({children}: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isAdmin = ADMIN_ROUTES.some(
        (route) => pathname?.startsWith(route) ?? false
    );
    const isPartner = PARTNER_ROUTES.some(
        (route) => pathname?.startsWith(route) ?? false
    );
    const isPharmacist = PHARMACIST_ROUTES.some(
        (route) => pathname?.startsWith(route) ?? false
    );

    return (
        <>
            {isAdmin || isPartner || isPharmacist ? null : <Header/>}
            {children}
            {isAdmin || isPartner || isPharmacist ? null : <Footer/>}
        </>
    );
}
