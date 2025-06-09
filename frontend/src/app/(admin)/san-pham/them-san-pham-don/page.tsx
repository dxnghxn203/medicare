"use client";
import CreateSingleProduct from "@/components/Admin/Product/CreateProduct/createSingleProduct";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
      <CreateSingleProduct />
    </div>
  );
};

export default CreateSingle;
