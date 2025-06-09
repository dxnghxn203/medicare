"use client";
import Order from "@/components/Admin/Order/orderManagement";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

const Dashboard = () => {

    return (
        <div className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
            <Order/>
        </div>
    );
};

export default Dashboard;
