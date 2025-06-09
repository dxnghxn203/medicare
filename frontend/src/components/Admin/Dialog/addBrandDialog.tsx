"use client";
import { Pencil, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useToast } from "@/providers/toastProvider";
import { useBrand } from "@/hooks/useBrand";
import { MdOutlineEdit } from "react-icons/md";
import DynamicReactQuill from "../Product/CreateProduct/dynamicReactQuill";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  allBrandAdmin: any[];
  selectedBrand?: any | null;
  mode: "add" | "edit";
}

export default function AddBrandDialog({
  isOpen,
  setIsOpen,
  allBrandAdmin,
  selectedBrand,
  mode,
}: Props) {
  const toast = useToast();
  const {
    fetchAddBrandAdmin,
    fetchAllBrandsAdmin,
    fetchUpdateBrandAdmin,
    fetchUpdateLogoBrandAdmin,
  } = useBrand();
  const [brandData, setBrandData] = useState({
    name: "",
    description: "",
    category: "",
    active: true,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    } else {
      setLogoPreview(null);
    }
  };
  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);
  useEffect(() => {
    if (mode === "edit" && selectedBrand) {
      setBrandData({
        name: selectedBrand.name || "",
        description: selectedBrand.description || "",
        category: selectedBrand.category || "",
        active: selectedBrand.active ?? true,
      });
      if (selectedBrand.logo && typeof selectedBrand.logo === "string") {
        setLogoPreview(selectedBrand.logo);
      } else {
        setLogoPreview(null);
      }
      setLogoFile(null);
    } else {
      resetForm();
    }
  }, [selectedBrand, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setBrandData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const resetForm = () => {
    setBrandData({
      name: "",
      description: "",
      category: "",
      active: true,
    });
    setLogoFile(null);
    setLogoPreview(null);
  };
  const handleSubmit = () => {
    console.log("Submitting edit for brand_id:", selectedBrand?.brand_id);
    console.log("Logo file:", logoFile);
    if (!brandData.name) {
      toast.showToast("Tên thương hiệu là bắt buộc", "error");
      return;
    }

    if (mode === "edit" && selectedBrand?.brand_id) {
      const body = {
        brand_id: selectedBrand.brand_id,
        name: brandData.name,
        description: brandData.description,
        category: brandData.category,
        active: brandData.active,
      };

      const isBrandUpdated =
        brandData.name !== (selectedBrand.name || "") ||
        brandData.description !== (selectedBrand.description || "") ||
        brandData.category !== (selectedBrand.category || "") ||
        brandData.active !== (selectedBrand.active ?? true);

      const isLogoUpdated = !!logoFile;

      if (isBrandUpdated && isLogoUpdated) {
        fetchUpdateBrandAdmin(
          body,
          () => {
            toast.showToast("Cập nhật thương hiệu thành công!", "success");
            setIsOpen(false);
            const logoFormData = new FormData();
            logoFormData.append("logo", logoFile!);
            fetchUpdateLogoBrandAdmin(
              logoFormData,
              selectedBrand.brand_id,
              () => {
                toast.showToast("Cập nhật logo thành công!", "success");
                setIsOpen(false);

                fetchAllBrandsAdmin(
                  () => {},
                  () => {}
                );
              },
              () => {
                toast.showToast("Cập nhật logo thất bại!", "error");
              }
            );
          },
          () => {
            toast.showToast("Cập nhật thương hiệu thất bại!", "error");
          }
        );
      } else if (isBrandUpdated && !isLogoUpdated) {
        fetchUpdateBrandAdmin(
          body,
          () => {
            toast.showToast("Cập nhật thương hiệu thành công!", "success");
            setIsOpen(false);
            fetchAllBrandsAdmin(
              () => {},
              () => {}
            );
          },
          () => {
            toast.showToast("Cập nhật thương hiệu thất bại!", "error");
          }
        );
      } else if (!isBrandUpdated && isLogoUpdated) {
        console.log("isLogoUpdated", isLogoUpdated);
        const logoFormData = new FormData();
        logoFormData.append("logo", logoFile);
        console.log("logoFormData", logoFormData);
        console.log("selectedBrand.brand_id", selectedBrand.brand_id);

        fetchUpdateLogoBrandAdmin(
          logoFormData,
          selectedBrand.brand_id,
          () => {
            toast.showToast("Cập nhật logo thành công!", "success");
            setIsOpen(false);
            fetchAllBrandsAdmin(
              () => {},
              () => {}
            );
          },
          () => {
            toast.showToast("Cập nhật logo thất bại!", "error");
          }
        );
      } else {
        toast.showToast("Không có thay đổi để cập nhật", "info");
        fetchAllBrandsAdmin(
          () => {},
          () => {}
        );
      }
    } else {
      const formData = new FormData();
      formData.append("name", brandData.name);
      formData.append("description", brandData.description);
      formData.append("category", brandData.category);
      formData.append("active", String(brandData.active));
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      fetchAddBrandAdmin(
        formData,
        () => {
          toast.showToast("Thêm thương hiệu thành công", "success");
          setIsOpen(false);
          fetchAllBrandsAdmin(
            () => {},
            () => {}
          );
          setBrandData({
            name: "",
            description: "",
            category: "",
            active: true,
          });
          setLogoFile(null);
        },
        () => {
          toast.showToast("Thêm thương hiệu thất bại", "error");
        }
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-center">
          {mode === "edit" ? "Cập nhật thương hiệu" : "Thêm thương hiệu mới"}
        </h2>
        <div className="max-h-[400px] overflow-y-auto flex flex-col scrollbar-hide">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="col-span-2">
              <label className="block mb-1 text-gray-600">Logo</label>
              {mode === "add" ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border rounded-lg p-2"
                />
              ) : (
                <div>
                  {logoPreview && (
                    <div className="relative mt-2 w-fit">
                      <img
                        src={logoPreview}
                        alt="Preview logo"
                        className="max-h-24 object-contain border rounded"
                      />

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-gray-100"
                        title="Chỉnh sửa ảnh"
                      >
                        <MdOutlineEdit className="w-4 h-4 text-gray-600" />
                      </button>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="col-span-2">
              <label className="block mb-1 text-gray-600">
                Tên thương hiệu *
              </label>
              <input
                type="text"
                name="name"
                value={brandData.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="Tên thương hiệu..."
              />
            </div>

            <div className="col-span-2">
              <label className="block mb-1 text-gray-600">Mô tả</label>
              <DynamicReactQuill
                value={brandData.description}
                onChange={(value) => {
                  setBrandData((prev) => ({
                    ...prev,
                    description: value,
                  }));
                }}
              />
              {/* <textarea
              name="description"
              value={brandData.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              rows={3}
              placeholder="Mô tả về thương hiệu..."
            ></textarea> */}
            </div>

            <div className="col-span-2">
              <label className="block mb-1 text-gray-600">Danh mục</label>
              <input
                type="text"
                name="category"
                value={brandData.category}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="Thời trang, thực phẩm, công nghệ,..."
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 text-sm"
          >
            {mode === "edit" ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
}
