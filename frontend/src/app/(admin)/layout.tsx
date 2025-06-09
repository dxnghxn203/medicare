"use client";

import Sidebar from "@/components/Admin/Sidebar/sidebar";
import Header from "@/components/Admin/Header/header";
import {useState} from "react";
import {usePathname} from "next/navigation";
import {getTokenAdmin} from "@/utils/cookie";
import {ADMIN_ROUTES} from "@/utils/constants";
import ErrorRole from "@/components/Error/errorRole";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    if (
        pathname === "/dang-nhap-admin" ||
        pathname === "/dang-ky-admin" ||
        pathname === "/quen-mat-khau-role" ||
        pathname === "/dang-ky-admin/xac-thuc-[email]"
    ) {
        return <>{children}</>;
    }
    if (ADMIN_ROUTES.includes(pathname as typeof ADMIN_ROUTES[number]) && !getTokenAdmin()) {
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
