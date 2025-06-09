"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import TableBrand from "./tableBrand";
import { useBrand } from "@/hooks/useBrand";
import AddBrandDialog from "../Dialog/addBrandDialog";

const BrandManagement = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const { getAllBrandsAdmin, fetchAllBrandsAdmin } = useBrand();
  useEffect(() => {
    fetchAllBrandsAdmin(
      () => {},
      () => {}
    );
  }, []);
  console.log("getAllBrandsAdmin", getAllBrandsAdmin);

  return (
    <div>
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-black">
          Quản lý Thương hiệu
        </h2>
        <div className="my-4 text-sm">
          <Link href="/dashboard" className="hover:underline text-blue-600">
            Dashboard
          </Link>
          <span> / </span>
          <Link href="/quan-ly-thuong-hieu" className="text-gray-850">
            Quản lý Thương hiệu
          </Link>
        </div>
        <div className="flex justify-end items-center">
          <div
            className="flex gap-2 px-2 py-2 rounded-lg text-sm items-center bg-blue-700 text-white cursor-pointer hover:bg-blue-800"
            onClick={() => setIsOpenDialog(true)}
          >
            + Thêm thương hiệu
          </div>
        </div>
        <TableBrand allBrandAdmin={getAllBrandsAdmin} />
      </div>
      <AddBrandDialog
        isOpen={isOpenDialog}
        setIsOpen={setIsOpenDialog}
        allBrandAdmin={getAllBrandsAdmin}
        mode="add"
      />
    </div>
  );
};

export default BrandManagement;
