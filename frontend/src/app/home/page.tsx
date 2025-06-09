"use client";
import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import ProductCatalog from "../../components/Home/productCatalog";
import ProductList from "@/components/Product/productDiscountList";
import BrandList from "@/components/BrandList/brandList";
import ProductDealsList from "@/components/Product/productDealsList";
import IntroMedicare from "../../components/Home/introMedicare";
import HealthCorner from "../../components/Home/healthCorner";

export default function Home() {
  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      {/* <Header /> */}
      <main className="flex flex-col space-y-8 px-5 justify-center items-center">
        <ProductCatalog />
        <div className="self-start text-2xl font-extrabold text-black">
          Sản phẩm bán chạy
        </div>
        <ProductList />
        <div className="self-start text-2xl font-extrabold text-black">
          Thương hiệu nổi bật
        </div>
        <BrandList />
        <div className="self-start text-2xl font-extrabold text-black">
          Deals tốt nhất hôm nay dành <br />
          cho bạn!
        </div>
        <ProductDealsList />
      </main>
      <IntroMedicare />
      <HealthCorner />
    </div>
  );
}
