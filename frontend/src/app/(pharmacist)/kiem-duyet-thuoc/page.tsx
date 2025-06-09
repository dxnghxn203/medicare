"use client";

import MedicineCensorshipList from "@/components/Pharmacist/MedicineCensorship/page";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

const MedicineCensorship = () => {
    // const {pharmacist} = useAuth();
    // const router = useRouter();

    // useEffect(() => {
    //   if (!pharmacist) {
    //     router.push("/dang-nhap-admin");
    //   }
    // }, [pharmacist, router]);
    return (
        <div className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
            <MedicineCensorshipList/>
        </div>
    );
};

export default MedicineCensorship;
