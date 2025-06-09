"use client";
import { useEffect, useState } from "react";
import BulkCreateProduct from "@/components/Admin/Product/BulkCreateProducts/bulkCreateProduct";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const CreateSingle = () => {
  const router = useRouter();
  const { admin } = useAuth();

  useEffect(() => {
    if (!admin) {
      router.push("/dang-nhap-admin");
    }
  }, [admin, router]);
  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
      <BulkCreateProduct />
    </div>
  );
};

export default CreateSingle;
