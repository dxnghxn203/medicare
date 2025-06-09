import Image from "next/image";
import { useState } from "react";

const Guide = () => {
  return (
    <div className="bg-[#F5F7F9] rounded-lg p-5 space-y-4">
      <div className="flex space-x-2">
        <div className="font-bold">Bước 1:</div>
        <div>Truy cập website và lựa chọn sản phẩm cần mua để mua hàng.</div>
      </div>
      <div className="flex space-x-2">
        <div className="font-bold">Bước 2:</div>
        <div>
          Click và sản phẩm muốn mua, màn hình hiển thị ra pop up với các lựa
          chọn sau.
        </div>
      </div>
      <div>
        Nếu bạn muốn tiếp tục mua hàng: Bấm vào phần tiếp tục mua hàng để lựa
        chọn thêm sản phẩm vào giỏ hàng
        <br />
        <br />
        Nếu bạn muốn xem giỏ hàng để cập nhật sản phẩm: Bấm vào xem giỏ hàng{" "}
        <br />
        <br />
        Nếu bạn muốn đặt hàng và thanh toán cho sản phẩm này vui lòng bấm vào:
        Đặt hàng và thanh toán
      </div>
      <div className="flex space-x-2">
        <div className="font-bold">Bước 3:</div>
        <div>Lựa chọn thông tin tài khoản thanh toán.</div>
      </div>
      <div>
        Nếu bạn đã có tài khoản vui lòng nhập thông tin tên đăng nhập là email
        và mật khẩu vào mục đã có tài khoản trên hệ thống
        <br />
        <br />
        Nếu bạn chưa có tài khoản và muốn đăng ký tài khoản vui lòng điền các
        thông tin cá nhân để tiếp tục đăng ký tài khoản. Khi có tài khoản bạn sẽ
        dễ dàng theo dõi được đơn hàng của mình
        <br />
        <br />
        Nếu bạn muốn mua hàng mà không cần tài khoản vui lòng nhấp chuột vào mục
        đặt hàng không cần tài khoản
      </div>
      <div className="flex space-x-2">
        <div className="font-bold">Bước 4:</div>
        <div>
          Điền các thông tin của bạn để nhận đơn hàng, lựa chọn hình thức thanh
          toán và vận chuyển cho đơn hàng của mình
        </div>
      </div>

      <div className="flex space-x-2">
        <div className="font-bold">Bước 5:</div>
        <div>Xem lại thông tin đặt hàng, điền chú thích và gửi đơn hàng</div>
      </div>
      <div>
        Sau khi nhận được đơn hàng bạn gửi chúng tôi sẽ liên hệ bằng cách gọi
        điện lại để xác nhận lại đơn hàng và địa chỉ của bạn. <br />
        <br />
        Trân trọng cảm ơn.
      </div>
    </div>
  );
};

export default Guide;
