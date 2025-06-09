"use client";
import {useEffect, useState} from "react";
import UserManagement from "@/components/Admin/User/userManagement";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";

const Dashboard = () => {

    return (
        <div className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
            <UserManagement/>
        </div>
    );
};

export default Dashboard;
