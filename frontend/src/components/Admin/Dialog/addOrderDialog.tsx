import { useState } from "react";
import { X } from "lucide-react";

interface AddOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrder: (Order: {
    name: string;
    email: string;
    phoneNumber: number;
    role: string;
    password: string;
    confirmPassword: string;
  }) => void;
}

const AddOrderDialog: React.FC<AddOrderDialogProps> = ({
  isOpen,
  onClose,
  onAddOrder,
}) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Order");

  const handleSubmit = () => {
    if (!name || !email || !phoneNumber || !password || !confirmPassword) {
      alert("Please enter all fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    onAddOrder({
      name,
      phoneNumber: parseInt(phoneNumber),
      email,
      password,
      role,
      confirmPassword,
    });
    onClose();
  };

  if (!isOpen) return null; // Ẩn dialog nếu isOpen = false

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[600px]">
        {/* Button đóng dialog */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-lg text-center font-semibold">Add New Order</h2>

        {/* Input Name & Phone */}
        <div className="flex gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-2 p-3 border rounded-lg border-black/10 
            focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
            outline-none placeholder:font-normal"
            placeholder="Enter name"
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full mt-2 p-3 border rounded-lg border-black/10 
            focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
            outline-none placeholder:font-normal"
            placeholder="Enter phone number"
          />
        </div>

        {/* Input Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-2 p-3 border rounded-lg border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none placeholder:font-normal"
          placeholder="Enter email"
        />

        {/* Input Password */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-2 p-3 border rounded-lg border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none placeholder:font-normal"
          placeholder="Enter password"
        />

        {/* Confirm Password */}
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mt-2 p-3 border rounded-lg border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none placeholder:font-normal"
          placeholder="Confirm password"
        />

        {/* Select Role */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mt-2 p-3 border rounded-lg border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none"
        >
          <option value="Order">Order</option>
          <option value="Admin">Admin</option>
        </select>

        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={onClose}
            className="text-sm bg-[#EAEFFA] text-[#1E4DB7] font-semibold py-2 px-6 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm bg-[#1E4DB7] text-white font-semibold py-2 px-6 rounded-xl hover:bg-[#002E99]"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOrderDialog;
