"use client";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useToast } from "@/providers/toastProvider";
import { useVoucher } from "@/hooks/useVoucher";
import toast from "@/components/Toast/toast";

interface Props {
  voucher: any;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  fetchVoucher: () => void;
}

function formatDateToInput(dateStr: string) {
  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
}


export default function UpdateVoucherDialog({
  voucher,
  isOpen,
  setIsOpen,
  setPage,
  setPageSize,
  page,
  pageSize,
  fetchVoucher
}: Props) {
  const toast = useToast();
  const { fetchUpdateVoucher, fetchAllVouchers } = useVoucher();

  const [voucherData, setVoucherData] = useState({
    voucher_name: "",
    inventory: 0,
    description: "",
    discount: 0,
    min_order_value: 0,
    max_discount_value: 0,
    voucher_type: "",
    expired_date: "",
  });

  useEffect(() => {
    if (voucher) {
      setVoucherData({
        voucher_name: voucher.voucher_name || "",
        inventory: voucher.inventory || 0,
        description: voucher.description || "",
        discount: voucher.discount || 0,
        min_order_value: voucher.min_order_value || 0,
        max_discount_value: voucher.max_discount_value || 0,
        voucher_type: voucher.voucher_type || "",
        expired_date: voucher.expired_date
        ? formatDateToInput(voucher.expired_date)
        : "",
      });
    }
  }, [voucher]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVoucherData((prev) => ({
      ...prev,
      [name]:
        name === "voucher_name" ||
        name === "description" ||
        name === "voucher_type" ||
        name === "expired_date"
          ? value
          : Number(value),
    }));
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVoucherData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !voucherData.voucher_name ||
      voucherData.discount <= 0 ||
      voucherData.min_order_value <= 0 ||
      voucherData.max_discount_value <= 0 ||
      !voucherData.voucher_type ||
      !voucherData.expired_date
    ) {
      toast.showToast("Vui lòng nhập đầy đủ thông tin giảm giá", "error");
      return;
    }
    if (voucherData.inventory <= 0) {
      toast.showToast("Số lượng phải lớn hơn 0", "error");
      return;
    }
    if (voucherData.discount > 100) {
      toast.showToast("% giảm giá phải nhỏ hơn hoặc bằng 100", "error");
      return;
    }

    if (voucherData.min_order_value < voucherData.max_discount_value) {
      toast.showToast("Giá trị đơn hàng phải lớn hơn hoặc bằng giá trị giảm giá", "error");
      return;
    }
    const body = {
      voucher_id: voucher.voucher_id,
      voucher_name: voucherData.voucher_name,
      inventory: voucherData.inventory,
      description: voucherData.description,
      discount: voucherData.discount,
      min_order_value: voucherData.min_order_value,
      max_discount_value: voucherData.max_discount_value,
      voucher_type: voucherData.voucher_type,
      expired_date: voucherData.expired_date,
    };
    fetchUpdateVoucher(
      body,
      () => {
        toast.showToast("Cập nhật voucher thành công", "success");
        setVoucherData({
          voucher_name: "",
          inventory: 0,
          description: "",
          discount: 0,
          min_order_value: 0,
          max_discount_value: 0,
          voucher_type: "",
          expired_date: "",
        });
        fetchVoucher();
      },
      () => {
        toast.showToast("Cập nhật voucher thất bại", "error");
      }
    );
    // fetchAllVouchers(page, pageSize, () => {}, () => {});  
    setIsOpen(false);
  };

  if (!isOpen || !voucher) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl  overflow-y-auto p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-center">
          Cập nhật voucher {voucher.voucher_id}
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block mb-1 text-gray-600">Tên voucher</label>
            <input
              type="text"
              name="voucher_name"
              value={voucherData.voucher_name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="Voucher siêu khuyến mãi..."
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Số lượng</label>
            <input
              type="number"
              name="inventory"
              value={voucherData.inventory}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Đã dùng</label>
            <input
              name="inventory"
              value={voucher.used}
              readOnly
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">
              Phần trăm giảm (%)
            </label>
            <input
              type="number"
              name="discount"
              value={voucherData.discount}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Loại voucher</label>
            <select
              name="voucher_type"
              value={voucherData.voucher_type}
              onChange={handleSelectChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="" disabled hidden>-- Chọn loại voucher --</option>
              <option value="delivery">Vận chuyển</option>
              <option value="order">Đơn hàng</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-gray-600">
              Giá trị đơn hàng tối thiểu (đ)
            </label>
            <input
              type="number"
              name="min_order_value"
              value={voucherData.min_order_value}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">
              Giá trị giảm tối đa (đ)
            </label>
            <input
              type="number"
              name="max_discount_value"
              value={voucherData.max_discount_value}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
              <div>
                <label className="block mb-1 text-gray-600">Ngày hết hạn</label>
                <input
                  type="date"
                  name="expired_date"
                  value={voucherData.expired_date}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  min={formatDateToInput(new Date().toISOString())}
                />
              </div>

          <div className="col-span-2">
            <label className="block mb-1 text-gray-600">Mô tả</label>
            <textarea
              name="description"
              value={voucherData.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              rows={3}
            ></textarea>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 text-sm "
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}
