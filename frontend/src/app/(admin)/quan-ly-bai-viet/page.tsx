"use client";
import ArticleManagement from "@/components/Admin/Article/managementArticle";
import BrandManagement from "@/components/Admin/Brand/managementBrand";
import DiscountManagement from "@/components/Admin/Discount/managementDiscount";
import VoucherManagement from "@/components/Admin/Voucher/managementVoucher";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

const Dashboard = () => {

    return (
        <div className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
            <ArticleManagement/>
        </div>
    );
};

export default Dashboard;
