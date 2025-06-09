import { comment } from "postcss";
import { use } from "react";
import { race } from "redux-saga/effects";

// Kiểm tra mật khẩu
export const validatePassword = (value: string): string | null => {
    if (!/[A-Z]/.test(value)) {
      return "Mật khẩu phải chứa ít nhất một chữ cái viết hoa.";
    }
    if (!/[a-z]/.test(value)) {
      return "Mật khẩu phải chứa ít nhất một chữ cái thường.";
    }
    if (!/[0-9]/.test(value)) {
      return "Mật khẩu phải chứa ít nhất một chữ số.";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)) {
      return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.";
    }
    if (value.length < 8) {
      return "Mật khẩu phải có ít nhất 8 ký tự.";
    }
    return null;
  };
  
  // Kiểm tra email
  export const validateEmail = (value: string): string | null => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(value) ? null : "Email không đúng định dạng!";
  };
  
  // Kiểm tra trường trống
  export const validateEmptyFields = (fields: { [key: string]: string }): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};
    
    // Bản đồ ánh xạ key sang tiếng Việt
    const keyToVietnamese: { [key: string]: string } = {
      email: "Email đăng nhập",
      password: "Mật khẩu",
      user_name: "Tên người dùng",
      phone_number: "Số điện thoại",
      gender: "Giới tính",
      dateOfBirth: "Ngày sinh",
      confirmPassword: "Xác nhận mật khẩu",
      comment: "Nội dung bình luận",
      rating: "Đánh giá",
      main_category_name: "Tên danh mục chính",
      main_category_slug: "URL danh mục chính",
      sub_category_name: "Tên danh mục cấp 1",
      sub_category_slug: "URL danh mục cấp 1",
      old_password: "Mật khẩu cũ",
      new_password: "Mật khẩu mới",
      name: "Tên người dùng",
      rejected_note: "Ghi chú từ chối",
      note: "Lý do từ chối",
      birthday: "Ngày sinh",

      
    };
    
  
    for (const [key, value] of Object.entries(fields)) {
      if (!value.trim()) {
        const vietnameseKey = keyToVietnamese[key] || key; // Sử dụng key gốc nếu không có ánh xạ
        errors[key] = `${vietnameseKey} không được để trống.`;
      }
    }
    return errors;
  };
  
  