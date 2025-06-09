"use client";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import google from "@/images/google.png";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter(); // Khởi tạo router

  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      <main className="flex flex-col items-center space-y-8 pt-14 mb-10">
        <div className="mt-5 text-3xl font-extrabold text-black">Đăng ký</div>
        <div className="flex justify-center items-center rounded-3xl bg-[#0053E2] text-white h-[55px] w-full text-sm font-semibold">
          <button className="flex items-center gap-2">
            <Image src={google} alt="" width={30} className="object-cover" />
            <span>Đăng ký với Google</span>
          </button>
        </div>

        <div className="flex gap-2 items-center mt-7 max-w-full text-sm text-black w-[393px]">
          <div className="flex-1 border-t-[0.5px] border-black border-opacity-10" />
          <div className="text-black/40">hoặc </div>
          <div className="flex-1 border-t-[0.5px] border-black border-opacity-10" />
        </div>

        <Link href="/dang-ky/email" passHref>
          <button className="px-5 h-[55px] text-sm font-semibold text-black border border-solid border-black border-opacity-10 rounded-3xl w-[400px] max-md:px-5">
            Tiếp tục với email
          </button>
        </Link>

        <div className="mt-10 text-xs text-center text-black/70 w-[410px] max-md:mt-10">
          Bằng cách tạo một tài khoản, bạn đồng ý với các Điều khoản dịch vụ,
          Chính sách bảo mật và Cài đặt thông báo mặc định của chúng tôi.
        </div>

        <div className="flex mt-8 max-w-full text-sm w-[218px]">
          <div className="grow shrink font-medium text-black/70">
            Bạn đã có tài khoản?
          </div>
          <Link href="/dang-nhap" legacyBehavior>
            <a className="font-bold text-[#0053E2] hover:text-[#002E99] transition-colors">
              Đăng nhập
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
