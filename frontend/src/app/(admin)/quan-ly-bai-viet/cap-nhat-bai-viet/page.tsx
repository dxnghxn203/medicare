"use client";
import AddArticle from "@/components/Admin/Article/addArticle";
import EditArticle from "@/components/Admin/Article/editArticle";
import ArticleManagement from "@/components/Admin/Article/managementArticle";
import BrandManagement from "@/components/Admin/Brand/managementBrand";
import DiscountManagement from "@/components/Admin/Discount/managementDiscount";
import VoucherManagement from "@/components/Admin/Voucher/managementVoucher";
import {useAuth} from "@/hooks/useAuth";
import {Edit} from "lucide-react";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

const Dashboard = () => {
    // const router = useRouter();
    // const { admin } = useAuth();
    //
    // useEffect(() => {
    //   if (!admin) {
    //     router.push("/dang-nhap-admin");
    //   }
    // }, [admin, router]);
    return (
        <div className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
            <EditArticle/>
        </div>
    );
};

export default Dashboard;
