"use client";
import { useEffect, useState } from "react";
import Product from "@/components/Admin/Product/product";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const ProductManagement = () => {
  const router = useRouter();
  const { admin } = useAuth();

  useEffect(() => {
    if (!admin) {
      router.push("/dang-nhap-admin");
    }
  }, [admin, router]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
      <Product />
    </div>
  );
};

export default ProductManagement;
