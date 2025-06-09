"use client";
import ConsultRoomList from "@/components/Pharmacist/ConsultRoom/consultRoomList";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

const ConsultRoom = () => {
    // const { pharmacist } = useAuth();
    // const router = useRouter();
    // const searchParams = new URLSearchParams(window.location.search);
    // const id = searchParams.get("id");

    // useEffect(() => {
    //   if (!pharmacist) {
    //     router.push("/dang-nhap-admin");
    //   }
    // }, [pharmacist, router]);
    return (
        <div className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
            <ConsultRoomList/>
        </div>
    );
};

export default ConsultRoom;
