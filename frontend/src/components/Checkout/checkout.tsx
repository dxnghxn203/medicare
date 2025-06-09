"use client";
import { ChevronLeft } from "lucide-react";
import React from "react";
import Delivery from "./CheckoutInfo/pickupPharma";
import ProductList from "./ProductInfo/productList";
import OrderSummary from "./ProductInfo/orderSumary";

const CheckOut = ({
  back,
  productForCheckOut,
  price,
  setData,
  handleCheckout,
  shippingFee,
  vouchers,
  setVouchers,
}: any) => {
  return (
    <main className="flex flex-col px-5">
      <div className="flex flex-col">
        <div className="pt-14">
          <a
            onClick={back}
            className="inline-flex items-center text-[#0053E2] hover:text-[#002E99] transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Quay lại giỏ hàng</span>
          </a>
        </div>
        <h3 className="font-semibold mt-2 mb-3 ml-4">Sản phẩm đã chọn</h3>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 rounded-xl">
          <ProductList products={productForCheckOut} />
          <Delivery setData={setData} />
        </div>
        <OrderSummary
          totalAmount={price?.total_price || 0}
          totalOriginPrice={price?.total_original_price || 0}
          totalDiscount={price?.total_discount || 0}
          totalSave={price?.total_discount || 0}
          shippingFee={shippingFee || 0}
          checkout={handleCheckout}
          vouchers={vouchers}
          setVouchers={setVouchers}
        />
      </div>
    </main>
  );
};

export default CheckOut;
