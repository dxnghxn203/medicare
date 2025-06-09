"use client";
import ChangePasswordComponent from "@/components/Pharmacist/Profile/changePassWord";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

import React, { useEffect } from "react";

const ChangePassword: React.FC = () => {
  const { pharmacist } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!pharmacist) {
      router.push("/dang-nhap-admin");
    }
  }, [pharmacist, router]);
  return <ChangePasswordComponent />;
};

export default ChangePassword;
