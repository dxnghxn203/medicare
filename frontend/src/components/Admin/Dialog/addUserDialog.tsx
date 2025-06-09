import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/providers/toastProvider";
import { validateEmail, validateEmptyFields } from "@/utils/validation";
import { useUser } from "@/hooks/useUser";

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ isOpen, onClose }) => {
  const [user_name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const toast = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { fetchInsertPharmacist, fetchAllPharmacist } = useUser();

  const handleSubmit = () => {
    const dataToValidate = { user_name, phone_number, email, gender, birthday };
    const emptyFieldErrors = validateEmptyFields(dataToValidate);
    const errors: { [key: string]: string } = { ...emptyFieldErrors };
    if (!errors.email) {
      const emailError = validateEmail(dataToValidate.email);
      if (emailError) {
        errors.email = emailError;
      }
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    fetchInsertPharmacist(
      { user_name, phone_number, email, gender, birthday },
      (message) => {
        toast.showToast(message, "success");
        onClose();
        fetchAllPharmacist();
        setName("");
        setPhoneNumber("");
        setEmail("");
        setGender("");
        setBirthday("");
        setErrors({});
      },
      (message) => {
        toast.showToast(message, "error");
        setErrors({});
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[600px]">
        {/* Button đóng dialog */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>
        <h2 className="text-lg text-center font-semibold">Thêm dược sĩ</h2>
        {/* Input Name & Phone */}
        <div className="space-y-4 mt-4">
          <div className="flex gap-2 w-full justify-between">
            <div className="flex-1">
              <input
                type="text"
                value={user_name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 border rounded-lg border-black/10 
            focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
            outline-none placeholder:font-normal placeholder:text-sm w-full"
                placeholder="Tên người dùng"
              />
              {errors.user_name && (
                <span className="text-red-500 text-sm">{errors.user_name}</span>
              )}
            </div>

            <div className="flex-1">
              <input
                type="tel"
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="p-3 border rounded-lg border-black/10 
            focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
            outline-none placeholder:font-normal placeholder:text-sm w-full"
                placeholder="Số điện thoại"
              />
              {errors.phone_number && (
                <span className="text-red-500 text-sm">
                  {errors.phone_number}
                </span>
              )}
            </div>
          </div>

          {/* Input Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 p-3 border rounded-lg border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none placeholder:font-normal placeholder:text-sm"
            placeholder="Email"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}

          {/* Select gender */}
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full mt-2 p-3 border rounded-lg border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none"
          >
            <option value="">Chọn giới tính</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
          </select>
          {errors.gender && (
            <span className="text-red-500 text-sm">{errors.gender}</span>
          )}
          {/* Date birthday */}
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full mt-2 p-3 border rounded-lg border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none placeholder:font-normal"
            placeholder="Ngày sinh"
          />
          {errors.birthday && (
            <span className="text-red-500 text-sm">{errors.birthday}</span>
          )}
        </div>

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={onClose}
            className="text-sm bg-[#EAEFFA] text-[#1E4DB7] font-semibold py-2 px-6 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm bg-[#1E4DB7] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#002E99]"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserDialog;
