"use client";
import {useEffect, useState} from "react";
import ManagerProducts from "@/components/Admin/Product/ManagerProducts/managerProducts";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/useAuth";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeItem, setActiveItem] = useState("Product");
    // const router = useRouter();
    // const {admin} = useAuth();
    //
    // useEffect(() => {
    //   if (!admin) {
    //     router.push("/dang-nhap-admin");
    //   }
    // }, [admin, router]);

    return (
        <div className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
            <ManagerProducts/>
        </div>
    );
};

export default Dashboard;
