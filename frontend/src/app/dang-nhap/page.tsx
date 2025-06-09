"use client";
import { useEffect, useState } from "react";
import LoginForm from "../../components/Login/loginForm";
import AlreadyLoggedIn from "../../components/Login/alreadyLoggedIn";
import { useToast } from "@/providers/toastProvider";
import { ToastType } from "@/components/Toast/toast";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      <main className="flex flex-col items-center space-y-8 pt-14">
        <h1 className="mt-5 text-3xl font-extrabold text-black">
          {isAuthenticated ? "Bạn đã đăng nhập" : "Đăng nhập"}
        </h1>

        {isAuthenticated ? <AlreadyLoggedIn /> : <LoginForm />}
      </main>
    </div>
  );
}
