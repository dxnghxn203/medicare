"use client";
import { X } from "lucide-react";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/providers/toastProvider";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSelectProduct: (product: any) => void;
  product: any;
}

export default function AddDiscountDialog({
  isOpen,
  setIsOpen,
  onSelectProduct,
  product,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-center">
          Thêm giảm giá cho sản phẩm
        </h2>
        {product && (
          <div className="mb-4">
            <p className="text-sm text-gray-700">
              Sản phẩm: {product.name_primary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
