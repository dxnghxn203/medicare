import React from "react";

const SubscribeNewsletter: React.FC = () => {
  return (
    <div className="flex flex-col items-center self-stretch pt-7 pb-14 w-full text-sm text-black bg-blue-50 max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col items-center max-w-full w-[634px]">
        <div className="text-2xl font-extrabold">Đăng ký nhận bản tin</div>

        <form className="flex gap-5 justify-between pl-7 mt-5 ml-5 max-w-full text-black bg-white rounded-[30px] w-[401px] max-md:pl-5">
          <input
            type="email"
            placeholder="Nhập email của bạn"
            className="flex-1 bg-transparent border-none outline-none text-sm px-2 "
            aria-label="Nhập email của bạn"
          />
          <button
            type="submit"
            className="px-6 py-4 font-semibold bg-blue-700 rounded-[30px] max-md:px-5 text-white"
          >
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscribeNewsletter;
