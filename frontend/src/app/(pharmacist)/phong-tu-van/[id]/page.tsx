"use client";
import ConsultChat from "@/components/Pharmacist/ConsultRoom/consultChat";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function App() {
  const { pharmacist } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!pharmacist) {
      router.push("/dang-nhap-admin");
    }
  }, [pharmacist, router]);
  return (
    <div>
      <ConsultChat />
    </div>
  );
}

export default App;
