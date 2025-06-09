"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/providers/toastProvider";
import TableBrand from "./articleTable";
import { useBrand } from "@/hooks/useBrand";
import AddBrandDialog from "../Dialog/addBrandDialog";
import { useArticle } from "@/hooks/useArticle";
import { useRouter } from "next/navigation";

const ArticleManagement = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any[]>([]);
  const toast = useToast();
  const { getAllArticlesAdmin, fetchAllArticlesAdmin } = useArticle();
  const router = useRouter();
  useEffect(() => {
    fetchAllArticlesAdmin(
      () => {},
      () => {}
    );
  }, []);
  console.log("getAllArticlesAdmin", getAllArticlesAdmin);

  return (
    <div>
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-black">Quản lý Bài viết</h2>
        <div className="my-4 text-sm">
          <Link href="/dashboard" className="hover:underline text-blue-600">
            Dashboard
          </Link>
          <span> / </span>
          <Link href="/quan-ly-bai-viet" className="text-gray-850">
            Quản lý Bài viết
          </Link>
        </div>
        <div className="flex justify-end items-center">
          <div
            className="flex gap-2 px-2 py-2 rounded-lg text-sm items-center bg-blue-700 text-white cursor-pointer hover:bg-blue-800"
            onClick={() => router.push("/quan-ly-bai-viet/them-bai-viet")}
          >
            + Thêm bài viết
          </div>
        </div>
        <TableBrand allArticleAdmin={getAllArticlesAdmin} />
      </div>
      <AddBrandDialog
        isOpen={isOpenDialog}
        setIsOpen={setIsOpenDialog}
        allBrandAdmin={getAllArticlesAdmin}
        mode="add"
      />
    </div>
  );
};

export default ArticleManagement;
