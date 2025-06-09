"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useToast} from "@/providers/toastProvider";
import {useAuth} from "@/hooks/useAuth";
import {FaDollarSign, FaEye, FaTrash, FaUsers} from "react-icons/fa6";
import {FaEdit, FaShoppingCart} from "react-icons/fa";
import OverviewCards from "@/components/Admin/Dashboard/OverviewCards";
import SalesChart from "@/components/Admin/Dashboard/SalesChart";
import LatestOrders from "@/components/Admin/Dashboard/LatestOrders";
import TopSellingMedicine from "@/components/Admin/Dashboard/TopSellingMedicine";

const Dashboard = () => {


    return (
        <div className="min-h-screen space-y-6">
            <OverviewCards/>
        </div>
    );
};
export default Dashboard;
