"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/providers/toastProvider";
import { useAuth } from "@/hooks/useAuth";

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: { label: string; value: string; type?: string }[];
  role_type: string;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  isOpen,
  onClose,
  userInfo,
  role_type,
}) => {
  const toast = useToast();
  const [formDataUpdate, setFormDataUpdate] = useState({
    username: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
  });
  const [formData, setFormData] = useState(
    Object.fromEntries(
      userInfo
        .filter((item) => item.label !== "Email")
        .map((item) => [item.label, item.value])
    )
  );

  const { fetchupdateUser, fetchupdateAdmin, fetchupdatePharmacist } =
    useAuth();
  const {
    fetchUpdateUserInfo,
    fetchUpdateAdminInfo,
    fetchUpdatePharmacistInfo,
  } = useUser();

  useEffect(() => {
    if (isOpen) {
      const filteredInfo = userInfo.filter((item) => item.label !== "Email");
      setFormData(
        Object.fromEntries(filteredInfo.map((item) => [item.label, item.value]))
      );
      setFormDataUpdate({
        username:
          userInfo.find((item) => item.label === "Họ và tên")?.value || "",
        phoneNumber:
          userInfo.find((item) => item.label === "Số điện thoại")?.value || "",
        gender:
          userInfo.find((item) => item.label === "Giới tính")?.value || "",
        dateOfBirth:
          userInfo.find((item) => item.label === "Ngày sinh")?.value || "",
      });
    }
  }, [isOpen, userInfo]);

  const handleSubmit = async () => {
    try {
      if (
        formDataUpdate.username === "" ||
        formDataUpdate.phoneNumber === "" ||
        formDataUpdate.gender === "" ||
        formDataUpdate.dateOfBirth === ""
      ) {
        toast.showToast("Vui lòng nhập đầy đủ thông tin", "error");
        return;
      }
      if (role_type === "admin") {
        fetchUpdateAdminInfo({
          param: formDataUpdate,
          onSuccess: (message) => {
            console.log("formDataUpdate", formDataUpdate);
            toast.showToast(message, "success");
            fetchupdateAdmin(formDataUpdate);
            onClose();
          },
          onFailure: (message) => {
            toast.showToast(message, "error");
          },
        });
        return;
      }
      if (role_type === "pharmacist") {
        fetchUpdatePharmacistInfo({
          param: formDataUpdate,
          onSuccess: (message) => {
            console.log("formDataUpdate", formDataUpdate);
            toast.showToast(message, "success");
            fetchupdatePharmacist(formDataUpdate);
            onClose();
          },
          onFailure: (message) => {
            toast.showToast(message, "error");
          },
        });
        return;
      }
      if (role_type === "user") {
        fetchUpdateUserInfo({
          param: formDataUpdate,
          onSuccess: (message) => {
            console.log("formDataUpdate", formDataUpdate);
            toast.showToast(message, "success");
            fetchupdateUser(formDataUpdate);
            onClose();
          },
          onFailure: (message) => {
            toast.showToast(message, "error");
          },
        });
      }
    } catch (error) {
      console.error("Error during updating information:", error);
    }
  };

  const handleChange = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }));

    if (label === "Họ và tên") {
      setFormDataUpdate((prev) => ({ ...prev, username: value }));
    } else if (label === "Số điện thoại") {
      setFormDataUpdate((prev) => ({ ...prev, phoneNumber: value }));
    } else if (label === "Giới tính") {
      setFormDataUpdate((prev) => ({ ...prev, gender: value }));
    } else if (label === "Ngày sinh") {
      setFormDataUpdate((prev) => ({ ...prev, dateOfBirth: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg relative w-[450px] shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-6 text-center">
          Chỉnh sửa thông tin
        </h2>

        <div className="space-y-4">
          {userInfo
            .filter(
              (item) =>
                !["Giới tính", "Ngày sinh", "Email"].includes(item.label)
            )
            .map((item, index) => (
              <div key={index} className="flex flex-col space-y-2">
                <label className="text-sm font-semibold">{item.label}</label>
                <input
                  type={item.type || "text"}
                  value={formData[item.label]}
                  onChange={(e) => handleChange(item.label, e.target.value)}
                  className="px-4 py-4 rounded-lg outline-none border border-gray-300 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2]"
                />
              </div>
            ))}
          {userInfo.some((item) => item.label === "Giới tính") && (
            <div className="flex gap-4">
              {/* Giới tính */}
              <div className="flex flex-col w-1/2 space-y-2">
                <label className="text-sm font-semibold">Giới tính</label>
                <select
                  value={formData["Giới tính"]}
                  onChange={(e) => handleChange("Giới tính", e.target.value)}
                  className="px-4 py-4 rounded-lg outline-none border border-gray-300 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2]"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              {/* Ngày sinh */}
              <div className="flex flex-col w-1/2 space-y-2">
                <label className="text-sm font-semibold">Ngày sinh</label>
                <input
                  type="date"
                  value={formData["Ngày sinh"]}
                  onChange={(e) => handleChange("Ngày sinh", e.target.value)}
                  className="px-4 py-4 rounded-lg outline-none border border-gray-300 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-[#EAEFFA] text-[#0053E2] font-semibold w-[140px] py-3 rounded-lg"
          >
            Hủy
          </button>
          <button
            className="bg-[#0053E2] text-white font-semibold w-[140px] py-3 rounded-lg hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileDialog;
