"use client";

import Sidebar from "@/components/Pharmacist/Sidebar/sidebar";
import Header from "@/components/Pharmacist/Header/header";
import {useState} from "react";
import {PHARMACIST_ROUTES} from "@/utils/constants";
import {getTokenPharmacist} from "@/utils/cookie";
import ErrorRole from "@/components/Error/errorRole";
import {usePathname} from "next/navigation";

export default function PharmacistLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    if (PHARMACIST_ROUTES.includes(pathname as typeof PHARMACIST_ROUTES[number]) && !getTokenPharmacist()) {
        return <ErrorRole/>;
    }

    return (
        <div className="admin-layout">
            <div className="flex h-screen overflow-hidden">
                <Sidebar isOpen={sidebarOpen}/>
                <div className="flex flex-col flex-1 h-screen">
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
                    <main className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
